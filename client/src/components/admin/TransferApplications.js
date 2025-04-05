import React, { useState, useEffect } from "react";
import { Table, Space, Button, Select, Input, Tooltip, message } from "antd";
import axios from "axios";
import useCheckAdminAuth from "../../utils/checkAdminAuth";

// Render Status function with debugging logs
const renderStatus = (application) => {
  console.log("Rendering Status for:", application); // Debugging
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

const TransferApplications = () => {
  const { adminData } = useCheckAdminAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  // Get admin role and workplace ID from adminData
  const [workplaceData, setWorkplaceData] = useState([]);
  const [selectedWorkplace, setSelectedWorkplace] = useState(null); // ✅ Fix variable declaration

  const workplaceId = adminData.workplace_id || null;
  const adminRole = adminData.adminRole || null;

  const [transferWindows, setTransferWindows] = useState([]); // ✅ Correct state variable

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
          `${process.env.REACT_APP_API_URL}/admin/total-transfer-application`,
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

    if (isBeforeAnniversary) {
      yearsDifference--;
    }

    const replacementStatus = yearsDifference >= 3 ? "Yes" : "No";

    return { yearsDifference, replacementStatus };
  };

  const handleEdit = (record) => {
    console.log("Edit record:", record);
  };

  const handleAction = async (record, actionType, value) => {
    try {
      const token = localStorage.getItem("adminToken");
      const urlMap = {
        check: `${process.env.REACT_APP_API_URL}/admin/check-application/${record._id}`,
        recommend: `${process.env.REACT_APP_API_URL}/admin/recommend-application/${record._id}`,
        approve: `${process.env.REACT_APP_API_URL}/admin/approve-application/${record._id}`,
        reject: `${process.env.REACT_APP_API_URL}/admin/reject-application/${record._id}`,
      };

      const url = urlMap[actionType];
      if (!url) return;

      // Send request data for the 'approve' or 'reject' actions
      const requestData =
        actionType === "approve" || actionType === "reject" ? { value } : {};

      const response = await axios.put(url, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        message.success(
          `${
            actionType.charAt(0).toUpperCase() + actionType.slice(1)
          } action completed successfully`
        );

        // Update UI optimistically based on action type
        setApplications((prev) =>
          prev.map((app) =>
            app._id === record._id
              ? {
                  ...app,
                  [`is${
                    actionType.charAt(0).toUpperCase() + actionType.slice(1)
                  }`]: true,
                  Replacement: value ?? app.Replacement, // Handle value for approve/reject
                }
              : app
          )
        );
      }
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.error || "Something went wrong, try again later"
      );
    }
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
      dataIndex: "eligibility",
      key: "eligibility",
      render: (text, record) => {
        const { yearsDifference, replacementStatus } = calculateEligibility(
          record.duty_assumed_date
        );
        return (
          <div>
            <br />
            <span> {replacementStatus}</span>
            <br />
          </div>
        );
      },
    },

    {
      title: "Replacement",
      dataIndex: "Replacement",
      key: "Replacement",
      render: (text, record) => (
        <Select
          defaultValue="No" // Default to "No"
          onChange={(value) => handleAction(record, "checkOrRecommend", value)}
        >
          <Select.Option value="Yes">Yes</Select.Option>
          <Select.Option value="No">No</Select.Option>
        </Select>
      ),
    },

    // Show Replacement Officer for all roles

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => renderStatus(record),
    },
    {
      title: "Replacement Officer",
      dataIndex: "replacementOfficer",
      key: "replacementOfficer",
      render: (text) => {
        return text && text.trim() !== "" ? text : "N/A";
      },
    },

    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (text) => {
        return text && text.trim() !== "" ? text : "N/A";
      },
    },

    {
      title: "Transfer Decision Recommendation",
      dataIndex: "transferDecisionRecommendation",
      key: "transferDecisionRecommendation",
      render: (text, record) => {
        if (record.isProcessed) {
          return text || "Processed";
        }
        return text || "Pending";
      },
    },

    ...(adminRole === "approveAdmin"
      ? [
          {
            title: "Action",
            key: "action",
            fixed: "right",
            width: 250,
            render: (_, record) => (
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  type="primary"
                  onClick={() => {
                    handleAction(record, "approve");
                    record.isApproved = true;
                  }}
                >
                  {record.isApproved ? "Approve" : "Approve"}
                </Button>

                <Button
                  type="primary"
                  onClick={() => {
                    handleAction(record, "reject");
                    record.isRejected = true;
                  }}
                >
                  {record.isRejected ? "Rejected" : "Not Approve"}
                </Button>
              </div>
            ),
          },
        ]
      : []),

    ...(adminRole === "checkingAdmin" ||
    adminRole === "recommendAdmin" ||
    adminRole === "superAdmin"
      ? [
          {
            title: "Action",
            key: "action",
            fixed: "right",
            width: 250,
            render: (_, record) => (
              <div style={{ display: "flex", gap: 8 }}>
                {adminRole === "checkingAdmin" && (
                  <Button
                    type="primary"
                    onClick={() => {
                      handleAction(record, "check");
                      record.isChecked = true;
                    }}
                  >
                    {record.isChecked ? "Check" : "Check"}
                  </Button>
                )}

                {adminRole === "recommendAdmin" && (
                  <Button
                    type="primary"
                    onClick={() => {
                      handleAction(record, "recommend");
                      record.isRecommended = true;
                    }}
                  >
                    {record.isRecommended ? "Recommend" : "Recommend"}
                  </Button>
                )}

                {adminRole === "superAdmin" && (
                  <Button
                    type="primary"
                    onClick={() => {
                      handleAction(record, "process");
                      record.isProcessed = true;
                    }}
                  >
                    {record.isProcessed ? "Processed" : "Process"}
                  </Button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={applications}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TransferApplications;
//