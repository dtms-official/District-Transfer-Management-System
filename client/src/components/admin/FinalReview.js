import React, { useState, useEffect } from "react";
import {
  message,
  Typography,
  Col,
  Card,
  Divider,
  Row,
  Space,
  Modal,
  Input,
} from "antd";
import { Button, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const UserProfile = ({ adminRole }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL params
  const [user, setUser] = useState(null); // Corrected to user (singular)
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [rejectReason, setRejectReason] = useState(""); // Rejection reason state

  useEffect(() => {
    // Fetch user details
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/user/${id}`)
      .then((response) => setUser(response.data))
      .catch(() => message.error("Failed to load user data"));
  }, [id]);

  const handleStatusChange = async (status) => {
    let endpoint = status;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/${endpoint}/${id}`
      );
      if (response.status === 200) {
        setUser({ ...user, status });
        message.success(response.data.message);
        navigate("/admin_dashboard");
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(
        error.response?.data?.error || "Failed to update user data"
      );
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/reject/${id}`,
        { rejectReason }
      );
      if (response.status === 200) {
        setUser({ ...user, status: "rejected", rejectReason });
        message.success(response.data.message);
        setIsModalVisible(false); // Close modal after rejection
        navigate("/admin_dashboard");
      }
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to update user data"
      );
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 30 }}>
      {user && (
        <Card
          bordered
          style={{
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Tag
            color="green"
            style={{ fontSize: 16, padding: "5px 10px", borderRadius: 5 }}
          >
            <strong>Admin Role:</strong>{" "}
            {adminRole === "checkingAdmin"
              ? "Checking Admin"
              : adminRole === "recommendAdmin"
              ? "Recommend Admin"
              : adminRole === "approveAdmin"
              ? "Approve Admin"
              : "Admin"}
          </Tag>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col span={10}>
              <Text></Text> <Text>{user.nameWithInitial}</Text>
              <Text></Text> <Text>{user.designation}</Text>
              <Text></Text> <Text>{user.NIC}</Text>
            </Col>
          </Row>

          <Divider />

          <Space
            style={{
              display: "flex",
              marginTop: 20,
              justifyContent: "start",
            }}
          >
            <Button
              type="primary"
              onClick={() =>
                handleStatusChange(
                  adminRole === "checkingAdmin"
                    ? "check"
                    : adminRole === "recommendAdmin"
                    ? "recommend"
                    : "approve"
                )
              }
              disabled={["check", "recommend", "approve"].includes(user.status)}
            >
              {adminRole === "checkingAdmin"
                ? "Check"
                : adminRole === "recommendAdmin"
                ? "Recommend"
                : "Approve"}
            </Button>

            <Button
              danger
              onClick={() => setIsModalVisible(true)} // Show modal on reject button click
              disabled={user.status === "rejected"}
            >
              Reject
            </Button>
          </Space>

          {/* Modal for rejection reason */}
          <Modal
            title="Reject User"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)} // Close modal without saving
            footer={[
              <Button key="back" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleReject}>
                Submit
              </Button>,
            ]}
          >
            <Input.TextArea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please provide a reason for rejection"
            />
          </Modal>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
