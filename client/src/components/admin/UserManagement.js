import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Spin,
  message,
  Table,
  Button,
  Alert,
  Input,
  Tooltip,
  Select,
  Typography,
} from "antd";
import axios from "axios";
import { EyeOutlined, UnlockOutlined } from "@ant-design/icons";
import ResetPasswordModal from "./ResetPasswordModal"; // Adjust the path if needed
import getWorkplaces from "../../api/getWorkplaces";
import useCheckAdminAuth from "../../utils/checkAdminAuth";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchNIC, setSearchNIC] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterWorkplace, setFilterWorkplace] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { workplaces } = getWorkplaces();
  const { adminData } = useCheckAdminAuth();
  const adminRole = adminData.adminRole || null;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      message.error("Unauthorized! Please log in as an admin.");
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/admin/total-users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.length) {
          setUsers(data);
          setAllUsers(data);
        } else {
          message.error("No users found");
        }
      })

      .catch((error) =>
        message.error(error.response?.data?.error || "Failed to load user data")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = allUsers.filter(
      (user) =>
        (user.NIC?.toLowerCase().includes(searchNIC.toLowerCase()) ||
          !searchNIC) &&
        (user.designation
          ?.toLowerCase()
          .includes(filterDesignation.toLowerCase()) ||
          !filterDesignation)
    );
    setUsers(filtered);
  }, [searchNIC, filterDesignation, allUsers]);

  useEffect(() => {
    const filtered = allUsers.filter(
      (user) =>
        (user.NIC?.toLowerCase().includes(searchNIC.toLowerCase()) ||
          !searchNIC) &&
        (!filterWorkplace || user.workplace_id === filterWorkplace) // Fix: Direct comparison
    );
    setUsers(filtered);
  }, [searchNIC, filterWorkplace, allUsers]);

  const renderStatus = (user) => (
    <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: user.isChecked ? "orange" : "#d3d3d3",
        }}
      ></div>
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: user.isRecommended ? "blue" : "#d3d3d3",
        }}
      ></div>
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: user.isApproved ? "green" : "#d3d3d3",
        }}
      ></div>
    </div>
  );

  const showResetPasswordModal = (user) => {
    setSelectedUser(user);
    setModalLoading(true);
    setIsModalVisible(true);
    setTimeout(() => setModalLoading(false), 500); // Simulate loading delay
  };

  const columns = [
    {
      title: "Name With Initial",
      dataIndex: "nameWithInitial",
      render: (text) => text || "N/A",
    },
    { title: "NIC", dataIndex: "NIC" },
    {
      title: "Designation",
      dataIndex: "designation",
      render: (text) => text || "N/A",
    },
    {
      title: "Workplace",
      dataIndex: "workplace_id",
      render: (workplace_id, record) =>
        workplaces.find((wp) => wp._id === workplace_id)?.workplace ||
        "No Workplace Assigned",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      render: (text) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, user) => renderStatus(user),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {/* View Profile Button */}
          <Tooltip title="View profile">
            <Button
              className="btn text-blue-500"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(`/admin_dashboard/view-profile/${record._id}`, {
                  state: { isSubmited: true },
                })
              }
            />
          </Tooltip>

          {/* Change Password Button with Tooltip */}
          <Tooltip title="Reset Password">
            <Button
              icon={<UnlockOutlined />}
              onClick={() => showResetPasswordModal(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin
          size="large"
          tip="Loading..."
          style={{ fontSize: "24px", transform: "scale(2)" }} // Enlarges the spinner
        />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <Typography.Title level={3} className="mb-8 mt-5 pb-3">
        User Management
      </Typography.Title>
      <Alert
        message="Status Colors Information"
        description={
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "orange",
                }}
              ></div>
              <span> - Checked (Yellow)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "blue",
                }}
              ></div>
              <span> - Recommended (Blue)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "green",
                }}
              ></div>
              <span> - Approved (Green)</span>
            </div>
          </div>
        }
        type="info"
        showIcon
        className="mb-4"
      />

      <div className="flex gap-4 mb-4 border-b pb-4">
        <Input
          placeholder="Search by NIC..."
          value={searchNIC}
          onChange={(e) => setSearchNIC(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Input
          placeholder="Filter by Designation..."
          value={filterDesignation}
          onChange={(e) => setFilterDesignation(e.target.value)}
          className="w-full md:w-1/3"
        />

        {workplaces.length > 0 && adminRole === "superAdmin" && (
          <Select
            placeholder="Filter by Workplace..."
            value={filterWorkplace}
            onChange={setFilterWorkplace}
            allowClear
            className="w-full md:w-1/3"
          >
            {workplaces.map((workplace) => (
              <Select.Option key={workplace._id} value={workplace._id}>
                {workplace.workplace}
              </Select.Option>
            ))}
          </Select>
        )}
      </div>

      <ResetPasswordModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        modalLoading={modalLoading}
        setModalLoading={setModalLoading} // Passing setModalLoading function
        selectedUser={selectedUser}
      />

      <Table
        columns={columns}
        dataSource={users}
        pagination={users.length > 10 ? { pageSize: 10 } : false}
        rowKey="_id"
        scroll={{ x: false }}
      />
    </div>
  );
};

export default UserManagement;
