import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import checkAdminAuth from "../../utils/checkAdminAuth";

const SettingsModal = ({ isVisible, onClose }) => {
  const { adminData } = checkAdminAuth(); // Fetch user data
  const [loading, setLoading] = useState(false);

  // Handle Password Change Submission
  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/admin/change-password/${adminData.id}`,
        values
      );

      if (response.status === 200) {
        message.success("Password changed successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Change Password Error:", error);
      message.error(
        error.response?.data?.error || "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Settings"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={window.innerWidth < 768 ? "90%" : 500}
    >
          <Form layout="vertical" onFinish={handleChangePassword}>
            <Form.Item
              name="oldPassword"
              label="Current Password"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password!",
                },
              ]}
            >
              <Input.Password placeholder="Enter current password" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter a new password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return value && value === getFieldValue("newPassword")
                      ? Promise.resolve()
                      : Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Change Password
              </Button>
            </Form.Item>
          </Form>
    </Modal>
  );
};

export default SettingsModal;
