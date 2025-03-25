import React, { useState, useEffect } from "react";
import { Select, Input, Button, Card, Typography, message, Form } from "antd";
import getWorkplaces from "../../api/getWorkplaces";
import axios from "axios";
import useUserData from "../../api/useUserData";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

export default function TransferApplicationForm() {
  const [transferWindows, setTransferWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 24 * 60 * 60);
  const { user } = useUserData();
  const { workplaces, fetchWorkplaces } = getWorkplaces();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        transferWindowId: values.transferWindow, // Sending ID instead of name
        preferWorkplace_1: values.preferredWorkplace1,
        preferWorkplace_2: values.preferredWorkplace2,
        preferWorkplace_3: values.preferredWorkplace3,
        remarks: values.remarks || "",
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/transfer-application`, payload);

      form.resetFields();
      message.success("Application submitted successfully!");
    } catch (err) {
      if (Array.isArray(err?.response?.data?.errors)) {
        err.response.data.errors.forEach((e) => message.error(e.msg));
      } else {
        message.error(err?.response?.data?.error || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !user.isApproved) {
      message.error("You need approval to apply for transfer");
    } else {
      fetchWorkplaces();
      fetchTransferWindows();
    }
  }, [user]); // Removed unnecessary dependency

  const fetchTransferWindows = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/transfer-window`);
      const windows = response.data;
      const active = windows.find(
        (window) => !window.isTerminated && new Date(window.closingDate) > new Date()
      );
      setActiveWindow(active);
      setTransferWindows(windows);
    } catch (error) {
      message.error("Failed to fetch transfer windows.");
    }
  };

  useEffect(() => {
    if (activeWindow) {
      const closingDate = new Date(activeWindow.closingDate).getTime();
      const now = new Date().getTime();
      setTimeLeft(Math.max((closingDate - now) / 1000, 0));
    }
  }, [activeWindow]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (24 * 60 * 60));
    const h = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const m = Math.floor((seconds % (60 * 60)) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6 overflow-hidden">
      <Card className="w-full max-w-xl">
        <Title level={4}>Transfer Application</Title>
        {!user?.isApproved ? (
          <Text type="danger">You need approval to apply for transfer.</Text>
        ) : !activeWindow ? (
          <Text type="danger">Currently, no active transfer window is available.</Text>
        ) : (
          <>
            <Text type="danger" className="text-sm font-bold">
              TRANSFER APPLICATION CLOSING IN: {formatTime(timeLeft)}
            </Text>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item label="Select Transfer Window" name="transferWindow" rules={[{ required: true, message: "Please select a transfer window" }]}>
                <Select placeholder="Select a transfer window">
                  {transferWindows
                    .filter((window) => !window.isTerminated && new Date(window.closingDate) > new Date())
                    .map((transferWindow) => (
                      <Option key={transferWindow._id} value={transferWindow._id}>
                        {transferWindow.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              {[
                "preferredWorkplace1",
                "preferredWorkplace2",
                "preferredWorkplace3",
              ].map((field, index) => (
                <Form.Item
                  key={field}
                  label={`Preferred Workplace (${index + 1})`}
                  name={field}
                  rules={[{ required: true, message: `Please select preferred workplace ${index + 1}` }]}
                >
                  <Select
                    placeholder="Select Workplace"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {workplaces
                      .filter((workplace) =>
                        index === 0 || // First selection: All workplaces available
                        index === 1
                          ? workplace.workplace !== form.getFieldValue("preferredWorkplace1") // Second selection: Remove first selection
                          : workplace.workplace !== form.getFieldValue("preferredWorkplace1") &&
                            workplace.workplace !== form.getFieldValue("preferredWorkplace2") // Third selection: Remove first and second selections
                      )
                      .map((workplace) => (
                        <Option key={workplace._id} value={workplace.workplace}>
                          {workplace.workplace}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              ))}
              <Form.Item label="Remarks to be considered by transfer board (Optional)" name="remarks">
                <TextArea maxLength={350} placeholder="Enter your remarks" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
                  Submit Application
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
}