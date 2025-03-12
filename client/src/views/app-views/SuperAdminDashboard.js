import React, { useState, useEffect } from "react";
import { Form, Select, Button, message, Table, Spin, Card, Input } from "antd";
import axios from "axios";
import bcrypt from "bcryptjs";

const { Option } = Select;

const SuperAdminDashboard = () => {
  const [form] = Form.useForm();
  const [workplaceData, setWorkplaceData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workplaces, setWorkplaces] = useState([]);

  const fetchWorkplaces = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/workplace`
      );
      setWorkplaces(response.data || []);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch workplaces"
      );
    }
  };

  useEffect(() => {
    fetchWorkplaces();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const workplaceResponse = await axios.get("http://localhost:8000/api/user/user");
        setWorkplaceData(workplaceResponse.data);

        const adminResponse = await axios.get("http://localhost:8000/api/user/user");
        setAdminData(adminResponse.data);
      } catch (error) {
        message.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Form Submission Handler with password hashing
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const hashedPassword = await bcrypt.hash(values.password, 10);
      const adminDetails = { ...values, password: hashedPassword };

      const response = await axios.post("http://localhost:8000/api/user/user", adminDetails);
      message.success("Super Admin details saved successfully!");
      setAdminData([...adminData, response.data]);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save Super Admin details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      if (!id) {
        message.error("Invalid User ID");
        return;
      }
      await axios.delete(`http://localhost:8000/api/user/user/${id}`);
      message.success("Super Admin deleted successfully");
      setAdminData((prevData) => prevData.filter((admin) => admin._id !== id));
    } catch (error) {
      message.error("Failed to delete admin");
    } finally {
      setLoading(false);
    }
  };
  const columns = [
  { title: "Workplace", dataIndex: "NIC", key: "NIC" },
  { title: "Admin Type", dataIndex: "firstName", key: "firstName" },
  { title: "User Name", dataIndex: "lastName", key: "lastName" },
  {
    title: "Password", 
    dataIndex: "password", 
    key: "password", 
    render: (text) => (
      <span>{text}</span>  // Display the hashed password
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button className="bg-red-500 text-white" onClick={() => handleDelete(record._id)}>
        Delete
      </Button>
    ),
  },
];
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Card title="Super Admin Management" className="mb-4 rounded-lg">
        <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
           <Form.Item
                          label="Workplace"
                          name="workplace_id"
                          rules={[{ required: true, message: "Required" }]}
                        >
                          <Select
                            placeholder="Select Workplace"
                            style={{ width: "100%" }}
                          >
                            {workplaces.map((workplace) => (
                              <Select.Option key={workplace._id} value={workplace._id}>
                                {workplace.workplace}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

          <Form.Item
            label="Admin Type"
            name="admin_type"
            rules={[{ required: true, message: "Please select an Admin Type!" }]}>
            <Select placeholder="Select Admin Type">
              <Option value="admin">Checking Admin</Option>
              <Option value="recommend_admin">Recommend Admin</Option>
              <Option value="approval_admin">Approval Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100px" }} loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={adminData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}  // Allows horizontal scrolling
        />
      </Spin>
    </div>
  );
};

export default SuperAdminDashboard;
