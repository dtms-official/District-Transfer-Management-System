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
  const [loading, setLoading] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { adminData } = useCheckAdminAuth();
  const [workplaceData, setWorkplaceData] = useState(null);

  const id = adminData.workplace_id || null;

  useEffect(() => {
    const fetchWorkplace = async () => {
      try {
        // Replace with your API URL and the actual workplace ID
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/workplace/${id}`
        );
        setWorkplaceData(response.data);
      } catch (error) {
        console.error("Error fetching workplace:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkplace();
  }, [id]); // Trigger the effect when the workplaceId changes

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setStaffList(response.data.map((item) => ({ key: item.id, ...item })));
    } catch (error) {
      message.error("Error fetching staff data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/carder`,
        values
      );
      setStaffList([
        ...staffList,
        { key: response.data._id, ...response.data },
      ]);
      form.resetFields();
      message.success("Staff added successfully!");
    } catch (error) {
      message.error("Failed to add staff. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (record) => {
    setEditingStaff(record);
    form.setFieldsValue({
      ApprovedCadre: record.username,
      existingCadre: record.email,
    });
    setIsModalVisible(true);
  };

  const onUpdate = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/carder/${editingStaff.key}`,
        values
      );
      const updatedStaffList = staffList.map((staff) =>
        staff.key === editingStaff.key ? { ...staff, ...response.data } : staff
      );
      setStaffList(updatedStaffList);
      message.success("Staff updated successfully!");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update staff. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Service", dataIndex: "name", key: "name" },
    { title: "Approved cadre", dataIndex: "username", key: "username" },
    { title: "Existing cadre", dataIndex: "email", key: "email" },
    { title: "Last update", dataIndex: "website", key: "website" },
    {
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
    },
  ];

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
      <Card title="Add Government Cadre" className="mb-4 rounded-lg">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="service"
            label="Service"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a service">
              <Option value="Sri Lanka Administrative Service">
                Sri Lanka Administrative Service
              </Option>
              <Option value="Sri Lanka Engineering Service">
                Sri Lanka Engineering Service
              </Option>
              <Option value="Sri Lanka Accountants' Service">
                Sri Lanka Accountants' Service
              </Option>
              <Option value="Sri Lanka Planning Service">
                Sri Lanka Planning Service
              </Option>
              <Option value="Sri Lanka Scientific Service">
                Sri Lanka Scientific Service
              </Option>
              <Option value="Sri Lanka Architectural Service">
                Sri Lanka Architectural Service
              </Option>
              <Option value="Sri Lanka Information & Communication Technology Service">
                Sri Lanka Information & Communication Technology Service
              </Option>
              <Option value="Government Translators’ Service">
                Government Translators’ Service
              </Option>
              <Option value="Sri Lanka Librarians’ Service">
                Sri Lanka Librarians’ Service
              </Option>
              <Option value="Development Officers' Service">
                Development Officers' Service
              </Option>
              <Option value="Management Service Officers’ Service">
                Management Service Officers’ Service
              </Option>
              <Option value="Combined Drivers’ Service">
                Combined Drivers’ Service
              </Option>
              <Option value="Office Employees’ Service">
                Office Employees’ Service
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="ApprovedCadre"
            label="Approved Cadre"
            rules={[{ required: true }]}
          >
            <Input type="number" placeholder="Enter approved cadre" />
          </Form.Item>
          <Form.Item
            name="existingCadre"
            label="Total Existing Cadres"
            rules={[{ required: true }]}
          >
            <Input type="number" placeholder="Enter total staff count" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Removed Government Cadre List and added dynamic staff list */}
      <Card
        title={`Cadre List of ${workplaceData?.workplace || ""}`}
        className="rounded-lg"
      >
        <Table
          columns={columns}
          dataSource={staffList}
          pagination={{ pageSize: 5 }}
          scroll={{ x: false }}
        />
      </Card>

      {/* Modal for updating staff */}
      <Modal
        title=""
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="max-w-md w-full mx-auto"
      >
        {editingStaff && (
          <>
            <p className="font-bold text-lg">{editingStaff.name}</p>
            <Form form={form} layout="vertical" onFinish={onUpdate}>
              <Form.Item
                name="ApprovedCadre"
                label="Approved Cadre"
                rules={[{ required: true }]}
              >
                <Input
                  type="number"
                  placeholder="Enter approved cadre"
                  className="w-full p-2 rounded"
                />
              </Form.Item>
              <Form.Item
                name="existingCadre"
                label="Total Existing Cadres"
                rules={[{ required: true }]}
              >
                <Input
                  type="number"
                  placeholder="Enter total staff count"
                  className="w-full p-2 rounded"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full sm:w-auto"
                >
                  Save
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Cadre;
