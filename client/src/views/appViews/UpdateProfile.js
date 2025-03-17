import React, { useState, useMemo } from "react";
import { Layout, Menu, Breadcrumb, Button, Drawer, Spin, Alert } from "antd";
import {
  ProfileOutlined,
  CalendarOutlined,
  TeamOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  MenuOutlined,
  ExceptionOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import UserProfile from "../../components/user/UserProfile";
import UserWorkHistory from "../../components/user/UserWorkHistory";
import LeaveDetails from "../../components/user/LeaveDetails";
import Petitions from "../../components/user/Petitions";
import UserDependence from "../../components/user/UserDependence";
import UserDisease from "../../components/user/UserDisease";
import UserMedicalCondition from "../../components/user/UserMedicalCondition";
import UserDisability from "../../components/user/UserDisability";
import FinalSubmition from "../../components/user/FinalSubmition";
import useUserData from "../../api/useUserData";

import { Grid } from "antd";
const { useBreakpoint } = Grid;
const { Content, Sider } = Layout;

const UpdateProfile = () => {
  const { user, loading, error } = useUserData();

  const [currentSection, setCurrentSection] = useState("BasicDetails");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();

  const sections = useMemo(
    () => [
      {
        key: "BasicDetails",
        label: "Basic Details",
        icon: user?.isUpdated ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <ProfileOutlined /> // Replace with the default icon you want to show when isUpdated is false
        ),
      },
      {
        key: "WorkHistory",
        label: "Work History",
        icon: user?.isWorkHistorySubmited ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <ClockCircleOutlined />
        ),
      },
      {
        key: "LeaveDetails",
        label: "Leave Details",
        icon: user?.isLeaveDetailsSubmited ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CalendarOutlined />
        ),
      },
      {
        key: "Petitions",
        label: "Petitions & Disciplinary Actions",
        icon: user?.isPettionSubmited ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CalendarOutlined />
        ),
      },
      {
        key: "Dependence",
        label: "Dependence",
        icon: user?.isDependenceSubmited ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <TeamOutlined />
        ),
      },
      {
        key: "Disease",
        label: "Disease",
        icon: user?.isDiseaseSubmited ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <HeartOutlined />
        ),
      },
      {
        key: "MedicalCondition",
        label: "Medical Condition",
        icon: user?.isMedicalConditionSubmited ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <MedicineBoxOutlined />
        ),
      },
      {
        key: "Disability",
        label: "Disability",
        icon: user?.isDisabilitySubmited ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <EyeInvisibleOutlined />
        ),
      },
      ...(user?.isDisabilitySubmited && !user?.isSubmited
        ? [
            {
              key: "FinalSubmition",
              label: "Final Submission",
              icon: <ExceptionOutlined />,
            },
          ]
        : []),
    ],
    [user]
  );

  const renderContent = () => {
    const content = (
      <div style={{ position: "relative" }}>
        {currentSection === "BasicDetails" && <UserProfile user={user} />}
        {currentSection === "WorkHistory" && <UserWorkHistory user={user} />}
        {currentSection === "LeaveDetails" && <LeaveDetails user={user} />}
        {currentSection === "Petitions" && <Petitions user={user} />}
        {currentSection === "Dependence" && <UserDependence user={user} />}
        {currentSection === "Disease" && <UserDisease user={user} />}
        {currentSection === "MedicalCondition" && (
          <UserMedicalCondition user={user} />
        )}
        {currentSection === "Disability" && <UserDisability user={user} />}
        {currentSection === "FinalSubmition" && <FinalSubmition user={user} />}
      </div>
    );

    return user?.isSubmited ? (
      <div style={{ position: "relative" }}>
        {content}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.0.2)",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#838c93",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {user.isApproved
            ? "Profile Verified - Read only"
            : user.isSubmited
            ? "Profile Submited - Read only"
            : " "}
        </div>
      </div>
    ) : (
      content
    );
  };

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

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

  // Declare a variable to hold the key
  // let notificationKey = "rejectNotification";

  // const showNotification = (type, message, description) => {
  //   notification[type]({
  //     message: message,
  //     description: description,
  //     placement: "topRight",
  //     duration: 3, // Duration in seconds
  //     key: notificationKey, // Use a unique key to ensure only one notification shows
  //   });
  // };

  // // Example of how to use it for reject reason
  // if (user.rejectReason) {
  //   showNotification("warning", "Your profile Rejected");
  // }

  return (
    <>
      {/* Toggle Button for Mobile View */}
      {(screens.sm || screens.xs) && (
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          style={{
            position: "fixed",
            top: 12,
            left: 20,
            zIndex: 1000,
            borderRadius: "50%",
            width: 50,
            height: 50,
            backgroundColor: "#1890ff",
          }}
        />
      )}

      {/* Sidebar for Larger Screens */}
      {!(screens.sm || screens.xs) && (
        <Sider width={250}>
          <Menu
            mode="inline"
            selectedKeys={[currentSection]}
            style={{ height: "100%", borderRight: 0, padding: "15px" }}
            onClick={({ key }) => setCurrentSection(key)}
          >
            {sections.map((section) => (
              <Menu.Item key={section.key} icon={section.icon}>
                {section.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      )}

      {/* Drawer for Mobile View */}
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={closeDrawer}
        open={drawerVisible} // Updated from 'visible'
      >
        <Menu
          mode="inline"
          selectedKeys={[currentSection]}
          onClick={({ key }) => {
            setCurrentSection(key);
            closeDrawer();
          }}
        >
          {sections.map((section) => (
            <Menu.Item key={section.key} icon={section.icon}>
              {section.label}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>

      {/* Main Content */}
      <Content
        style={{
          padding: 40,
          margin: 0,
          minHeight: 280,
          background: "#fff",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Breadcrumb style={{ margin: "auto ", padding: "5px" }}>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{currentSection}</Breadcrumb.Item>
        </Breadcrumb>

        <div className="m-auto w-auto text-center">
          {/* Main Status Message */}
          <Alert
            style={{
              maxWidth: 900,
              fontSize: 14,
              padding: "10px 20px",
              alignItems: "start",
              margin: "auto",
              backgroundColor: user.isRejected ? "#fff3cd" : "#f1f1f1",
              borderRadius: "8px",
              textAlign: "left", // Align text to the left for better readability
            }}
            message={
              user.isApproved
                ? "Profile verified"
                : user.isRejected
                ? "Your data is invalid, please resubmit"
                : user.isSubmited
                ? "Your data submitted, please wait for the approval"
                : "Your profile is not submitted, Please submit."
            }
            description={user.rejectReason || ""} // Conditionally add reject reason in description
            type={
              user.isApproved
                ? "success"
                : user.isRejected
                ? "error"
                : user.isSubmited
                ? "success"
                : "warning"
            }
            showIcon
            className="mb-4"
          />
        </div>

        {renderContent()}
        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}
      </Content>
    </>
  );
};

export default UpdateProfile;
