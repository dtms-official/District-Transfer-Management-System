import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Row, Col, Typography, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // Add this import

const { Title, Text } = Typography;

const UserDisease = ({ adminRole }) => {
  const { id } = useParams(); // Get ID from URL params
  const [diseases, setDisease] = useState([]); // Use an array for work histories
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/disease/user/${id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setDisease(response.data); // Store all work histories
        } else {
          message.error("No diseases");
        }
      })
      .catch((error) => {
        console.log(
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
      ) : diseases.length > 0 ? (
        diseases.map((disease) => (
          <div
            key={disease._id}
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
                <Text>{disease.type || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Are You Taking Treatment
                </Title>
              </Col>
              <Col span={12}>
                <Text>{disease.are_you_taking_treatment ? "YES" : "NO"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Treatment date
                </Title>
              </Col>
              <Col span={12}>
                <Text>{disease.treatment_date || "N/A"}</Text>
              </Col>
              {/* Add other details similarly */}
            </Row>
          </div>
        ))
      ) : (
        <Text>No disease</Text> // Show this if no data
      )}
    </div>
  );
};

export default UserDisease;
