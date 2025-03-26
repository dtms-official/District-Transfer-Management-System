import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Alert, Button } from "antd";
import { fetchPendingUsers, fetchPendingTransferApplications } from "../../api/useAdmin"; // Import the utility function

export default function CheckingAdmin() {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingTransferApplications, setPendingTransferApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setMessage("❌ Unauthorized! Please log in as an admin.");
      return;
    }

    // Pass state functions to the utility
    fetchPendingUsers(token, setPendingUsers, setMessage);
    // Pass state functions to the utility
    fetchPendingTransferApplications(token, setPendingTransferApplications, setMessage);
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
          onClick={() =>
            navigate(`/admin_dashboard/view-profile/${record._id}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  const transferApplicationsColumns = [
    { title: "transferWindowId", dataIndex: "transferWindowId", key: "transferWindowId" },
    { title: "preferWorkplace_1", dataIndex: "preferWorkplace_3", key: "preferWorkplace_3" },
    { title: "preferWorkplace_2", dataIndex: "preferWorkplace_2", key: "preferWorkplace_2" },
    { title: "preferWorkplace_3", dataIndex: "preferWorkplace_3", key: "preferWorkplace_3" },
    { title: "remarks", dataIndex: "remarks", key: "remarks" },
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

  return (
    <div style={{ padding: "24px" }} className="text-left">
      {message && (
        <Alert message={message} type="error" showIcon className="mb-4" />
      )}
      <Card title="Pending Users" bordered>
        <Table
          columns={usersColumns}
          dataSource={pendingUsers}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "No pending users available." }}
          scroll={{ x: "max-content" }} // Enables horizontal scrolling for wide content
          responsive
        />
      </Card>
      <br></br>
      <Card title="Pending Transfer Applicaitons" bordered>
        <Table
          columns={transferApplicationsColumns}
          dataSource={pendingTransferApplications}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "No pending applicaitons available." }}
          scroll={{ x: "max-content" }} // Enables horizontal scrolling for wide content
          responsive
        />
      </Card>
    </div>
  );
}
