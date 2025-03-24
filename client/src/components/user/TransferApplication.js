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
  const [formData, setFormData] = useState({});
  const { user } = useUserData();
  const { workplaces, fetchWorkplaces } = getWorkplaces();

  useEffect(() => {
    if (user && !user.isApproved) {
      message.error("You need approval to apply for transfer");
    } else {
      fetchWorkplaces();
      fetchTransferWindows();
    }
  }, [user, fetchWorkplaces]); // Included dependencies

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

  const handleChange = (value, name) => {
    if (name === "reason" && value.length > 350) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6 overflow-hidden">
      <Card className="w-full max-w-xl">
        <Title level={4}>Transfer Application</Title>
        {!user?.isApproved ? (
          <Text type="danger">You need approval to Apply for transfer.</Text>
        ) : !activeWindow ? (
          <Text type="danger">Currently, no active transfer window is available.</Text>
        ) : (
          <>
            <Text type="danger" className="text-sm font-bold">
              TRANSFER APPLICATION CLOSING IN: {formatTime(timeLeft)}
            </Text>
            <Form layout="vertical" className="space-y-4">
              <Form.Item label="Select Transfer Window" name="transferWindow">
                <Select
                  value={formData.transferWindow}
                  onChange={(value) => handleChange(value, "transferWindow")}
                  placeholder="Select a transfer window"
                >
                  {transferWindows
                    .filter((window) => !window.isTerminated && new Date(window.closingDate) > new Date())
                    .map((transferWindow) => (
                      <Option key={transferWindow._id} value={transferWindow.name}>
                        {transferWindow.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              {["preferredWorkplace1", "preferredWorkplace2", "preferredWorkplace3"].map((field, index) => (
                <Form.Item key={index} label={`Preferred Workplace (${index + 1})`}>
                  <Select
                    value={formData[field]}
                    onChange={(value) => handleChange(value, field)}
                    placeholder="Select Workplace"
                  >
                    {workplaces.map((workplace) => (
                      <Option key={workplace._id} value={workplace.workplace}>
                        {workplace.workplace}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ))}
              <Form.Item label="Remarks to be considered by transfer board (Optional)">
                <TextArea
                  name="reason"
                  value={formData.reason}
                  onChange={(e) => handleChange(e.target.value, "reason")}
                  maxLength={350}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
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