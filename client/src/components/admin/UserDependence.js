import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Row, Col, Typography, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // Add this import

const { Title, Text } = Typography;

const UserDependence = ({ adminRole }) => {
  const { id } = useParams(); // Get ID from URL params
  const [dependence, setdependence] = useState([]); // Use an array for work histories
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/dependence/user/${id}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setdependence(response.data); // Store all work histories
        } else {
          message.error("No dependences");
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
      ) : dependence.length > 0 ? (
        dependence.map((dependence) => (
          <div
            key={dependence._id}
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
                  Dependent Name
                </Title>
              </Col>
              <Col span={12}>
                <Text>{dependence.dependentName || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Dependent Relationship
                </Title>
              </Col>
              <Col span={12}>
                <Text>{dependence.dependentRelationship || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Dependent NIC
                </Title>
              </Col>
              <Col span={12}>
                <Text>{dependence.dependentNIC || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Workplace
                </Title>
              </Col>
              <Col span={12}>
                <Text>{dependence.workplace || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Gender
                </Title>
              </Col>
              <Col span={12}>
                <Text>{dependence.gender || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  Dependent DOB
                </Title>
              </Col>
              <Col span={12}>
                <Text>
                  {dependence.dependent_DOB
                    ? new Date(dependence.dependent_DOB).toLocaleDateString()
                    : "N/A"}
                </Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  School
                </Title>
              </Col>
              <Col span={12}>
                <Text>{dependence.school || "N/A"}</Text>
              </Col>
              <Col span={12}>
                <Title level={5} style={{ textAlign: "left" }}>
                  City
                </Title>
              </Col>
              <Col span={12}>
                <Text>{dependence.city || "N/A"}</Text>
              </Col>
              {/* Add other details similarly */}
            </Row>
          </div>
        ))
      ) : (
        <Text>No dependence</Text> // Show this if no data
      )}
    </div>
  );
};

export default UserDependence;
