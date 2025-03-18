import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Row, Col, Typography, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // Add this import

const { Title, Text } = Typography;

const UserMedicalCondition = ({ adminRole }) => {
  const { id } = useParams(); // Get ID from URL params
  const [medicalConditions, setMedicalcondition] = useState([]); // Use an array for work histories
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/medicalcondition/user/${id}`)
      .then((response) => {
        if (response.data.length > 0) {
          setMedicalcondition(response.data);
        } else {
          message.error("No Medical conditions");
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
      ) : medicalConditions.length > 0 ? (
        medicalConditions.map((mc) => (
          <div
            key={mc._id}
            style={{
              marginBottom: 30,
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 10,
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Title level={5}>Type</Title>
              </Col>
              <Col span={12}>
                <Text>{mc.type || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5}>Notes</Title>
              </Col>
              <Col span={12}>
                <Text>{mc.notes || "N/A"}</Text>
              </Col>
            </Row>
          </div>
        ))
      ) : (
        <Text>No medical conditions</Text> // Show this if no data
      )}
    </div>
  );
};

export default UserMedicalCondition;
