import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Select,
  Input,
  Button,
  message,
  Spin,
  Table,
  Checkbox,
  Modal,
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import useFetchDelete from "../../api/useFetchDelete";

const { Option } = Select;

const UserDisability = ({ user }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { data, fetchDeleteloading, fetchData, deleteData } = useFetchDelete(
    `user/disability/user/${user._id}`, // Dynamic fetch endpoint
    "user/disability" // Delete endpoint
  );

  const handleConfirm = async () => {
    setConfirmVisible(false);
    updateProgressValue();
  };

  const updateProgressValue = () => {
    let collection = "userdisabilities";

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

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/disability`,
        { ...values, userId: user._id }, // Include userId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Disability added successfully");
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

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Since Birth",
      dataIndex: "since_birth",
      key: "since_birth",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Number of years",
      dataIndex: "how_many_years",
      key: "how_many_years",
      render: (text) => text || "N/A",
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

  const howManyYears = Form.useWatch("since_birth", form);

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Disability Type"
                name="type"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Hearing">Hearing</Option>
                  <Option value="Visual">Visual</Option>
                  <Option value="Physical">Physical</Option>
                  <Option value="Psychological">Psychological</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Disability Level"
                name="level"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Severe">Severe</Option>
                  <Option value="Mild">Mild</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Since Birth"
                name="since_birth"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="true">Yes</Option>
                  <Option value="false">No</Option>
                </Select>
              </Form.Item>
              {howManyYears === "false" && (
                <Form.Item
                  label="Number of years"
                  name="how_many_years"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "Number of years is required" },
                  ]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              )}
            </>
          )}
        </div>

        <Form.Item>
          <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
            I don’t have any disability
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
        <p>Are you sure you want to submit with no disability?</p>
      </Modal>
      <br></br>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="_id"
        loading={loading || fetchDeleteloading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UserDisability;
