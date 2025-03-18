import React from 'react';
import { Form, Input, Button, notification } from 'antd';

const SecureForm = () => {
  // NIC Validation (Sri Lankan format)
  const validateNIC = (_, value) => {
    const nicRegex = /^[0-9]{9}[vV]$/;
    if (!nicRegex.test(value)) {
      return Promise.reject(new Error('NIC must be 9 digits followed by "V" or "v".'));
    }
    return Promise.resolve();
  };

  // Password Validation (Minimum 8 characters, with 1 letter and 1 number)
  const validatePassword = (_, value) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(value)) {
      return Promise.reject(new Error('Password must be at least 8 characters, with 1 letter and 1 number.'));
    }
    return Promise.resolve();
  };

  // Phone Validation (Sri Lankan format: 9 digits starting with 07)
  const validatePhone = (_, value) => {
    const phoneRegex = /^07[0-9]{8}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('Phone number must be valid (starting with 07 and 9 digits).'));
    }
    return Promise.resolve();
  };

  // Email Validation (Standard email format)
  const validateEmail = (_, value) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error('Please enter a valid email address.'));
    }
    return Promise.resolve();
  };

  // Submit function
  const onFinish = (values) => {
    notification.success({
      message: 'Form Submitted Successfully',
      description: `Hello ${values.nic}, your form has been validated and submitted!`,
    });
    console.log(values); // Here you can handle form values as needed.
  };

  return (
    <Form onFinish={onFinish} layout="vertical" initialValues={{}}>
      {/* NIC Field */}
      <Form.Item
        label="NIC"
        name="nic"
        rules={[{ required: true, message: 'Please enter your NIC' }, { validator: validateNIC }]}
      >
        <Input placeholder="Enter NIC" />
      </Form.Item>

      {/* Password Field */}
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please enter your password' }, { validator: validatePassword }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      {/* Phone Field */}
      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: 'Please enter your phone number' }, { validator: validatePhone }]}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>

      {/* Email Field */}
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please enter your email' }, { validator: validateEmail }]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SecureForm;
