import React, { useState } from "react";
import axios from "axios";
import { Button, Input, Switch, message, Form } from "antd";

const TransferWindow = () => {
  const [form] = Form.useForm();
  const [isEnabled, setIsEnabled] = useState(false);

  const handleSave = async () => {
    const { name, closingDate } = form.getFieldsValue();
    const data = {
      name,
      closingDate,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/transfer-window`,
        data
      );
      message.success("Transfer window saved successfully.");
      console.log("Response:", response.data);
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.errors[0]?.msg ||
          "Failed to save transfer window details."
      );
      console.error("Error:", error);
    }
  };

  const handleTerminate = () => {
    form.resetFields();
    setIsEnabled(false);
    message.warning("Transfer window terminated.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <h2 className="text-lg mb-4 font-semibold text-gray-700">
        {isEnabled
          ? "Currently ongoing transfer window"
          : "No transfer window ongoing"}
      </h2>
      <div className="mb-4 flex items-center">
        <p className="mr-4 text-sm text-gray-700">Enable transfer window</p>
        <Switch
          checked={isEnabled}
          onChange={(checked) => {
            setIsEnabled(checked);
            if (!checked) {
              form.resetFields();
            }
          }}
        />
      </div>

      <div className="p-6 border border-gray-300 rounded-xl w-96 shadow-lg bg-white">
        <h2 className="text-lg mb-4 font-semibold text-gray-700">
          Transfer Management Window
        </h2>

        {isEnabled && (
          <>
            <div className="mb-4">
              <p className="text-sm">Terminate Transfer Window</p>
              <Button
                type="primary"
                danger
                onClick={handleTerminate}
                className="mt-2 w-full"
              >
                TERMINATE
              </Button>
            </div>

            <Form form={form} layout="vertical">
              <div className="mb-4">
                <Form.Item
                  name="name"
                  label="Transfer window name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the window name!",
                    },
                  ]}
                >
                  <Input placeholder="Window name" className="rounded-md" />
                </Form.Item>
              </div>

              <div className="mb-4">
                <Form.Item
                  name="closingDate"
                  label="Application closing date"
                  rules={[
                    {
                      required: true,
                      message: "Please select a closing date!",
                    },
                  ]}
                >
                  <Input type="date" className="rounded-md" />
                </Form.Item>
              </div>

              <Button onClick={handleSave} type="primary" className="w-full">
                SAVE
              </Button>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default TransferWindow;
