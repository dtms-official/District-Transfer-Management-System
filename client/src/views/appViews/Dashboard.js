import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Layout,
  Progress,
  Typography,
  Spin,
  message,
  Badge,
} from "antd";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import useUserData from "../../api/useUserData";

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  // const navigate = useNavigate();
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
        minHeight: 280,
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        padding: "30px",
      }}
    >
      {user ? (
        <div style={{ color: "black", margin: 40 }}>
          <Title level={2}>
            {user.nameWithInitial || "User"}
            {/* {user.lastName || ""} */}
          </Title>
          <Text>{user.NIC}</Text>
        </div>
      ) : (
        <Title level={2}>Welcome, User!</Title>
      )}

      <Title level={3}>Profile Progress</Title>

      <Progress
        percent={profileCompletion}
        status={
          profileCompletion <= 15
            ? "exception"
            : profileCompletion <= 50
            ? "active"
            : profileCompletion <= 75
            ? "normal"
            : "success"
        }
        showInfo={false}
        strokeColor={
          profileCompletion <= 15
            ? "#FF0000"
            : profileCompletion <= 50
            ? "#FF8C00"
            : profileCompletion <= 75
            ? "#2196F3"
            : "#4CAF50"
        }
        style={{ width: "20%", margin: "20px auto" }}
      />

      <Text> {profileCompletion}%</Text>

      {profileCompletion === 100 && (
        <span style={{ marginLeft: "10px" }}>
          <Badge status="success" text="Completed" />
        </span>
      )}

      <div style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          style={{ width: "250px" }}
          onClick={() => {
            if (!user.isApproved) {
              message.error("You need approval");
            } else {
              // navigate("/transfer");
              message.success("Now you can apply for transfer");
            }
          }}
        >
          Apply Transfer
        </Button>
      </div>
    </Content>
  );
};

export default Dashboard;
