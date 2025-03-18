import { useState, useEffect } from "react";
import { Modal, Form, Button, Spin, message, Typography } from "antd";
import axios from "axios";

const { Text } = Typography;

const ResetPasswordModal = ({
  isModalVisible,
  setIsModalVisible,
  modalLoading,
  setModalLoading,
  selectedUser,
}) => {
  const [form] = Form.useForm();
  const [generatedPassword, setGeneratedPassword] = useState("");

  useEffect(() => {
    if (isModalVisible) {
      const chars = "0123456";
      let password = Array.from(
        { length: 8 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("");
      setGeneratedPassword(password);
      form.setFieldsValue({ password });
    }
  }, [isModalVisible, form]); // ✅ Added 'form' to dependencies

  const handleResetPassword = async () => {
    setModalLoading(true);
    try {
      if (!selectedUser?._id) {
        message.error("User ID not found");
        return;
      }

      const password = form.getFieldValue("password"); // Get the generated password

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/reset-password/${selectedUser._id}`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );

      message.success(response?.data?.message || "Password reset successfully");
      setIsModalVisible(false);
      setGeneratedPassword("");
      form.resetFields();
    } catch (error) {
      console.error("Change Password Error:", error);
      message.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <Modal
      title="Reset Password"
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
    >
      {modalLoading ? (
        <Spin size="large" tip="Loading..." />
      ) : (
        <Form form={form} onFinish={handleResetPassword}>
          {generatedPassword && (
            <div style={{ padding: "10px 0" }}>
              <Text strong style={{ display: "block", fontSize: "16px" }}>
                New Password: {generatedPassword}
              </Text>
            </div>
          )}
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: 10, width: "100%" }}
          >
            Reset Password
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default ResetPasswordModal;
