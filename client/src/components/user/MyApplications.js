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
  Pagination,
} from "antd";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  EnvironmentTwoTone,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import getWorkplaces from "../../api/getWorkplaces";
import useUserData from "../../api/useUserData";

const { Text } = Typography;

export default function MyApplications() {
  const [userApplication, setUserApplication] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingWindows, setLoadingWindows] = useState(false);
  const [transferWindows, setTransferWindows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(2);

  const { workplaces, fetchWorkplaces } = getWorkplaces();
  const { user } = useUserData();
  const userId = user?._id;

  const getUserApplication = useCallback(async () => {
    setLoadingApplications(true);
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
      setLoadingApplications(false);
    }
  }, [userId]);

  const fetchTransferWindows = async () => {
    setLoadingWindows(true);
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
      setLoadingWindows(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserApplication();
      fetchWorkplaces();
      fetchTransferWindows();
    }
  }, [userId, getUserApplication, fetchWorkplaces]);

  useEffect(() => {
    if ((currentPage - 1) * pageSize >= userApplication.length) {
      setCurrentPage(1);
    }
  }, [userApplication, currentPage, pageSize]);

  const getWorkplaceName = (id) =>
    workplaces.find((w) => w._id === id)?.workplace || "N/A";

  if (loadingApplications || loadingWindows)
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
          style={{ fontSize: "24px", transform: "scale(2)" }}
        />
      </div>
    );

  const sortedApplications = userApplication
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Check if there's an application with isProcessed: false and isPublished: false
  const highlightedApp = sortedApplications.find(
    (app) => app.isProcessed === false && app.isPublished === false
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedApps = sortedApplications.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen flex justify-center items-start py-10 px-4">
      <Card className="w-full max-w-3xl">
        <Typography.Title level={3} className="text-center mb-6">
          My Transfer Applications
        </Typography.Title>

        {userApplication.length === 0 ? (
          <Text type="primary">
            You haven't submitted any applications yet.
          </Text>
        ) : (
          <>
            {/* If there's an application with isProcessed: false and isPublished: false, show the message */}
            {highlightedApp && (
              <Text type="success" className="block mb-4">
                Your application has been approved. Wait for transfer decision.
              </Text>
            )}

            {/* Render the list of applications, excluding the one with isProcessed: false and isPublished: false */}
            {paginatedApps.map((app, index) => {
              const appNumber = userApplication.length - (startIndex + index);
              const windowName =
                transferWindows.find((w) => w._id === app.transferWindowId)
                  ?.name || "Unknown";
              const workplace1 = getWorkplaceName(app.preferWorkplace_1);
              const workplace2 = getWorkplaceName(app.preferWorkplace_2);
              const workplace3 = getWorkplaceName(app.preferWorkplace_3);
              const transferred =
                getWorkplaceName(app.transfered_workplace_id) || "Pending";

              // Skip rendering the application with isProcessed: false and isPublished: false
              if (app.isProcessed === false && app.isPublished === false) return null;

              return (
                <Card
                  key={app._id}
                  type="inner"
                  title={
                    <span className="text-lg font-semibold">
                      <FileTextOutlined className="mr-2 text-blue-500" />
                      Application {appNumber}
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
                          app.transferDecision ? (
                            <CheckCircleTwoTone twoToneColor="#1890ff" />
                          ) : (
                            <ClockCircleTwoTone />
                          )
                        }
                        color={app.transferDecision ? "blue" : "default"}
                      >
                        {app.transferDecision || "Not decided yet"}
                      </Tag>
                    </Col>

                    <Col span={12}>
                      <Text strong>
                        <EnvironmentTwoTone className="mr-1" />
                        Transferred Workplace:
                      </Text>{" "}
                      <Tag>{transferred}</Tag>
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
                    <Text strong>Remarks:</Text> {app.remarks || "No remarks"}
                  </p>
                  <p>
                    <Text strong>Applied On:</Text>{" "}
                    {new Date(app.createdAt).toLocaleString()}
                  </p>
                </Card>
              );
            })}

            <div className="flex justify-center mt-4">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={sortedApplications.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
