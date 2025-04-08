import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Switch, message, Form, Table, Modal } from "antd";

const TransferWindow = () => {
  const [form] = Form.useForm();
  const [isEnabled, setIsEnabled] = useState(false);
  const [pastWindows, setPastWindows] = useState([]);
  const [transferWindows, setTransferWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  const fetchTransferWindows = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/transfer-window`
      );
      const windows = response.data;
      setPastWindows(windows);
      setTransferWindows(windows);

      // Find the active window (not terminated and closing date is in the future)
      const active = windows.find(
        (window) =>
          !window.isTerminated && new Date(window.closingDate) > new Date()
      );

      if (active) {
        setIsEnabled(true);
        setActiveWindow(active);
      } else {
        setIsEnabled(false);
        setActiveWindow(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch transfer windows.");
    }
  };

  useEffect(() => {
    fetchTransferWindows();
  }, []);

  const handleSave = async () => {
    const { name, closingDate } = form.getFieldsValue();
    const data = {
      name,
      closingDate,
      status: "Open",
      isTerminated: false,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/transfer-window`,
        data
      );
      message.success("Transfer window saved successfully.");
      fetchTransferWindows();
      form.resetFields();
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.errors[0]?.msg ||
          "Failed to save transfer window details."
      );
      console.error("Error:", error);
    }
  };

  const handleTerminate = async () => {
    if (activeWindow) {
      Modal.confirm({
        title: "Are you sure you want to terminate this transfer window?",
        content: "This action cannot be undone.",
        okText: "Yes, Terminate",
        cancelText: "Cancel",
        onOk: async () => {
          try {
            await axios.put(
              `${process.env.REACT_APP_API_URL}/transfer-window/${activeWindow._id}`,
              { isTerminated: true }
            );
            message.success("Transfer window terminated.");
            fetchTransferWindows();
          } catch (error) {
            message.error("Failed to terminate transfer window.");
            console.error("Error:", error);
          }
        },
      });
    }
  };

  const columns = [
    {
      title: "Window Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Closing Date",
      dataIndex: "closingDate",
      key: "closingDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        if (record.isTerminated) {
          return "Terminated";
        }
        return new Date(record.closingDate) > new Date() ? "Open" : "Closed";
      },
    },
  ];

  const handleSwitchChange = (checked) => {
    setIsEnabled(checked);
    if (!checked) {
      setActiveWindow(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <div
        className="p-8 border border-gray-300 rounded-xl w-2/3 shadow-lg bg-white"
        style={{ maxWidth: "600px" }}
      >
        <h2 className="text-lg mb-4 font-semibold text-gray-700">
          {activeWindow
            ? "Currently ongoing transfer window"
            : "No transfer window ongoing"}
        </h2>
        {pastWindows && <div></div>}
        {activeWindow && (
          <div className="mb-4">
            <p className="text-sm">Transfer Window Name: {activeWindow.name}</p>
            <p className="text-sm">
              Application Closing Date:{" "}
              {new Date(activeWindow.closingDate).toLocaleDateString()}
            </p>
            <Button
              type="primary"
              danger
              onClick={handleTerminate}
              className="mt-2 w-full"
            >
              TERMINATE
            </Button>
          </div>
        )}
      </div>

      <div
        className="p-8 border border-gray-300 rounded-xl w-2/3 shadow-lg bg-white"
        style={{ maxWidth: "600px" }}
      >
        <h2 className="text-lg mb-4 font-semibold text-gray-700">
          Transfer Management Window
        </h2>
        <div className="mb-4 flex items-center">
          <p className="mr-4 text-sm text-gray-700">Enable transfer window</p>
          <Switch
            checked={isEnabled}
            onChange={handleSwitchChange}
            disabled={!!activeWindow} // Disable if there's an active window
          />
        </div>

        {isEnabled && !activeWindow && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Transfer window name"
              rules={[
                { required: true, message: "Please enter the window name!" },
              ]}
            >
              <Input placeholder="2025/2026" className="rounded-md" />
            </Form.Item>

            <Form.Item
              name="closingDate"
              label="Application Closing Date"
              rules={[
                { required: true, message: "Please select a closing date!" },
              ]}
            >
              <Input
                type="date"
                className="rounded-md"
                min={new Date().toISOString().split("T")[0]}
              />
            </Form.Item>

            <Button onClick={handleSave} type="primary" className="w-full">
              SAVE
            </Button>
          </Form>
        )}
      </div>

      <div
        className="p-8 border border-gray-300 rounded-xl w-2/3 shadow-lg bg-white"
        style={{ maxWidth: "600px" }}
      >
        <h2 className="text-lg mb-4 font-semibold text-gray-700">
          Past Transfer Windows
        </h2>
        <Table
          dataSource={transferWindows}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={transferWindows.length > 10 ? { pageSize: 10 } : false}
        />
      </div>
    </div>
  );
};

export default TransferWindow;
