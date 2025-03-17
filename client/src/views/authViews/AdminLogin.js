import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import { jwtDecode } from "jwt-decode";
import { Input, Button, Form, Alert, Card, Typography, message } from "antd";
import bg from "../../assets/images/images.jpg";

const { Title } = Typography;

const AdminLogin = () => {
  const [userId, setUserId] = useState("");
  // const [password, ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          navigate("/admin_dashboard");
        } else {
          message.error("Session expired. Please re-login.");
          localStorage.removeItem("adminToken");
        }
      } catch {
        message.error("Invalid Token. Please login.");
        localStorage.removeItem("adminToken");
      }
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/admin/login`,
        { adminId: values.adminId, securePassword: values.securePassword },
        { withCredentials: true }
      );

      if (res.data.accessToken) {
        const decodedToken = jwtDecode(res.data.accessToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          setError("Session expired. Please log in again.");
          setLoading(false);
          return;
        }

        localStorage.setItem("adminToken", res.data.accessToken);
        navigate("/admin_dashboard");
        console.log("Login successful!");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message;
        setError(errorMessage || "Login failed. Please try again.");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
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
      <Card className="shadow-lg w-full max-w-md p-6">
        <Title level={3} className="text-center">
          Admin Login
        </Title>

        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}

        <Form
          layout="vertical"
          onFinish={handleLogin}
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Admin ID"
            name="adminId"
            rules={[{ required: true, message: "Please enter your Admin ID" }]}
          >
            <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter your admin id" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="securePassword"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 4, message: "Password must be at least 4 characters!" },
            ]}
          >
            <Input.Password className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter your passowrd"/>
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            Are you a normal user?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
