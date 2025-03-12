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
import moment from "moment";
import useFetchDelete from "../../api/useFetchDelete";

const { Option } = Select;
const { TextArea } = Input;

const Dependence = ({ user }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [natureOfDependency, setNatureOfDependency] = useState(null);
  const [grade, setGrade] = useState(null);

  const { data, fetchDeleteloading, fetchData, deleteData } = useFetchDelete(
    `user/dependence/user/${user._id}`, // Dynamic fetch endpoint
    "user/dependence" // Delete endpoint
  );

  const handleConfirm = async () => {
    setConfirmVisible(false);
    UpdateProgressValue();
  };

  const handleNatureOfDependencyChange = (value) => {
    setNatureOfDependency(value);
    form.resetFields(["grade", "dependentNIC"]);
  };

  const handleGradeChange = (value) => {
    setGrade(value);
  };

  const UpdateProgressValue = () => {
    let collection = "userdependences";
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
          message.error(
            error.response?.data?.error || "Failed to update progress"
          );
        });
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/dependence`,
        { ...values, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success(response.data.message || "Dependence added successfully");
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.errors[0]?.msg ||
          "Failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Nature of Dependency",
      dataIndex: "natureOfDependency",
      key: "natureOfDependency",
      render: (text) => text || "N/A",
    },
    {
      title: "Dependent Name",
      dataIndex: "dependentName",
      key: "dependentName",
    },
    {
      title: "Dependent Relationship",
      dataIndex: "dependentRelationship",
      key: "dependentRelationship",
    },
    {
      title: "Dependent NIC",
      dataIndex: "dependentNIC",
      key: "dependentNIC",
      render: (text) => text || "N/A",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      key: "workplace",
      render: (text) => text || "N/A",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Dependent DOB",
      dataIndex: "dependent_DOB",
      key: "dependent_DOB",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "School",
      dataIndex: "school",
      key: "school",
      render: (text) => text || "N/A",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (text) => text || "N/A",
    },
    {
      title: "Postalcode",
      dataIndex: "postalcode",
      key: "postalcode",
      render: (text) => text || "N/A",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (text) => text || "N/A",
    },
    {
      title: "Disease Type",
      dataIndex: "diseaseType",
      key: "diseaseType",
      render: (text) => text || "N/A",
    },
    {
      title: "Disability Type",
      dataIndex: "disability_type",
      key: "disability_type",
      render: (text) => text || "N/A",
    },
    {
      title: "any treatment",
      dataIndex: "Does_this_dependent_currently_undergo_any_treatment",
      key: "Does_this_dependent_currently_undergo_any_treatment",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "special need desc",
      dataIndex: "special_need_desc",
      key: "special_need_desc",
      render: (text) => text || "N/A",
    },
    {
      title: "live with dependant",
      dataIndex: "live_with_dependant",
      key: "live_with_dependant",
      render: (text) => (text ? "Yes" : "No"),
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
              {/* Nature of Dependency */}
              <Form.Item
                label="Nature of Dependency"
                name="nature_of_dependency"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select onChange={handleNatureOfDependencyChange}>
                  <Option value="Infant">Infant</Option>
                  <Option value="Non-School Going Child">
                    Non-School Going Child{" "}
                  </Option>
                  <Option value="School Going">School Going Child</Option>
                  <Option value="Non-working Adult">
                    Non-working Adult (18 Years or Older)
                  </Option>
                  <Option value="Working Adult">
                    Working Adult (18 Years or Older)
                  </Option>
                  <Option value="Special Need">Special Need</Option>
                  <Option value="Affected by Chronic Disease">
                    Affected by Chronic Disease{" "}
                  </Option>
                  <Option value="Elderly Dependent">Elderly Dependent</Option>
                  <Option value="Disabled Dependant">Disabled Dependant</Option>
                </Select>
              </Form.Item>

              {/* Breastfeeding field for Infant */}
              {natureOfDependency === "Infant" && (
                <Form.Item
                  label="Does the dependent require breastfeeding?"
                  name="breastfeeding_required"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "This field is required" },
                  ]}
                >
                  <Select>
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                  </Select>
                </Form.Item>
              )}

              {natureOfDependency === "School Going" && (
                <>
                  <Form.Item
                    label="Grade"
                    name="grade"
                    style={{ flex: "1 1 48%" }}
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Select onChange={handleGradeChange}>
                      {[...Array(9)].map((_, i) => (
                        <Option key={i + 1} value={`Grade ${i + 1}`}>
                          Grade {i + 1}
                        </Option>
                      ))}
                      <Option value="Grade 10">Grade 10</Option>
                      <Option value="O/L">O/L</Option>
                      <Option value="A/L">A/L</Option>
                    </Select>
                  </Form.Item>

                  {/* Dependent NIC for Grade 10, O/L, A/L */}
                  {["Grade 10", "O/L", "A/L"].includes(grade) && (
                    <Form.Item
                      label="Dependent NIC (optional)"
                      name="dependentNIC"
                      style={{ flex: "1 1 48%" }}
                    >
                      <Input />
                    </Form.Item>
                  )}
                </>
              )}

              {/* Form for other fields */}
              <Form.Item
                label="Dependent Relationship"
                name="dependentRelationship"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select>
                  <Option value="Husband">Husband</Option>
                  <Option value="Wife">Wife</Option>
                  <Option value="Son">Son</Option>
                  <Option value="Daughter">Daughter</Option>
                  <Option value="Sister">Sister</Option>
                  <Option value="Brother">Brother</Option>
                  <Option value="Father">Father</Option>
                  <Option value="Mother">Mother</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Dependent Name"
                name="dependentName"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input />
              </Form.Item>

              {/* Optional fields for Non-Infant dependencies */}
              {natureOfDependency !== "Infant" && (
                <>
                  {/* Show NIC only for non-School Going dependencies */}
                  {natureOfDependency !== "School Going" &&
                    natureOfDependency !== "Non-School Going Child" && (
                      <Form.Item
                        label="Dependent NIC (optional)"
                        name="dependentNIC"
                        style={{ flex: "1 1 48%" }}
                      >
                        <Input />
                      </Form.Item>
                    )}

                  {/* Workplace & designation should not be shown for School Going children */}
                  {natureOfDependency !== "School Going" &&
                    natureOfDependency !== "Non-School Going Child" &&
                    natureOfDependency !== "Non-working Adult" &&
                    natureOfDependency !== "Working Adult" && (
                      <>
                        <Form.Item
                          label="Workplace (optional)"
                          name="workplace"
                          style={{ flex: "1 1 48%" }}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          label="Designation"
                          name="designation"
                          style={{ flex: "1 1 48%" }}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    )}
                  {natureOfDependency === "Working Adult" && (
                    <>
                      <Form.Item
                        label="Workplace"
                        name="workplace"
                        style={{ flex: "1 1 48%" }}
                        rules={[
                          {
                            required: true,
                            message: "Please enter your workplace",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Designation"
                        name="designation"
                        style={{ flex: "1 1 48%" }}
                        rules={[
                          {
                            required: true,
                            message: "Please enter your job title",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </>
                  )}

                  {natureOfDependency !== "Non-School Going Child" &&
                    natureOfDependency !== "Non-working Adult" &&
                    natureOfDependency !== "Working Adult" &&
                    natureOfDependency !== "Elderly Dependent" &&
                    natureOfDependency !== "School Going" && (
                      <>
                        <Form.Item
                          label="School (optional)"
                          name="school"
                          style={{ flex: "1 1 48%" }}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    )}
                  {natureOfDependency &&
                    natureOfDependency === "School Going" && (
                      <Form.Item
                        label="School"
                        name="school"
                        style={{ flex: "1 1 48%" }}
                        rules={[
                          {
                            required: true,
                            message: "Please enter the school name",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    )}

                  {natureOfDependency === "Special Need" && (
                    <>
                      <Form.Item
                        label="Briefly explain the Special Need of the dependant"
                        name="special_need_desc"
                        style={{ flex: "1 1 48%" }}
                        rules={[{ required: true }]}
                      >
                        <TextArea placeholder="Enter your notes (Max 300 characters)" />
                      </Form.Item>
                    </>
                  )}
                  {natureOfDependency === "Disabled Dependant" && (
                    <>
                      <Form.Item
                        label="Disability Type"
                        name="disability_type"
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
                    </>
                  )}

                  {natureOfDependency === "Affected by Chronic Disease" && (
                    <>
                      <Form.Item
                        label="Disease Type"
                        name="disease_type"
                        style={{ flex: "1 1 48%" }}
                        rules={[
                          { required: true, message: "This field is required" },
                        ]}
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
                        label="Does this dependent currently undergo any treatment?"
                        name="Does this dependent currently undergo any treatment?"
                        style={{ flex: "1 1 48%" }}
                        rules={[{ required: true }]}
                      >
                        <Select>
                          <Option value="false">No</Option>
                          <Option value="true">Yes</Option>
                        </Select>
                      </Form.Item>
                    </>
                  )}

                  {natureOfDependency !== "Non-School Going Child" &&
                    natureOfDependency !== "Non-working Adult" &&
                    natureOfDependency !== "School Going" &&
                    natureOfDependency !== "Working Adult" && (
                      <>
                        <Form.Item
                          label="School / Workplace City (optional)"
                          name="city"
                          style={{ flex: "1 1 48%" }}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          label="School / Workplace Postalcode (optional)"
                          name="postalcode"
                          style={{ flex: "1 1 48%" }}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    )}
                </>
              )}

              {natureOfDependency === "School Going" && (
                <>
                  <Form.Item
                    label="School City (optional)"
                    name="city"
                    style={{ flex: "1 1 48%" }}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="School Postalcode (optional)"
                    name="postalcode"
                    style={{ flex: "1 1 48%" }}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              {natureOfDependency === "Working Adult" && (
                <>
                  <Form.Item
                    label="Work City (optional)"
                    name="city"
                    style={{ flex: "1 1 48%" }}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Work Postalcode (optional)"
                    name="postalcode"
                    style={{ flex: "1 1 48%" }}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              <Form.Item
                label="Gender"
                name="gender"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Dependent DOB"
                name="dependent_DOB"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Does this dependent currently live with you?"
                name="live_with_dependant"
                style={{ flex: "1 1 48%" }}
              >
                <Select>
                  <Option value="true">Yes</Option>
                  <Option value="false">No</Option>
                </Select>
              </Form.Item>
            </>
          )}
        </div>

        {/* "No Dependents" Checkbox */}
        <Form.Item>
          <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
            I don't have any dependents
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

      {/* Modal for confirming "no dependents" */}
      <Modal
        title="Confirm Submission"
        open={confirmVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>Are you sure you want to submit with no dependents?</p>
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

export default Dependence;
