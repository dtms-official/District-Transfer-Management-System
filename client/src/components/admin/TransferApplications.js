import React, { useState, useEffect } from "react";
import { Table, Button, Tooltip, message, Alert, notification } from "antd";
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
  const [workplaceData, setWorkplaceData] = useState([]);
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
      } else {
        notification.error({
          description: "Something went wrong . please try again later",
          placement: "topRight",
        });
      }

      window.location.reload();
    } catch (error) {
      console.error(error.response?.data?.error || "Something went wrong");
      notification.error({
        description: error.response?.data?.error || "Something went wrong",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
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
      render: (text) => {
        return text && text.trim() !== "" ? text : "N/A";
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
      key: "transfered_workplace_id",
      render: (workplace_id) => {
        const workplace = workplaceData.find(
          (wp) => wp._id === workplace_id
        );
        return workplace ? workplace.workplace : "N/A";
      },
    },
    {
      title: "Replacement Officer",
      dataIndex: "replacementOfficer",
      key: "replacementOfficer",
      render: (text) => {
        return text && text.trim() !== "" ? text : "N/A";
      },
    },

    ...(adminRole === "superAdmin"
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  type="primary"
                  onClick={() => update(record.userId._id, "process")}
                  disabled={record.isProcessed} // Disable if processed
                >
                  Process
                </Button>

                {record.isProcessed && record.Replacement_userId === null && (
                  <Button
                    type="primary"
                    onClick={() => update(record.userId._id, "find")}
                  >
                    Find Replacement
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
    </div>
  );
};

export default TransferApplications;
