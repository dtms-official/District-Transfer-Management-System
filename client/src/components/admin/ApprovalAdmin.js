import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  message,
  Table,
  Card,
  Alert,
  Button,
  notification,
  Select,
} from "antd";
import {
  fetchRecommendedUsers,
  fetchRecommendedApplications,
} from "../../api/useAdmin";
import axios from "axios";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import useCheckAdminAuth from "../../utils/checkAdminAuth";

export default function CheckingAdmin() {
  const navigate = useNavigate();
  const [RecommendedUsers, setRecommendedUsers] = useState([]);
  const [RecommendedApplications, setRecommendedApplications] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ renamed
  const [loading, setLoading] = useState(false);
  const [workplaceData, setWorkplaceData] = useState([]);
  const [transferWindows, setTransferWindows] = useState([]);
  const { adminData } = useCheckAdminAuth();

  const adminRole = adminData.adminRole || null;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setErrorMessage("❌ Unauthorized! Please log in as an admin.");
      return;
    }

    fetchRecommendedUsers(token, setRecommendedUsers, setErrorMessage);
    fetchRecommendedApplications(
      token,
      setRecommendedApplications,
      setErrorMessage
    );
  }, []);

  useEffect(() => {
    const fetchTransferWindows = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/transfer-window`
        );
        setTransferWindows(response.data);
      } catch (error) {
        console.error("Error fetching transfer windows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransferWindows();
  }, []);

  useEffect(() => {
    const fetchWorkplaces = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/workplace`
        );
        setWorkplaceData(response.data);
      } catch (error) {
        console.error("Error fetching workplaces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkplaces();
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

  const updateReplacement = async (id, value) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/transfer-application/${id}`,
        { Replacement: value }
      );
      notification.success({
        description: "Replacement updated successfully",
        placement: "topRight",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error.response?.data?.error || "Something went wrong");
      notification.error({
        description: error.response?.data?.error || "Something went wrong",
        placement: "topRight",
      });
    }
  };

  const handleAction = async (record, actionType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        message.error("Unauthorized! Please log in again.");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL}/admin/${actionType}-application/${record._id}`;

      const response = await axios.put(
        url,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success || response.data.message) {
        notification.success({
          description: response.data.message || `${actionType} done`,
          placement: "topRight",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        message.error("Unexpected server response");
      }
    } catch (error) {
      console.error(error.response?.data?.error || "Something went wrong");
      notification.error({
        description: error?.response?.data?.error || `${actionType} failed`,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const usersColumns = [
    { title: "Name", dataIndex: "nameWithInitial", key: "name" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    { title: "NIC", dataIndex: "NIC", key: "nic" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Contact", dataIndex: "contactNumber", key: "contact" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(`/admin_dashboard/view-profile/${record._id}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  const applicaionColumns = [
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
    {
      title: "Workplace",
      dataIndex: "workplace_id",
      key: "workplace_id",
      render: (workplace_id) => {
        const workplace = workplaceData.find((wp) => wp._id === workplace_id);
        return workplace ? workplace.workplace : "Unknown";
      },
    },
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
      render: (text, record) => {
        const showDropdown = !record.disabled && adminRole === "approveAdmin";

        if (!showDropdown) {
          return <span>{record.Replacement ? "Yes" : "No"}</span>;
        }

        return (
          <Select
            value={record.Replacement ? "true" : "false"}
            onChange={(value) => {
              const replacementValue = value === "true";
              updateReplacement(record._id, replacementValue);
            }}
            disabled={record.disabled}
          >
            <Select.Option value="true">Yes</Select.Option>
            <Select.Option value="false">No</Select.Option>
          </Select>
        );
      },
    },

    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 3 }}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleAction(record, "approve")}
          >
            Approve
          </Button>

          <Button
            type="default"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => handleAction(record, "reject")}
          >
            Not approve
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }} className="text-left">
      {errorMessage && (
        <Alert message={errorMessage} type="error" showIcon className="mb-4" />
      )}
      <Card title="Recommended Users" bordered>
        <Table
          columns={usersColumns}
          dataSource={RecommendedUsers}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No recommended users available." }}
          scroll={{ x: "max-content" }}
          responsive
        />
      </Card>
      <br />
      <Card title="Recommended Transfer Applications" bordered>
        <Table
          columns={applicaionColumns}
          dataSource={RecommendedApplications}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No recommended applications available." }}
          scroll={{ x: "max-content" }}
          responsive
        />
      </Card>
    </div>
  );
}
