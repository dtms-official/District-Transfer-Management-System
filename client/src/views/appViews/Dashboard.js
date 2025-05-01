import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Descriptions,
  Progress,
  Button,
  Divider,
  Tag,
  Avatar,
  notification,
  message,
  Spin,
} from "antd";
import { CheckCircleOutlined, PaperClipOutlined } from "@ant-design/icons";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserData from "../../api/useUserData";

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useUserData();
  const [profileCompletion, setProfileCompletion] = useState(0);

  const fetchValue = useCallback(() => {
    if (user) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/user/user/progress/${user._id}`)
        .then((response) => {
          setProfileCompletion(response.data.progress);
        })
        .catch(() => message.error("Failed to fetch progress"));
    }
  }, [user]);

  useEffect(() => {
    fetchValue();
  }, [fetchValue]);

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
    <Content
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "24px",
      }}
    >
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={24} md={16} lg={12} xl={10}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Avatar
                size={64}
                style={{
                  backgroundColor: "#1890ff",
                  fontSize: 24,
                  marginRight: 16,
                }}
              >
                {user ? user.nameWithInitial.charAt(0) : "U"}
              </Avatar>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {user ? user.nameWithInitial : "Welcome, User!"}
                </Title>
                <Text type="secondary">{user?.contactNumber || "User"}</Text>
              </div>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Descriptions column={1} size="middle">
              <Descriptions.Item label="NIC">
                {user?.NIC || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Designation">
                {user?.designation || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Workplace">
                {user?.workplace_id || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {user?.isApproved ? (
                  <Tag color="green">Approved</Tag>
                ) : user?.isRecommended ? (
                  <Tag color="blue">Recommended</Tag>
                ) : user?.isChecked ? (
                  <Tag color="orange">Checked</Tag>
                ) : user?.isSubmited ? (
                  <Tag color="yellow">Submitted</Tag>
                ) : (
                  <Tag color="red">Pending</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: "16px 0" }} />

            <div style={{ marginBottom: 8 }}>
              <Text strong>Profile Completion</Text>
              <Text style={{ float: "right" }}>{profileCompletion}%</Text>
            </div>
            <Progress
              percent={profileCompletion}
              strokeColor={
                profileCompletion <= 15
                  ? "#ff4d4f"
                  : profileCompletion <= 50
                  ? "#faad14"
                  : profileCompletion <= 75
                  ? "#1890ff"
                  : "#52c41a"
              }
              strokeLinecap="round"
              showInfo={false}
              style={{ marginBottom: 8 }}
            />
            {profileCompletion === 100 ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Complete
              </Tag>
            ) : (
              <Text type="secondary">
                Complete your profile
              </Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} justify="center" style={{ marginTop: 24 }}>
        <Col xs={24} sm={24} md={16} lg={12} xl={10}>
          <Button
            type="primary"
            size="large"
            block
            style={{
              height: 48,
              borderRadius: "8px",
              fontSize: 16,
              fontWeight: 500,
            }}
            onClick={() => {
              if (!user?.isApproved) {
                notification.error({
                  message: "Approval Required",
                  description:
                    "Your account needs administrator approval before you can apply for transfers",
                });
              } else {
                navigate(
                  "/dashboard/transfer-management/transfer-applications"
                );
              }
            }}
          >
            <PaperClipOutlined style={{ marginRight: 8 }} />
            Apply for Transfer
          </Button>
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboard;
