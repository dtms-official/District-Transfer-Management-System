import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Select,
  Button,
  message,
  Spin,
  Table,
  Checkbox,
  Modal,
  Popconfirm,
  InputNumber, // Add InputNumber for selecting months
} from "antd";
import { useNavigate } from "react-router-dom";
import useFetchDelete from "../../api/useFetchDelete";

const { Option } = Select;

const LeaveDetails = ({ user }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { data, fetchDeleteloading, fetchData, deleteData } = useFetchDelete(
    `user/leavedetails/user/${user._id}`, // Dynamic fetch endpoint
    "user/leavedetails" // Delete endpoint
  );

  const updateProgressValue = () => {
    let collection = "userleavedetails";
    if (user) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/user/user/progress/${user._id}`,
          { collection: collection }
        )
        .then((response) => {
          if (response.data.warning) {
            // If warning is true, show a warning message
            message.warning(response.data.warning || "Warning message");
          } else {
            // Otherwise, show success message
            message.success(
              response.data.message || "Profile updated successfully"
            );
            navigate("/dashboard");
          }
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.error || "Failed to update progress";
          message.error(errorMessage);
        });
    }
  };

  // Confirm modal handler
  const handleConfirm = async () => {
    setConfirmVisible(false); // Close the modal when confirmed
    // If needed, update progress when confirming (e.g., update user progress)
    updateProgressValue(); // Update progress if necessary
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/leavedetails`,
        { ...values, userId: user._id }, // Include userId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        response.data.message || "leavedetails added successfully"
      );
      form.resetFields();
      fetchData();
      updateProgressValue(); // Update progress if necessary
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.errors[0]?.msg ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Columns for the diseases table
  const columns = [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "No of Days",
      dataIndex: "no_of_days",
      key: "no_of_days",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Popconfirm
            title="Are you sure you want to delete this disease?"
            onConfirm={() => deleteData(record._id)} // Call deleteData with the record ID
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="btn bg-red-500 text-white"
              style={{ marginLeft: 8 }}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Year"
                name="year"
                style={{ flex: "1 1 48%", marginBottom: "16px" }} // Adjust width and margin for proper alignment
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select>
                  {Array.from({ length: 2025 - 1970 + 1 }, (_, index) => {
                    const year = 2025 - index; // Starting from 2025 and decreasing
                    return (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                label="Leave Type"
                name="type"
                style={{ flex: "1 1 48%", marginBottom: "16px" }} // Adjust width and margin
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select>
                  <Option value="Casual">Casual</Option>
                  <Option value="Casual">Casual</Option>
                  <Option value="Half-Pay">Half-Pay</Option>
                  <Option value="No-Pay">No-Pay</Option>
                  <Option value="Maternity Leave">Maternity Leave</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label=" No of Days"
                name="no_of_days"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
        </div>

        <Form.Item>
          <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
            I don’t have any leave
          </Checkbox>
        </Form.Item>

        {checkboxChecked ? (
          <Button
            type="primary"
            onClick={() => setConfirmVisible(true)}
            block
            disabled={loading || fetchDeleteloading}
          >
            {loading || fetchDeleteloading ? <Spin /> : "Confirm"}
          </Button>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            block
            disabled={loading || fetchDeleteloading}
          >
            {loading || fetchDeleteloading ? <Spin /> : "Save"}
          </Button>
        )}
      </Form>

      <Modal
        title="Confirm Submission"
        open={confirmVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>Are you sure you want to submit with no disease?</p>
      </Modal>
      <br></br>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="_id" // Ensure rowKey is set to the unique ID field
        loading={loading || fetchDeleteloading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default LeaveDetails;
