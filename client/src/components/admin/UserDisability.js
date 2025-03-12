import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Row, Col, Typography, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // Add this import

const { Title, Text } = Typography;

const UserDisability = ({ adminRole }) => {
  const { id } = useParams(); // Get ID from URL params
  const [disabilities, setDisability] = useState([]); // Use an array for work histories
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/disability/user/${id}`)
      .then((response) => {
        setDisability(response.data); // Store disabilities
      })
      .catch((error) => {
        message.error(
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
          <Spin
            size="large"
            tip="Loading..."
            style={{ fontSize: "24px", transform: "scale(2)" }} // Enlarges the spinner
          />
        </div>
      ) : disabilities.length > 0 ? (
        disabilities.map((disability) => (
          <div
            key={disability._id}
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
                  Type
                </Title>
              </Col>
              <Col span={12}>
                <Text>{disability.type || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Notes
                </Title>
              </Col>
              <Col span={12}>
                <Text>{disability.level || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Since birth
                </Title>
              </Col>
              <Col span={12}>
                <Text>{disability.since_birth ? "YES" : "NO"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  How many years
                </Title>
              </Col>
              <Col span={12}>
                <Text>{disability.how_many_years || "N/A"}</Text>
              </Col>
              {/* Add other details similarly */}
            </Row>
          </div>
        ))
      ) : (
        <Text>No disabilities.</Text> // Show this if no data
      )}
    </div>
  );
};

export default UserDisability;
