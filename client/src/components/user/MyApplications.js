import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Typography,
  Tag,
  Row,
  Col,
  Divider,
  notification,
  Spin,
} from "antd";
import getWorkplaces from "../../api/getWorkplaces";
import axios from "axios";
import useUserData from "../../api/useUserData";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  EnvironmentTwoTone,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
const { Text } = Typography;

export default function MyApplications() {
  const [userApplication, setUserApplication] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transferWindows, setTransferWindows] = useState([]);
  const { workplaces, fetchWorkplaces } = getWorkplaces();
  const { user } = useUserData();

  const userId = user?._id;

  const getUserApplication = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/my-application/user/${userId}`
      );
      setUserApplication(res.data || []);
    } catch (error) {
      notification.error({
        description:
          error?.response?.data?.error || "Failed to fetch application data.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchTransferWindows = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/transfer-window`
      );
      setTransferWindows(response.data || []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch transfer windows.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserApplication();
      fetchWorkplaces();
      fetchTransferWindows();
    }
  }, [userId, getUserApplication, fetchWorkplaces]);

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
    <div className="min-h-screen flex justify-center items-start py-10 px-4">
      <Card className="w-full max-w-3xl">
        <Typography.Title level={3} className="text-center mb-6">
          My Transfer Applications
        </Typography.Title>

        {userApplication.length === 0 ? (
          <Text type="secondary">
            You haven't submitted any applications yet.
          </Text>
        ) : userApplication.length > 0 &&
          !userApplication.some((app) => app.isApproved) ? (
          <Text type="secondary">
            You have submitted an application. Wait for the approval.
          </Text>
        ) : (
          userApplication.map((app, index) => {
            const windowName =
              transferWindows.find((w) => w._id === app.transferWindowId)
                ?.name || "Unknown";
            const workplace1 =
              workplaces.find((w) => w._id === app.preferWorkplace_1)
                ?.workplace || "N/A";
            const workplace2 =
              workplaces.find((w) => w._id === app.preferWorkplace_2)
                ?.workplace || "N/A";
            const workplace3 =
              workplaces.find((w) => w._id === app.preferWorkplace_3)
                ?.workplace || "N/A";
            const transferred =
              workplaces.find((w) => w._id === app.transfered_workplace_id)
                ?.workplace || "Pending";

            return (
              <Card
                key={app._id}
                type="inner"
                title={
                  <span className="text-lg font-semibold">
                    <FileTextOutlined className="mr-2 text-blue-500" />
                    Application {index + 1}
                  </span>
                }
                className="mb-5 bg-white shadow-md rounded-lg border border-gray-200"
              >
                <Row gutter={[16, 12]}>
                  <Col span={12}>
                    <Text strong>
                      <CalendarOutlined className="mr-1" />
                      Transfer Window:
                    </Text>{" "}
                    {windowName}
                  </Col>

                  <Col span={12}>
                    <Text strong>
                      <FileTextOutlined className="mr-1 text-blue-500" />
                      Transfer Decision:
                    </Text>{" "}
                    <Tag
                      icon={
                        app.transferDesision ? (
                          <CheckCircleTwoTone twoToneColor="#1890ff" />
                        ) : (
                          <ClockCircleTwoTone />
                        )
                      }
                      color={app.transferDesision ? "blue" : "default"}
                    >
                      {app.transferDesision || "Not decided yet"}
                    </Tag>
                  </Col>

                  <Col span={12}>
                    <Text strong>
                      <EnvironmentTwoTone className="mr-1" />
                      Transferred Workplace:
                    </Text>{" "}
                    <Tag>{transferred || "Not assigned"}</Tag>
                  </Col>
                </Row>

                <Divider orientation="left" plain>
                  Preferences
                </Divider>

                <Row gutter={[16, 12]}>
                  <Col span={8}>
                    <Text strong>Preferred Workplace 1:</Text>
                    <div>{workplace1}</div>
                  </Col>
                  <Col span={8}>
                    <Text strong>Preferred Workplace 2:</Text>
                    <div>{workplace2}</div>
                  </Col>
                  <Col span={8}>
                    <Text strong>Preferred Workplace 3:</Text>
                    <div>{workplace3}</div>
                  </Col>
                </Row>

                <Divider orientation="left" plain>
                  Additional Info
                </Divider>

                <p>
                  <Text strong>Remarks:</Text> {app.remarks || "None"}
                </p>
                <p>
                  <Text strong>Applied On:</Text>{" "}
                  {new Date(app.createdAt).toLocaleString()}
                </p>
              </Card>
            );
          })
        )}
      </Card>
    </div>
  );
}
