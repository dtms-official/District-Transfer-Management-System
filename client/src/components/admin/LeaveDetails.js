import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Row, Col, Typography, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // Add this import

const { Title, Text } = Typography;

const LeaveDetails = ({ adminRole }) => {
  const { id } = useParams(); // Get ID from URL params
  const [leaveDetails, setLeaveDetails] = useState([]); // Use an array for work histories
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/leavedetails/user/${id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setLeaveDetails(response.data); // Store all work histories
        } else {
          message.error("No leave details not found");
        }
      })
      .catch((error) => {
        console.log(
          error.response?.data?.errors?.[0]?.msg ||
            error.response?.data?.error ||
            "Failed to load user data"
        );
      })
      .finally(() => setLoading(false)); // Stop loading
  }, [id]);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 30 }}>
      <Tag color="green" className="mb-3">
        <strong>Admin Role:</strong>{" "}
        {adminRole === "checkingAdmin"
          ? "Checking Admin"
          : adminRole === "recommendAdmin"
          ? "Recommend Admin"
          : adminRole === "approveAdmin"
          ? "Approve Admin"
          : "Admin"}
      </Tag>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          leaveDetails
          <Spin
            size="large"
            tip="Loading..."
            style={{ fontSize: "24px", transform: "scale(2)" }} // Enlarges the spinner
          />
        </div>
      ) : leaveDetails.length > 0 ? (
        leaveDetails.map((leaveDetail) => (
          <div
            key={leaveDetail._id}
            style={{
              marginBottom: 30,
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 10,
            }}
          >
            <Row gutter={[16, 16]} justify="start">
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Year
                </Title>
              </Col>
              <Col span={12}>
                <Text>{leaveDetail.year || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Type
                </Title>
              </Col>
              <Col span={12}>
                <Text>{leaveDetail.type || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  No of days
                </Title>
              </Col>
              <Col span={12}>
                <Text>{leaveDetail.no_of_days || "N/A"}</Text>
              </Col>
              {/* Add other details similarly */}
            </Row>
          </div>
        ))
      ) : (
        <Text>No leave details</Text> // Show this if no data
      )}
    </div>
  );
};

export default LeaveDetails;
