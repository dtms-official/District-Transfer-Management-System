import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Table, Card, Alert, Button, notification } from "antd";
import {
  fetchCheckedUsers,
  fetchCheckedApplications,
} from "../../api/useAdmin";
import axios from "axios";

export default function CheckingAdmin() {
  const navigate = useNavigate();
  const [CheckedUsers, setCheckedUsers] = useState([]);
  const [CheckedApplications, setCheckedApplications] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ renamed
  const [loading, setLoading] = useState(false);
  const [workplaceData, setWorkplaceData] = useState([]);
  const [transferWindows, setTransferWindows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setErrorMessage("❌ Unauthorized! Please log in as an admin.");
      return;
    }

    fetchCheckedUsers(token, setCheckedUsers, setErrorMessage);
    fetchCheckedApplications(token, setCheckedApplications, setErrorMessage);
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
        console.error(error.response?.data?.error || "Something went wrong");
        message.error(error.response?.data?.error || "Something went wrong");
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
        console.error(error.response?.data?.error || "Something went wrong");
        message.error(error.response?.data?.error || "Something went wrong");
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

  const handleAction = async (record, actionType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        message.error("Unauthorized! Please log in again.");
        return;
      }

      const url = `${process.env.REACT_APP_API_URL}/admin/recommend-application/${record._id}`;

      const response = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success || response.data.message) {
        notification.success({
          description: response.data.message || "Recommend done",
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
        description:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
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
      title: "Action",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Button type="primary" onClick={() => handleAction(record, "check")}>
          Recommend
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }} className="text-left">
      {errorMessage && (
        <Alert message={errorMessage} type="error" showIcon className="mb-4" />
      )}
      <Card title="Checked Users" bordered>
        <Table
          columns={usersColumns}
          dataSource={CheckedUsers}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No Checked users available." }}
          scroll={{ x: "max-content" }}
          responsive
        />
      </Card>
      <br />
      <Card title="Checked Transfer Applications" bordered>
        <Table
          columns={applicaionColumns}
          dataSource={CheckedApplications}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No Checked applications available." }}
        />
      </Card>
    </div>
  );
}
