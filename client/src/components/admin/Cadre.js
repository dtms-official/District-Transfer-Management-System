import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Select,
  Card,
  message,
  Spin,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import useCheckAdminAuth from "../../utils/checkAdminAuth";

const { Option } = Select;

const Cadre = () => {
  const [form] = Form.useForm();
  const [staffList, setStaffList] = useState([]);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { adminData } = useCheckAdminAuth();
  const [workplaceData, setWorkplaceData] = useState([]);
  const [selectedWorkplace, setSelectedWorkplace] = useState(null); // ✅ Fix variable declaration
  
  const workplaceId = adminData.workplace_id || null;
  const adminRole = adminData.adminRole || null;

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/workplace`
        );
        setWorkplaceData(response.data);
      } catch (error) {
        console.error("Error fetching workplaces:", error);
      }
    };

    fetchWorkplaces();
    fetchStaff();
  }, []);
  
// correct the issue in this line
const handleUpdate = (record) => {
  setEditingStaff(record);
  form.setFieldsValue({
    service: record.service, // Ensure this matches the form field name
    approvedCadre: record.approvedCadre, // Ensure this matches the form field name
    existingCadre: record.existingCadre, // Ensure this matches the form field name
  });
  setIsModalVisible(true);
};

const onUpdate = async (values) => {
  try {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/admin/cadre/${editingStaff._id}`, // editingStaff.key is now _id
      values
    );
    message.success("Cadre updated successfully!");
    fetchStaff(); // Refresh the data
    setIsModalVisible(false);
    setEditingStaff(null);
    form.resetFields();
  } catch (error) {
    console.error(   error.response?.data?.error ||
      "Failed to update data");
    message.error(   error.response?.data?.error ||
      "Failed to update data");
  }
};

  const fetchStaff = async () => {
    const token = localStorage.getItem("adminToken");
  
    if (!token) {
      message.error("Unauthorized! Please log in as an admin.");
      return;
    }
  
    setLoading(true); 
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/cadre`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Correctly pass headers as part of the config object
        }
      );
  
      const formattedData = response.data.map((item) => ({
        key: item.id, 
        ...item,
      }));
  
      setStaffList(formattedData);
    } catch (error) {
      console.error("Error fetching staff data:", error);
      message.error("Error fetching staff data. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  // Filtered staff list based on selected workplace
  const filteredStaffList = selectedWorkplace
  ? staffList.filter((staff) => staff.workplace_id === selectedWorkplace)
  : staffList;

  const handleWorkplaceChange = (value) => {
    setSelectedWorkplace(value);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (!workplaceId) {
        throw new Error("Workplace ID is missing.");
      }
  
      const newStaff = {
        ...values,
        workplace_id: workplaceId, // Ensure workplaceId exists
      };
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/cadre`,
        newStaff
      );
  
      if (response.status === 201 || response.status === 200) {
        setStaffList((prevList) => [
          ...prevList,
          { key: response.data._id, ...response.data },
        ]);
  
        form.resetFields();
        message.success("Staff added successfully!");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error adding staff:", error?.response?.data || error.message);
      message.error(error?.response?.data?.message || "Failed to add staff. Try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    // Check if the user has an admin token
    const token = localStorage.getItem("adminToken");
  
    if (!token) {
      message.error("Unauthorized! Please log in as an admin.");
      return;
    }
  
    // Fetch total users or any other relevant admin data
    axios
      .get(`${process.env.REACT_APP_API_URL}/admin/cadre`,{
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.length) {
          setUsers(data); // Store users for further use if needed
          setAllUsers(data); // Potentially reset or store all users if necessary
        } else {
          message.error("No users found");
        }
      })
      .catch((error) =>
        message.error(error.response?.data?.error || "Failed to load user data")
      )
      .finally(() => setLoading(false));
  }, []);
  

  const columns = [
    { title: "Cadre Category", dataIndex: "service", key: "service" },
    { title: "Approved cadre", dataIndex: "approvedCadre", key: "approvedCadre" },
    { title: "Existing cadre", dataIndex: "existingCadre", key: "existingCadre" },
    {
      title: "Last Update",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => {
        const date = new Date(updatedAt); 
          const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const day = String(date.getDate()).padStart(2, "0");
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
  
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; 
  
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
        return formattedDate; 
      },
    },
  ];

  if (
    adminRole === "superAdmin" ||
    adminRole === "checkingAdmin" ||
    adminRole === "recommendAdmin" ||
    adminRole === "approvalAdmin"
  ){
    columns.unshift({ 
      title: "Workplace", 
      dataIndex: "workplace_id", 
      key: "workplace_id",
      render: (_, record) => 
        workplaceData.find((wp) => wp._id === record.workplace_id)?.workplace || "Unknown"
    });
  }
  
  // Add "Action" column only if the user is NOT a super-admin
  if (adminRole !== "superAdmin") {
    columns.push({
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          className="btn bg-blue-500 text-white"
          style={{ marginLeft: 8 }}
          onClick={() => handleUpdate(record)}
        >
          Update
        </Button>
      ),
    });
  }  

  
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin
          size="large"
          tip="Loading..."
          style={{ fontSize: "24px", transform: "scale(2)" }} // Enlarges the spinner
        />
      </div>
    );

    return (
      <div className="p-4 max-w-4xl mx-auto">
        
        {/* Show the form only if the admin is NOT a Super Admin */}
        {adminRole !== "superAdmin" && (
          <Card title="Add Government Cadre" className="mb-4 rounded-lg"> 
            <Form form={form} layout="vertical" onFinish={onFinish}>
  <Form.Item name="service" label="Cadre Category" rules={[{ required: true }]}>
    <Select placeholder="Select a cadre category">
      <Option value="Divisional Secretary">Divisional Secretary</Option>
      <Option value="Assistant Divisional Secretary">Assistant Divisional Secretary</Option>
      <Option value="Accountant">Accountant</Option>
      <Option value="Engineer">Engineer</Option>
      <Option value="DP/DDP/ADP">DP/DDP/ADP</Option>
      <Option value="Administrative Officer">Administrative Officer</Option>
      <Option value="Administrative Grama Niladhari">Administrative Grama Niladhari</Option>
      <Option value="Development Officer (Public Administration)">Development Officer (Public Administration)</Option>
      <Option value="Development Officer (Other)">Development Officer (Other)</Option>
      <Option value="Technical Officer">Technical Officer</Option>
      <Option value="Technical Assistant">Technical Assistant</Option>
      <Option value="Field Officers">Field Officers</Option>
      <Option value="Management Service Officers">Management Service Officers</Option>
      <Option value="Information & Communication Technology Assistant">
        Information & Communication Technology Assistant
      </Option>
      <Option value="Grama Niladhari">Grama Niladhari</Option>
      <Option value="Translator">Translator</Option>
      <Option value="Office Employment Service Officers">Office Employment Service Officers</Option>
      <Option value="Drivers">Drivers</Option>
    </Select>
  </Form.Item>

  <Form.Item name="approvedCadre" label="Approved Cadre" rules={[{ required: true }]}>
    <Input type="number" placeholder="Enter approved cadre" />
  </Form.Item>

  <Form.Item name="existingCadre" label="Total Existing Cadres" rules={[{ required: true }]}>
    <Input type="number" placeholder="Enter total staff count" />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
      Add
    </Button>
  </Form.Item>
</Form>

          </Card>
        )}

{/* Super Admin - Select Workplace Dropdown */}
{adminRole === "superAdmin" && (
  <Card title="Select Workplace" className="mb-4 rounded-lg">
    <Form.Item label="Workplace">
      <Select
        placeholder="Select a workplace"
        onChange={handleWorkplaceChange}
        style={{ width: "100%" }}
      >
        {workplaceData.map((workplace) => (
          <Option key={workplace._id} value={workplace._id}>
            {workplace.workplace}
          </Option>
        ))}
      </Select>
    </Form.Item>
  </Card>
)}

{/* Super Admin - Display Selected Workplace's Cadre List */}
{adminRole === "superAdmin" && selectedWorkplace && (
  <Card
    title={`Cadre List for ${
      workplaceData.find((wp) => wp._id === selectedWorkplace)?.workplace || "Selected Workplace"
    }`}
    className="rounded-lg"
  >
    <Table
      columns={columns}
      dataSource={filteredStaffList}
      pagination={{ pageSize: 10 }}
      scroll={{ x: false }}
    />
  </Card>
)}

{/* Normal Admin - Show Assigned Workplace's Cadre List */}
{adminRole !== "superAdmin" && (
  <Card
    title={`Cadre List of ${
      workplaceData.find((wp) => wp._id === workplaceId)?.workplace || "Other"
    }`}
    className="rounded-lg"
  >
    <Table
      columns={columns}
      dataSource={staffList}
      pagination={{ pageSize: 10 }}
      scroll={{ x: false }}
    />
  </Card>
)}

      

      {/* Modal for updating staff */}
      <Modal
  title="Update Cadre"
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
>
  {editingStaff && (
  <Form form={form} layout="vertical" onFinish={onUpdate}>
  <Form.Item name="service" label="Cadre Category">
    <Input />
  </Form.Item>
  <Form.Item name="approvedCadre" label="Approved Cadre">
    <Input type="number" />
  </Form.Item>
  <Form.Item name="existingCadre" label="Existing Cadre">
    <Input type="number" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">Save</Button>
  </Form.Item>
</Form>

    
  )}
</Modal>
    </div>
  );
};

export default Cadre; 



