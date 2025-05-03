import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tooltip,
  message,
  Alert,
  notification,
  Typography,
  Select,
  Modal,
} from "antd";
import axios from "axios";
import useCheckAdminAuth from "../../utils/checkAdminAuth";
import {
  CheckCircleOutlined,
  UserSwitchOutlined,
  UploadOutlined,
} from "@ant-design/icons";

// Render Status function with debugging logs
const renderStatus = (application) => {
  console.log("Rendering Status for:", application);
  console.log("isChecked:", application?.isChecked);
  console.log("isRecommended:", application?.isRecommended);
  console.log("isApproved:", application?.isApproved);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
      <Tooltip title="Checked">
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: application?.isChecked ? "orange" : "#d3d3d3",
            border: "1px solid #ccc",
          }}
        />
      </Tooltip>
      <Tooltip title="Recommended">
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: application?.isRecommended ? "blue" : "#d3d3d3",
            border: "1px solid #ccc",
          }}
        />
      </Tooltip>
      <Tooltip title="Approved">
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            backgroundColor: application?.isApproved
              ? "green"
              : application?.isRejected
              ? "red"
              : "#d3d3d3",
            border: "1px solid #ccc",
          }}
        />
      </Tooltip>
    </div>
  );
};

const TransferApplications = ({ record }) => {
  const { adminData } = useCheckAdminAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workplaceData, setWorkplaceData] = useState([]);
  const adminRole = adminData.adminRole || null;

  const [transferWindows, setTransferWindows] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const showScoreModal = (score, id) => {
    setSelectedScore(score);
    setSelectedId(id);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedScore(null);
    setSelectedId(null);
  };

  useEffect(() => {
    const fetchTransferWindows = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/transfer-window`
        );
        setTransferWindows(response.data); // Now this is an array of windows
      } catch (error) {
        console.error("Error fetching transfer windows:", error);
      }
    };

    fetchTransferWindows();
  }, []);

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/workplace`
        );
        setWorkplaceData(response.data);
      } catch (error) {
        console.error("Error fetching workplaces:", error);
      }
    };

    fetchWorkplaces();
  }, []);

  // Fetch the transfer applications data
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      message.error("Unauthorized! Please log in as an admin.");
      return;
    }

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/total-applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.length > 0) {
          setApplications(response.data);
        } else {
          message.info("No transfer applications found.");
        }
      } catch (error) {
        console.error("Fetch Error:", error.response?.data || error);
        message.error(
          error.response?.data?.error || "Something went wrong, try again later"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const calculateEligibility = (duty_assumed_date) => {
    if (!duty_assumed_date)
      return { yearsDifference: 0, replacementStatus: "No" };

    const currentDate = new Date();
    const dutyDateObj = new Date(duty_assumed_date);

    let yearsDifference = currentDate.getFullYear() - dutyDateObj.getFullYear();

    const isBeforeAnniversary =
      currentDate.getMonth() < dutyDateObj.getMonth() ||
      (currentDate.getMonth() === dutyDateObj.getMonth() &&
        currentDate.getDate() < dutyDateObj.getDate());

    if (isBeforeAnniversary) yearsDifference--;

    const replacementStatus = yearsDifference >= 3 ? "Yes" : "No";

    return { yearsDifference, replacementStatus };
  };

  const update = async (id, actionType) => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/transfer-application/${actionType}/${id}`
      );

      if (actionType === "process") {
        notification.success({
          description: "Processed successfully",
          placement: "topRight",
        });
      } else if (actionType === "find") {
        notification.success({
          description: "Replacement officer found successfully",
          placement: "topRight",
        });
      } else if (actionType === "publish") {
        notification.success({
          description: "Transfer applicaiton published successfully",
          placement: "topRight",
        });
      } else {
        notification.error({
          description: "Something went wrong . please try again later",
          placement: "topRight",
        });
      }
      // setInterval(function () {
      //   window.location.reload();
      // }, 2000);
    } catch (error) {
      console.error(error.response?.data?.error || "Something went wrong");
      notification.warning({
        description: error.response?.data?.error || "Something went wrong",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTransferredWorkplace = (id, newWorkplaceId) => {
    Modal.confirm({
      title: "Are you sure you want to update the transfer workplace?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await axios.put(
            `${process.env.REACT_APP_API_URL}/transfer-application/${id}`,
            {
              transfered_workplace_id: newWorkplaceId,
            }
          );
          message.success(response.data.message || "Updated successfully");
          setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
          console.error(error.response?.data?.error || "Failed to update");
          message.error(error.response?.data?.error || "Failed to update");
        }
      },
    });
  };

  const columns = [
    {
      title: "Name with Initials",
      dataIndex: ["userId", "nameWithInitial"],
      key: ["userId", "nameWithInitial"],
    },
    {
      title: "Designation",
      dataIndex: ["userId", "designation"],
      key: "designation",
    },

    ...(adminRole === "superAdmin"
      ? [
          {
            title: "Workplace",
            dataIndex: "workplace_id",
            key: "workplace_id",
            render: (workplace_id) => {
              const workplace = workplaceData.find(
                (wp) => wp._id === workplace_id
              );
              return workplace ? workplace.workplace : "Unknown";
            },
          },
        ]
      : []),

    {
      title: "Transfer Window",
      dataIndex: "transferWindowId",
      key: "transferWindowId",
      render: (transferWindowId) => {
        const window = transferWindows.find(
          (win) => win._id === transferWindowId
        );
        return window ? window.name : "Unknown";
      },
    },

    {
      title: "Preferred Workplaces",
      dataIndex: "preferWorkplace_1",
      key: "preferWorkplace_1",
      render: (preferWorkplace_1, record) => {
        const workplace1 =
          workplaceData.find((wp) => wp._id === preferWorkplace_1)?.workplace ||
          "Unknown";
        const workplace2 =
          workplaceData.find((wp) => wp._id === record.preferWorkplace_2)
            ?.workplace || "Unknown";
        const workplace3 =
          workplaceData.find((wp) => wp._id === record.preferWorkplace_3)
            ?.workplace || "Unknown";

        return (
          <div style={{ whiteSpace: "nowrap" }}>
            {workplace1 && <div>{workplace1},</div>}
            {workplace2 && <div>{workplace2},</div>}
            {workplace3 && <div>{workplace3}</div>}
          </div>
        );
      },
    },

    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },

    {
      title: "Eligibility (more than 3 years)",
      key: "eligibility",
      render: (text, record) => {
        const dutyDate = record.userId?.duty_assumed_date;
        const { replacementStatus } = calculateEligibility(dutyDate);
        return <span>{replacementStatus}</span>;
      },
    },
    {
      title: "Replacement",
      dataIndex: "Replacement",
      key: "Replacement",
      render: (text, record) => (
        <span>{record.Replacement ? "Yes" : "No"}</span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => renderStatus(record),
    },

    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (text, record) => {
        if (!text || !text.totalScore) return "N/A";
        return (
          <button
            style={{
              background: "none",
              border: "none",
              color: "#1890ff",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
            onClick={() => showScoreModal(text, record._id)}
          >
            {text.totalScore}
          </button>
        );
      },
    },
    {
      title: "Transfer Decision",
      dataIndex: "transferDesision",
      key: "transferDesision",
    },

    {
      title: "Transfer Decision Type",
      dataIndex: "transferDesisionType",
      key: "transferDesisionType",
      render: (text) => {
        return text && text.trim() !== "" ? text : "N/A";
      },
    },
    {
      title: "Transfer Workplace",
      dataIndex: "transfered_workplace_id",
      width: 300,
      key: "transfered_workplace_id",
      render: (workplace_id, record) => {
        const workplace = workplaceData.find((wp) => wp._id === workplace_id);
        const showDropdown = adminRole === "superAdmin";

        if (!showDropdown) {
          return workplace ? workplace.workplace : "N/A";
        }

        return (
          <Select
            value={workplace_id}
            onChange={(value) => updateTransferredWorkplace(record._id, value)}
            style={{ width: 260 }}
            dropdownStyle={{ width: 400 }}
          >
            {workplaceData.map((wp) => (
              <Select.Option key={wp._id} value={wp._id}>
                {wp.workplace}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Replacement Officer",
      dataIndex: ["Replacement_userId", "NIC"],
      render: (text, record) => {
        const replacementUser = record.Replacement_userId;
        if (replacementUser) {
          return `${replacementUser.nameWithInitial} (${replacementUser.designation}, ${replacementUser.NIC})`;
        }
        return `${
          record.Replacement ? "Not assined" : "No replecement needed"
        }`;
      },
    },

    ...(adminRole === "superAdmin"
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {record.isChecked &&
                record.isRecommended &&
                record.isApproved &&
                !record.isProcessed ? (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => update(record.userId._id, "process")}
                  >
                    Process
                  </Button>
                ) : !record.isApproved || record.isRejected ? (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    disabled
                  >
                    Approval Pending
                  </Button>
                ) : null}

                {record.Replacement &&
                  record.isProcessed &&
                  !record.isPublished &&
                  record.Replacement_userId === null && (
                    <Button
                      type="dashed"
                      icon={<UserSwitchOutlined />}
                      onClick={() => update(record.userId._id, "find")}
                    >
                      Find Replacement
                    </Button>
                  )}

                {record.isProcessed && (
                  <Button
                    type="default"
                    icon={<UploadOutlined />}
                    onClick={() => update(record.userId._id, "publish")}
                    disabled={record.isPublished}
                  >
                    {record.isPublished ? "Published" : "Publish"}
                  </Button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];
  return (
    <div className="mt-10 mx-6 sm:mx-12">
      <Typography.Title level={3} className="mb-8 pb-3">
        Transfer Applications
      </Typography.Title>
      <Alert
        message="Status Colors Information"
        description={
          <div className="space-y-2">
            {["orange", "blue", "green", "red"].map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                ></div>
                <span>
                  {index === 0
                    ? "Checked (Yellow)"
                    : index === 1
                    ? "Recommended (Blue)"
                    : index === 2
                    ? "Approved (Green)"
                    : "Not approved (Red)"}
                </span>
              </div>
            ))}
          </div>
        }
        type="info"
        showIcon
        className="mb-4"
      />
      <Table
        columns={columns}
        dataSource={applications}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={<span className="text-lg font-semibold">Score Details</span>}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        className="[&_.ant-modal-body]:p-6"
      >
        <div className="overflow-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700 w-1/3">
                  Total Score
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.totalScore || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Duty Years
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.dutyYears || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Age</td>
                <td className="py-3 px-4">{selectedScore?.age || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Outer District
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.outerDistrict || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Resident Distance
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.residentDistance || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Civil Status
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.civilStatus || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Gender</td>
                <td className="py-3 px-4">{selectedScore?.gender || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Petition Status
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.petitionStatus || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Dependency - Infant
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.dependency?.infant || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Dependency - School Child
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.dependency?.schoolChild || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Dependency - Breastfeeding
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.dependency?.breastfeeding || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Dependency - Special Need
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.dependency?.specialNeed || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Dependency - Chronic Disease
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.dependency?.chronicDisease || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Dependency - Elderly Dependent
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.dependency?.elderlyDependent || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Dependency - Disabled Dependent
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.dependency?.disabledDependent || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">Disease</td>
                <td className="py-3 px-4">{selectedScore?.disease || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Soft Work Recommendation
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.softWorkRecommendation || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Medical Condition
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.medicalCondition || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Disability
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.disability || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-gray-700">
                  Disability Level
                </td>
                <td className="py-3 px-4">
                  {selectedScore?.disabilityLevel || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default TransferApplications;
