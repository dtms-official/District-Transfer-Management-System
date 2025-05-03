import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Select,
  Button,
  message,
  Table,
  Spin,
  Card,
  Popconfirm,
  Typography
} from "antd";
import axios from "axios";

const { Option } = Select;

const AdminManagement = () => {
  const [form] = Form.useForm();
  const [adminData, setAdminData] = useState([]);
  const [filteredAdminData, setFilteredAdminData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workplaces, setWorkplaces] = useState([]);
  const [filterWorkplace, setFilterWorkplace] = useState("");
  const [loadingWorkplaces, setLoadingWorkplaces] = useState(true); // Track workplaces loading

  // Fetch Workplaces
  const fetchWorkplaces = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/workplace`
      );
      setWorkplaces(response.data || []);
      setLoadingWorkplaces(false); // Set loadingWorkplaces to false when data is fetched
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch workplaces"
      );
      setLoadingWorkplaces(false);
    }
  };

  useEffect(() => {
    fetchWorkplaces();
  }, []);

  // Fetch Admin Data
  const fetchData = useCallback(async () => {
    if (!loadingWorkplaces) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/total-admin`
        );
        const updatedAdminData = response.data.map((admin) => ({
          ...admin,
          workplace_name:
            workplaces.find((wp) => wp._id === admin.workplace_id)?.workplace ||
            "No Workplace Assigned",
        }));
        setAdminData(updatedAdminData);
        setFilteredAdminData(updatedAdminData);
      } catch (error) {
        message.error("Error fetching admin data");
      } finally {
        setLoading(false);
      }
    }
  }, [loadingWorkplaces, workplaces]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency array includes fetchData

  // Form Submission Handler
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/admin/register`,
        values
      );
      message.success(
        response.data.message || "Super Admin details saved successfully!"
      );
      fetchData(); // Re-fetch the admin data after saving

      const newAdminData = {
        ...response.data,
        workplace_name:
          workplaces.find((wp) => wp._id === response.data.workplace_id)
            ?.workplace || "No Workplace Assigned", // Directly access workplace name
      };

      const newData = [...adminData, newAdminData];
      setAdminData(newData);
      setFilteredAdminData(newData);
      form.resetFields(); // Reset the form after submission
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to save Super Admin details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Deleting Admin
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/total-admin/${id}`
      );
      message.success(
        response.data.message || "Super Admin deleted successfully"
      );
      setAdminData((prevData) => prevData.filter((admin) => admin._id !== id));
    } catch (error) {
      message.error("Failed to delete admin");
    } finally {
      setLoading(false);
    }
  };

  // Filtering admin data by workplace
  useEffect(() => {
    if (filterWorkplace) {
      setFilteredAdminData(
        adminData.filter((admin) =>
          admin.workplace_name
            .toLowerCase()
            .includes(filterWorkplace.toLowerCase())
        )
      );
    } else {
      setFilteredAdminData(adminData);
    }
  }, [filterWorkplace, adminData]);

  const columns = [
    {
      title: "Workplace",
      dataIndex: "workplace_name",
      key: "workplace_name",
    },
    { title: "Admin ID", dataIndex: "adminId", key: "adminId" },
    {
      title: "Admin Role",
      dataIndex: "adminRole",
      key: "adminRole",
      // render: (text) => text.replace(/([a-z])([A-Z])/g, "$1 $2"), // Converts camelCase to normal text
    },
    { title: "Password", dataIndex: "password", key: "password" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this admin?"
          onConfirm={() => handleDelete(record._id)} // Ensure '_id' is correct
          okText="Yes"
          cancelText="No"
        >
          <Button className="bg-red-500 text-white">Remove</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto text-left">
      <Typography.Title level={3} className="mb-8 mt-5 pb-3">
        Admin Management
      </Typography.Title>
      <Card className="mb-4 rounded-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            label="Workplace"
            name="workplace_id"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select placeholder="Select Workplace" style={{ width: "100%" }}>
              {workplaces.map((workplace) => (
                <Select.Option key={workplace._id} value={workplace._id}>
                  {workplace.workplace}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Admin Role"
            name="adminRole"
            rules={[
              { required: true, message: "Please select an Admin Type!" },
            ]}
          >
            <Select placeholder="Select Admin Type">
              <Option value="checkingAdmin">Checking Admin</Option>
              <Option value="recommendAdmin">Recommend Admin</Option>
              <Option value="approveAdmin">Approval Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100px" }}
              loading={loading}
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Workplace Filter Input */}
      <Form.Item
        label="Workplace"
        name="workplace"
        className="w-full md:w-1/3 mb-4"
      >
        <Select
          onChange={setFilterWorkplace}
          value={filterWorkplace}
          allowClear
        >
          {[
            "District Secretariat, Ampara",
            "Divisional Secretariat, Ampara",
            "Divisional Secretariat, Dehiaththakandiya",
            "Divisional Secretariat, Alayadivembu",
            "Divisional Secretariat, Uhana",
            "Divisional Secretariat, Mahaoya",
            "Divisional Secretariat, Padiyathalawa",
            "Divisional Secretariat, Damana",
            "Divisional Secretariat, Lahugala",
            "Divisional Secretariat, Irakkamam",
            "Divisional Secretariat, Sammanthurai",
            "Divisional Secretariat, Sainthamaruthu",
            "Divisional Secretariat, Ninthavur",
            "Divisional Secretariat, Navithanveli",
            "Divisional Secretariat, Addalachchenai",
            "Divisional Secretariat, Akkaraipaththu",
            "Divisional Secretariat, Thirukkovil",
            "Divisional Secretariat, Pothuvil",
            "Divisional Secretariat, Kalmunai",
            "Divisional Secretariat, Kalmunai (Tamil)",
            "Divisional Secretariat, Karathivu",
          ].map((place) => (
            <Select.Option key={place} value={place}>
              {place}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Spin
        spinning={loading}
        style={{ fontSize: "24px", transform: "scale(2)" }} // Enlarges the spinner
      >
        <Table
          columns={columns}
          dataSource={filteredAdminData}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </Spin>
    </div>
  );
};

export default AdminManagement;
