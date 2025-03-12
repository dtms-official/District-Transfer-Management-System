import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Button, Drawer, Spin } from "antd";
import {
  IdcardOutlined,
  ProfileOutlined,
  CalendarOutlined,
  WarningOutlined,
  TeamOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import UserProfile from "../../components/admin/UserProfile";
import UserWorkHistory from "../../components/admin/UserWorkHistory";
import LeaveDetails from "../../components/admin/LeaveDetails";
import Petitions from "../../components/admin/Petitions";
import UserDependence from "../../components/admin/UserDependence";
import UserDisease from "../../components/admin/UserDisease";
import UserMedicalCondition from "../../components/admin/UserMedicalCondition";
import UserDisability from "../../components/admin/UserDisability";
import FinalReview from "../../components/admin/FinalReview";
import useCheckAdminAuth from "../../utils/checkAdminAuth";

import { Grid } from "antd";
const { useBreakpoint } = Grid;
const { Content, Sider } = Layout;

const UserViewProfile = () => {
  const { adminData, loading } = useCheckAdminAuth();
  const [currentSection, setCurrentSection] = useState("UserProfile");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint(); // Detect screen size

  const location = useLocation();
  const isSubmited = location.state?.isSubmited; // Access passed data
  const adminRole = adminData?.adminRole || null;

  const sections = [
    { key: "BasicDetails", label: "Basic Details", icon: <IdcardOutlined /> },
    { key: "WorkHistory", label: "Work History", icon: <ProfileOutlined /> },
    { key: "LeaveDetails", label: "Leave Details", icon: <CalendarOutlined /> },
    {
      key: "Petitions",
      label: "Petitions & Disciplinary Actions",
      icon: <WarningOutlined />,
    },
    { key: "Dependence", label: "Dependence", icon: <TeamOutlined /> },
    { key: "Disease", label: "Disease", icon: <HeartOutlined /> },
    {
      key: "MedicalCondition",
      label: "Medical Condition",
      icon: <MedicineBoxOutlined />,
    },
    { key: "Disability", label: "Disability", icon: <EyeInvisibleOutlined /> },
    ...(isSubmited
      ? []
      : [
          {
            key: "FinalReview",
            label: "Final Review",
            icon: <CheckCircleOutlined />,
          },
        ]),
  ];

  const renderContent = () => {
    switch (currentSection) {
      case "UserProfile":
        return <UserProfile adminRole={adminRole} />;
      case "WorkHistory":
        return <UserWorkHistory adminRole={adminRole} />;
      case "LeaveDetails":
        return <LeaveDetails adminRole={adminRole} />;
      case "Petitions":
        return <Petitions adminRole={adminRole} />;
      case "Dependence":
        return <UserDependence adminRole={adminRole} />;
      case "Disease":
        return <UserDisease adminRole={adminRole} />;
      case "MedicalCondition":
        return <UserMedicalCondition adminRole={adminRole} />;
      case "Disability":
        return <UserDisability adminRole={adminRole} />;
      case "FinalReview":
        return <FinalReview adminRole={adminRole} />;
      default:
        return null;
    }
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

  return (
    <>
      {/* Toggle Button for Mobile View */}
      {screens.sm || screens.xs ? (
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
      ) : null}

      {/* Sidebar for larger screens */}
      {!screens.sm && !screens.xs && (
        <Sider width={250}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[currentSection]}
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

      {/* Drawer for mobile/tablet screens */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={250}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentSection]}
          style={{
            height: "100%",
            borderRight: 0,
            padding: "15px",
            backgroundColor: "#fff",
          }}
          onClick={({ key }) => setCurrentSection(key)}
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
            <Link to="/admin_dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{currentSection}</Breadcrumb.Item>
          {isSubmited ? isSubmited : "hello"}
        </Breadcrumb>
        {renderContent()}
      </Content>
    </>
  );
};

export default UserViewProfile;
