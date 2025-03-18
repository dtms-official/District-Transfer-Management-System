import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Switch, message, Form, Table, Modal } from "antd";

const TransferWindow = () => {
  const [form] = Form.useForm();
  const [isEnabled, setIsEnabled] = useState(false);
  const [pastWindows, setPastWindows] = useState([]);
  const [filteredWindows, setFilteredWindows] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [isTerminated, setIsTerminated] = useState(false);
  const [activeWindow, setActiveWindow] = useState(null);

  const fetchTransferWindows = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/transfer-window`);
      setPastWindows(response.data);
      setFilteredWindows(response.data);
      const active = response.data.find(window => new Date(window.closingDate) > new Date());
      if (active) {
        setIsEnabled(true);
        setActiveWindow(active);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch past transfer windows.");
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
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/transfer-window`, data);
      message.success("Transfer window saved successfully.");
      fetchTransferWindows();
      setActiveWindow(data);
      form.resetFields();
      setIsEnabled(true);
      setIsTerminated(false);
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
        okButtonProps: {
          style: { backgroundColor: "#1890ff", borderColor: "#1890ff", color: "#fff" },
        },
        cancelButtonProps: {
          style: { backgroundColor: "#f0f0f0", borderColor: "#d9d9d9", color: "#000" },
        },
        onOk: async () => {
          try {
            await axios.put(`${process.env.REACT_APP_API_URL}/transfer-window/${activeWindow._id}`, { isTerminated: true });
            message.warning("Transfer window terminated.");
            fetchTransferWindows();
            form.resetFields();
            setIsEnabled(false);
            setIsTerminated(true);
            setActiveWindow(null);
          } catch (error) {
            message.error("Failed to terminate transfer window.");
            console.error("Error:", error);
          }
        },
      });
    }
  };

  const handleDateFilter = (date) => {
    if (date) {
      const filtered = pastWindows.filter((window) => {
        const closingDate = new Date(window.closingDate);
        return closingDate.toLocaleDateString() === date;
      });
      setFilteredWindows(filtered);
    } else {
      setFilteredWindows(pastWindows);
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
      dataIndex: "closingDate",
      key: "status",
      render: (closingDate, record) => {
        const currentDate = new Date();
        const closing = new Date(closingDate);

        if (record.status === "Closed") {
          return "Terminated";
        }
        return closing > currentDate ? "Open" : "Closed";
      },
    }
  ];

  const handleSwitchChange = (checked) => {
    setIsEnabled(checked);
    if (!checked) {
      setActiveWindow(null);
      setIsTerminated(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <div className="p-8 border border-gray-300 rounded-xl w-2/3 shadow-lg bg-white" style={{ maxWidth: '600px' }}>
        <h2 className="text-lg mb-4 font-semibold text-gray-700">
          {isEnabled && !isTerminated ? "Currently ongoing transfer window" : "No transfer window ongoing"}
        </h2>
        {isEnabled && !isTerminated && activeWindow && (
          <div className="mb-4">
            <p className="text-sm">Transfer Window Name: {activeWindow.name}</p>
            <p className="text-sm">Application Closing Date: {new Date(activeWindow.closingDate).toLocaleDateString()}</p>
            <Button type="primary" danger onClick={handleTerminate} className="mt-2 w-full">
              TERMINATE
            </Button>
          </div>
        )}
      </div>

      <div className="p-8 border border-gray-300 rounded-xl w-2/3 shadow-lg bg-white" style={{ maxWidth: '600px' }}>
        <h2 className="text-lg mb-4 font-semibold text-gray-700">Transfer Management Window</h2>
        <div className="mb-4 flex items-center">
          <p className="mr-4 text-sm text-gray-700">Enable transfer window</p>
          <Switch
            checked={isEnabled}
            onChange={handleSwitchChange}
            disabled={isEnabled && !isTerminated} // Only allow disabling if it's not terminated
          />
        </div>

        {!isEnabled && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Transfer window name"
              rules={[{ required: true, message: "Please enter the window name!" }]}
            >
              <Input placeholder="2025/2026" className="rounded-md" />
            </Form.Item>

            <Form.Item
              name="closingDate"
              label="Application closing date"
              rules={[{ required: true, message: "Please select a closing date!" }]}
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

      <div className="flex gap-2 mb-2 border-b pb-4 justify-left">
        <Input
          placeholder="Search date"
          value={searchDate}
          onChange={(e) => {
            setSearchDate(e.target.value);
            handleDateFilter(e.target.value);
          }}
          className="w-full"
        />
      </div>

      <div className="p-8 border border-gray-300 rounded-xl w-2/3 shadow-lg bg-white" style={{ maxWidth: '600px' }}>
        <h2 className="text-lg mb-4 font-semibold text-gray-700">Past Transfer Windows</h2>
        <Table
          dataSource={filteredWindows}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={filteredWindows.length > 10 ? { pageSize: 10 } : false}
        />
      </div>
    </div>
  );
};

export default TransferWindow;