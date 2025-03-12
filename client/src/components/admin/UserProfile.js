import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Row, Col, Typography, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // Add this import

const { Title, Text } = Typography;

const UserProfile = ({ adminRole }) => {
  const { id } = useParams(); // Get ID from URL params
  const [user, setUser] = useState(null); // Corrected to user (singular)
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Fetch user details
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/user/${id}`)
      .then((response) => setUser(response.data))
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
      ) : user ? (
        <div
          key={user._id}
          style={{
            marginBottom: 30,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 10,
          }}
        >
          <Row gutter={[16, 16]} justify="start">
            {/* Display user details */}
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                Name with Initial:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.nameWithInitial || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                First Name:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.firstName || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                Last Name:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.lastName || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                NIC:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.NIC || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                Gender:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.gender || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                Date of Birth:
              </Title>
            </Col>
            <Col span={12}>
              <Text>
                {user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                Address
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.address || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                Email:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.email || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                Contact Number:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.contactNumber || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                First Appointment Date:
              </Title>
            </Col>
            <Col span={12}>
              <Text>
                {user.first_appointment_date
                  ? new Date(user.first_appointment_date).toLocaleDateString()
                  : "N/A"}
              </Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                Duty assumed at current workplace:
              </Title>
            </Col>
            <Col span={12}>
              <Text>
                {user.duty_assumed_date
                  ? new Date(user.duty_assumed_date).toLocaleDateString()
                  : "N/A"}
              </Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
                Designation:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.designation || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
              Class:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.class || "N/A"}</Text>
            </Col>
            <Col span={12}>
              <Title level={5} style={{ textAlign: "left" }}>
              Service:
              </Title>
            </Col>
            <Col span={12}>
              <Text>{user.service || "N/A"}</Text>
            </Col>
          </Row>
        </div>
      ) : (
        <Text>No user data found.</Text> // Show this if no data
      )}
    </div>
  );
};

export default UserProfile;
