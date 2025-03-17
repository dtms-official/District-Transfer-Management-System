import React, { useEffect, useState } from "react";
import { Input, Button, Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; // Import js-cookie
import bg from "../../assets/images/images.jpg";

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          navigate("/dashboard");
        } else {
          message.error("Session expired. Please re-login.");
          localStorage.removeItem("token");
        }
      } catch {
        message.error("Invalid Token. Please login.");
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        values
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
        // Set cookies with an expiration date of 3 days
        Cookies.set("NIC", values.NIC, { expires: 3 });
        Cookies.set(`password_${values.NIC}`, values.password, { expires: 3 });
      }
    } catch (err) {
      console.error("Error during login:", err);
      const errors = err.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((error) => message.error(error));
      } else {
        const errorMessage =
          err.response?.data?.error || "Login failed. Please try again.";
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const suggestPassword = (NIC) => {
    // Check if password is available in cookies for the given NIC
    const storedPassword = Cookies.get(`password_${NIC}`);
    return storedPassword || ""; // Return password if available
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
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login to your account
        </h3>
        <Form
          form={form}
          name="loginForm"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            label="NIC"
            name="NIC"
            rules={[
              { required: true, message: "Please input your NIC!" },
              {
                pattern: /^(?:[0-9]{9}[V]$|[0-9]{12}$)/,
                message: "NIC must be 9 digits followed by 'V', or 12 digits!",
              },
            ]}
          >
            <Input
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => {
                form.setFieldsValue({ NIC: e.target.value.toUpperCase() });
              }}
              placeholder="Enter your NIC"
              autoComplete="on"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              autoComplete="new-password"
              onFocus={() => {
                const NIC = form.getFieldValue("NIC");
                const storedPassword = Cookies.get(`password_${NIC}`);
                if (storedPassword) {
                  form.setFieldsValue({ password: storedPassword });
                }
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Are you an admin?{" "}
            <Link to="/admin_login" className="text-blue-600 hover:underline">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
