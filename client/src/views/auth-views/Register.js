import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Select, Alert, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import bg from "../../assets/images/images.jpg";

const Register = () => {
  const [form] = Form.useForm();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
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

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        values
      );

      if (response) {
        setSuccess(response.data.message || "Registration Successful!");
        message.success(response.data.message || "Registration Successful!");
        setTimeout(() => setSuccess(""), 6000);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setSuccess("");
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      message.error(err.response?.data?.message || "Registration failed.");
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-10"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        backdropFilter: "blur(10px)",
      }}
    >
      <Header />

      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700 text-center mb-6">
          Register
        </h1>

        {success && (
          <Alert message={success} type="success" showIcon className="mb-4" />
        )}
        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Enter your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Name denoted by Initials"
                name="lastName"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Enter your last name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Name With Initial"
                name="nameWithInitial"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Enter your name with initial" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="NIC"
                name="NIC"
                rules={[
                  { required: true, message: "Please input your NIC!" },
                  {
                    pattern: /^(?:[0-9]{9}[V]$|[0-9]{12}$)/,
                    message: "Invalid NIC format!",
                  },
                ]}
              >
                <Input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    form.setFieldsValue({ NIC: e.target.value.toUpperCase() });
                  }}
                  placeholder="Enter your NIC"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select placeholder="Select Workplace">
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} placeholder="Select DOB">
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Enter your address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
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
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email (optional)"
                name="email"
                rules={[{ type: "email", message: "Invalid email" }]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact Number"
                name="contactNumber"
                rules={[
                  { required: true, message: "Required" },
                  {
                    pattern: /^07[0-9]{8}$/,
                    message: "Invalid contatc number",
                  },
                ]}
              >
                <Input placeholder="Enter your contatc number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Required" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter your password"  />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" className="w-full mt-4">
            Register
          </Button>
        </Form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
