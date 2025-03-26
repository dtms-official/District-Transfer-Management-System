import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Alert, Button } from "antd";
import { fetchCheckedUsers, fetchCheckedTransferApplications } from "../../api/useAdmin"; // Import the utility function

export default function RecommendAdmin() {
  const navigate = useNavigate();
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [checkedTransferApplications, setCheckedTransferApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken"); // Assuming token is stored in localStorage

    if (!token) {
      setMessage("❌ Unauthorized! Please log in as an admin.");
      return;
    }
    fetchCheckedUsers(token, setCheckedUsers, setMessage);
    fetchCheckedTransferApplications(token, setCheckedTransferApplications, setMessage);
  }, []);

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
          onClick={() => navigate(`/admin_dashboard/view-profile/${record._id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  const transferApplicationsColumns = [
    { title: "transferWindowId", dataIndex: "transferWindowId", key: "transferWindowId" },
    { title: "preferWorkplace_1", dataIndex: "preferWorkplace_1", key: "preferWorkplace_1" },
    { title: "preferWorkplace_2", dataIndex: "preferWorkplace_2", key: "preferWorkplace_2" },
    { title: "preferWorkplace_3", dataIndex: "preferWorkplace_3", key: "preferWorkplace_3" },
    { title: "remarks", dataIndex: "remarks", key: "remarks" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => navigate(`/admin_dashboard/view-profile/${record._id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }} className="text-left">
      {message && <Alert message={message} type="error" showIcon className="mb-4" />}
      <Card title="Checked Users" bordered>
        <Table
          columns={usersColumns}
          dataSource={checkedUsers}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "No checked users available." }}
          scroll={{ x: "max-content" }} // Enables horizontal scrolling for wide content
          responsive
        />
      </Card>
      <br />
      <Card title="Checked Transfer Applications" bordered>
        <Table
          columns={transferApplicationsColumns}
          dataSource={checkedTransferApplications}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "No checked applications available." }}
          scroll={{ x: "max-content" }} // Enables horizontal scrolling for wide content
          responsive
        />
      </Card>
    </div>
  );
}
