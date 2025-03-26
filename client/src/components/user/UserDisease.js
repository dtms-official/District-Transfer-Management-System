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
  DatePicker,
  Popconfirm,
  InputNumber, // Add InputNumber for selecting months
} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useFetchDelete from "../../api/useFetchDelete";

const { Option } = Select;

const UserDisease = ({ user }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { data, fetchDeleteloading, fetchData, deleteData } = useFetchDelete(
    `user/disease/user/${user._id}`, // Dynamic fetch endpoint
    "user/disease" // Delete endpoint
  );

  const updateProgressValue = () => {
    let collection = "userdiseases";
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
        `${process.env.REACT_APP_API_URL}/user/disease`,

        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Disease saved successfully");
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
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Are You Taking Treatment",
      dataIndex: "are_you_taking_treatment",
      key: "are_you_taking_treatment",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Treatment Date",
      dataIndex: "treatment_date",
      key: "treatment_date",
      render: (text) => (text ? dayjs(text).format("YYYY-MM-DD") : "N/A"),
    },

    {
      title: "Soft Work Period (Months)",
      dataIndex: "soft_work_period",
      key: "soft_work_period",
      render: (text) => (text ? `${text} months` : "N/A"), // Display months if available
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

  const takingTreatment = Form.useWatch("are_you_taking_treatment", form);
  const softWork = Form.useWatch("soft_work_recommendation", form); // Watch the soft work field

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Disease Type"
                name="type"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Heart Disease">Heart Disease</Option>
                  <Option value="Kidney Disease">Kidney Disease</Option>
                  <Option value="Asthma">Asthma</Option>
                  <Option value="AIDS">AIDS</Option>
                  <Option value="Tuberculosis">Tuberculosis</Option>
                  <Option value="Cancer">Cancer</Option>
                  <Option value="Hepatitis">Hepatitis</Option>
                  <Option value="Leprosy">Leprosy</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Are you currently obtaining treatment?"
                name="are_you_taking_treatment"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="false">No</Option>
                  <Option value="true">Yes</Option>
                </Select>
              </Form.Item>

              {takingTreatment === "true" && (
                <Form.Item
                  label="Treatment Date"
                  name="treatment_date"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "Treatment date is required" },
                  ]}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                </Form.Item>
              )}

              {/* New question: Soft work period */}
              <Form.Item
                label="Has a medical officer recommended a soft work or resting period?"
                name="soft_work_recommendation"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: false }]}
              >
                <Select>
                  <Option value="false">No</Option>
                  <Option value="true">Yes</Option>
                </Select>
              </Form.Item>

              {softWork === "true" && (
                <Form.Item
                  label="Select Period (in months)"
                  name="soft_work_period"
                  style={{ flex: "1 1 48%" }}
                  rules={[{ required: true, message: "Period is required" }]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              )}
            </>
          )}
        </div>

        <Form.Item>
          <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
            I don’t have any disease
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

export default UserDisease;
