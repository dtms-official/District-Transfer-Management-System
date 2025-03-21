import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Table,
  Input,
  Checkbox,
  Modal,
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useFetchDelete from "../../api/useFetchDelete";

const { Option } = Select;
const { TextArea } = Input;

const UserWorkHistory = ({ user }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [transferType, setTransferType] = useState(""); // Track the selected Transfer Type
  const [natureOfDuty, setNatureOfDuty] = useState(""); // Track the selected Nature of Duty

  const [workplaceType, setWorkplaceType] = useState("");

  const { data, fetchDeleteloading, fetchData, deleteData } = useFetchDelete(
    `user/workhistory/user/${user._id}`, // Dynamic fetch endpoint
    "user/workhistory" // Delete endpoint
  );

  const handleConfirm = async () => {
    setConfirmVisible(false);
    updateProgressValue();
  };

  const updateProgressValue = () => {
    let collection = "userworkhistories";

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
        `${process.env.REACT_APP_API_URL}/user/workhistory`,
        { ...values, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        response.data.message || "Work history saved successfully"
      );
      form.resetFields();
      fetchData(); // Refresh the table after adding
      updateProgressValue();
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.errors[0]?.msg ||
          "Failed. Try again"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle dynamic form field rendering based on "Type of Transfer"
  const handleTransferTypeChange = (value) => {
    setTransferType(value);
  };

  const handleNatureOfDutyChange = (value) => {
    setNatureOfDuty(value); // Update nature of duty when changed
    if (value !== "Transferred") {
      setTransferType(""); // Reset transfer type when nature of duty is not "Transferred"
    }
  };

  const columns = [
    {
      title: "Workplace Name",
      dataIndex: "workplace",
      key: "workplace",
    },
    {
      title: "Workplace Type",
      dataIndex: "workplace_type",
      key: "workplace_type",
    },
    {
      title: "Other Workplace Type",
      dataIndex: "other_workplace_type",
      key: "other_workplace_type",
      render: (text) => text || "N/A",
    },
    {
      title: "Workplace City",
      dataIndex: "workplace_city",
      key: "workplace_city",
    },
    {
      title: "Workplace Postal Code",
      dataIndex: "workplace_postalcode",
      key: "workplace_postalcode",
      render: (text) => text || "N/A",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Duty commenced date",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Duty completed date",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Nature of Duty",
      dataIndex: "nature_of_duty",
      key: "nature_of_duty",
    },
    {
      title: "Type of Transfer",
      dataIndex: "type_of_transfer",
      key: "type_of_transfer",
      render: (text) => text || "N/A",
    },
    {
      title: "Transfer Order Issued Year",
      dataIndex: "transfer_order_issued_year",
      key: "transfer_order_issued_year",
      render: (text) => text || "N/A",
    },
    {
      title: "Mutual Officer NIC",
      dataIndex: "mutual_officer_nic",
      key: "mutual_officer_nic",
      render: (text) => text || "N/A",
    },
    {
      title: "Reason for Transfer",
      dataIndex: "reason_for_transfer",
      key: "reason_for_transfer",
      render: (text) => text || "N/A",
    },
    {
      title: "Other Transfer Details",
      dataIndex: "other_transfer_details",
      key: "other_transfer_details",
      render: (text) => text || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Popconfirm
            title="Are you sure you want to delete this workhistory?"
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
                label="Nature of Duty"
                name="nature_of_duty"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select onChange={handleNatureOfDutyChange}>
                  <Option value="Temporary">Temporary</Option>
                  <Option value="Contract Basis">Contract Basis</Option>
                  <Option value="Appointed">Appointed</Option>
                  <Option value="Transferred">Transferred</Option>
                </Select>
              </Form.Item>

              {natureOfDuty === "Transferred" && (
                <Form.Item
                  label="Type of Transfer"
                  name="type_of_transfer"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "This field is required" },
                  ]}
                >
                  <Select onChange={handleTransferTypeChange}>
                    <Option value="Annual Transfer (Ministry)">
                      Annual Transfer (Ministry)
                    </Option>
                    <Option value="Annual Transfer (District Secretariat)">
                      Annual Transfer (District Secretariat)
                    </Option>
                    <Option value="Mutual Transfer">Mutual Transfer</Option>
                    <Option value="Special Transfer">Special Transfer</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              )}

              {transferType === "Annual Transfer (Ministry)" ||
              transferType === "Annual Transfer (District Secretariat)" ? (
                <Form.Item
                  label="Transfer Order Issued Year"
                  name="transfer_order_issued_year"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "This field is required" },
                  ]}
                >
                  <Input />
                </Form.Item>
              ) : null}

              {transferType === "Mutual Transfer" ? (
                <Form.Item
                  label="NIC No. of Mutually Transferred Officer"
                  name="mutual_officer_nic"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "This field is required" },
                  ]}
                >
                  <Input />
                </Form.Item>
              ) : null}

              {transferType === "Special Transfer" ? (
                <Form.Item
                  label="Reason for Transfer"
                  name="reason_for_transfer"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "This field is required" },
                  ]}
                >
                  <TextArea placeholder="Enter your notes (Max 300 characters)" />
                </Form.Item>
              ) : null}

              {transferType === "Other" ? (
                <Form.Item
                  label="Specify the Details in Brief"
                  name="other_transfer_details"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "This field is required" },
                  ]}
                >
                  <TextArea placeholder="Enter your notes (Max 300 characters)" />
                </Form.Item>
              ) : null}

              <Form.Item
                label="Workplace Name"
                name="workplace"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Workplace Type"
                name="workplace_type"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select onChange={(value) => setWorkplaceType(value)}>
                  <Option value="District Secretariat">
                    District Secretariat
                  </Option>
                  <Option value="Divisional Secretariat">
                    Divisional Secretariat
                  </Option>
                  <Option value="Ministry / Department">
                    Ministry / Department
                  </Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              {workplaceType === "Other" && (
                <Form.Item
                  label="If the workplace type is other, please specify"
                  name="other_workplace_type"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "This field is required" },
                  ]}
                >
                  <Input />
                </Form.Item>
              )}

              <Form.Item
                label="Designation"
                name="designation"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Workplace Postal Code (optional)"
                name="workplace_postalcode"
                style={{ flex: "1 1 48%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Workplace City"
                name="workplace_city"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Duty commenced date"
                name="start_date"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Duty completed date"
                name="end_date"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}
        </div>

        <Form.Item>
          <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
            I'm in my first workplace
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
      </Form>

      <Modal
        title="Confirm Submission"
        open={confirmVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>Are you sure you want to submit the work history?</p>
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

export default UserWorkHistory;
