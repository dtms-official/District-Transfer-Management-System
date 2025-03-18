import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Row, Col, Typography, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // Add this import

const { Title, Text } = Typography;

const UserWorkHistory = ({ adminRole }) => {
  const { id } = useParams(); // Get ID from URL params
  const [workHistories, setWorkHistories] = useState([]); // Use an array for work histories
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/workhistory/user/${id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setWorkHistories(response.data); // Store all work histories
        } else {
          message.error("No Work histories");
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
      ) : workHistories.length > 0 ? (
        workHistories.map((history) => (
          <div
            key={history._id}
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
                  Start Date:
                </Title>
              </Col>
              <Col span={12}>
                <Text>
                  {history.start_date
                    ? new Date(history.start_date).toLocaleDateString()
                    : "N/A"}
                </Text>
              </Col>

              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  End Date:
                </Title>
              </Col>
              <Col span={12}>
                <Text>
                  {history.end_date
                    ? new Date(history.end_date).toLocaleDateString()
                    : "N/A"}
                </Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Workplace
                </Title>
              </Col>
              <Col span={12}>
                <Text>{history.workplace || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Workplace type
                </Title>
              </Col>
              <Col span={12}>
                <Text>{history.workplace_type || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Workplace City
                </Title>
              </Col>
              <Col span={12}>
                <Text>{history.workplace_city || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Workplace Postal Code
                </Title>
              </Col>
              <Col span={12}>
                <Text>{history.workplace_postal_code || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  designation
                </Title>
              </Col>
              <Col span={12}>
                <Text>{history.designation || "N/A"}</Text>
              </Col>
              {/* Add other details similarly */}
            </Row>
          </div>
        ))
      ) : (
        <Text>No work history</Text> // Show this if no data
      )}
    </div>
  );
};

export default UserWorkHistory;
