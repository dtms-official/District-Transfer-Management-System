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
import moment from "moment";
import useFetchDelete from "../../api/useFetchDelete";

const { Option } = Select;
const { TextArea } = Input;

const UserMedicalCondition = ({ user }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { data, fetchDeleteloading, fetchData, deleteData } = useFetchDelete(
    `user/medicalcondition/user/${user._id}`, // Dynamic fetch endpoint
    "user/medicalcondition" // Delete endpoint
  );

  const handleConfirm = async () => {
    setConfirmVisible(false);
    updateProgressValue();
  };

  const updateProgressValue = () => {
    let collection = "usermedicalconditions";

    if (user) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/user/user/progress/${user._id}`,
          { collection: collection } // Pass the collection name dynamically
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
            error.response && error.response.data && error.response.data.error
              ? error.response.data.error
              : "Failed to update progress";
          message.error(errorMessage);
        });
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/medicalcondition`,
        { ...values, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        response.data.message || "Medical condition saved successfully"
      );
      form.resetFields();
      fetchData(); // Refresh the table after adding
      updateProgressValue();
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
      render: (text) => text || "N/A",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "N/A",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Popconfirm
            title="Are you sure you want to delete this medical condition?"
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            flexDirection: "column",
          }}
        >
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Medical Condition Type"
                name="type"
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select>
                  <Option value="Pregnancy">Pregnancy</Option>
                  <Option value="Therapy">Therapy</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Notes"
                name="notes"
                rules={[{ required: true, message: "This field is required" }]}
              >
                <TextArea placeholder="Enter your notes (Max 300 characters)" />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
              I don’t have any medical condition
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
              onClick={form.submit}
              block
              disabled={loading || fetchDeleteloading}
            >
              {loading || fetchDeleteloading ? <Spin /> : "Save"}
            </Button>
          )}
        </div>
      </Form>

      <Modal
        title="Confirm Submission"
        open={confirmVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>Are you sure you want to submit with no medical condition?</p>
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

export default UserMedicalCondition;
