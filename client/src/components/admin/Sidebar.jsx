import React, { useState } from "react";
import { Menu, Drawer, Button, Spin } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  MenuOutlined,
  TeamOutlined,
  SolutionOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import useCheckAdminAuth from "../../utils/checkAdminAuth";
import SettingsModal from "./SettingsModal"; // Import the SettingsModal

const Sidebar = () => {
  const { adminData, loading } = useCheckAdminAuth();
  const adminRole = adminData?.adminRole || null;

  const [visible, setVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false); // Modal visibility state

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const showSettingsModal = () => {
    setIsSettingsModalVisible(true); // Show the modal
  };

  const closeSettingsModal = () => {
    setIsSettingsModalVisible(false); // Close the modal
  };

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

      {/* Sidebar Menu */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        visible={visible}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={closeDrawer}>
            <Link to="/admin_dashboard">Dashboard</Link>
          </Menu.Item>

          {adminRole === "superAdmin" && (
            <Menu.Item key="2" icon={<TeamOutlined />} onClick={closeDrawer}>
              <Link to="admin_dashboard/admin-management">
                Admin Management
              </Link>
            </Menu.Item>
          )}
          <Menu.Item key="3" icon={<TeamOutlined />} onClick={closeDrawer}>
            <Link to="admin_dashboard/user-management">User Management</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<SolutionOutlined />} onClick={closeDrawer}>
            <Link to="admin_dashboard/cadre-management">Cadre Management</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="5"
            icon={<BarChartOutlined />}
            title="Transfer Management"
          >
            {adminRole === "superAdmin" && (
              <Menu.Item key="2-1"onClick={closeDrawer}>
                <Link to="/admin_dashboard/transfer-management/transfer-window">
                  Transfer Window
                </Link>
              </Menu.Item>
            )}
            <Menu.Item key="2-2" onClick={closeDrawer}>
              <Link to="/admin_dashboard/transfer-management/transfer-applications">
                Transfer Applications
              </Link>
            </Menu.Item>
              <Menu.Item key="2-3" onClick={closeDrawer}>
                <Link to="/admin_dashboard/transfer-management/notApllied-user">
                  Not Applied List
                </Link>
              </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item
            key="6"
            icon={<SettingOutlined />}
            onClick={showSettingsModal}
          >
            Settings
          </Menu.Item>
        </Menu>
      </Drawer>

      {/* Settings Modal */}
      <SettingsModal
        isVisible={isSettingsModalVisible}
        onClose={closeSettingsModal}
      />
    </>
  );
};

export default Sidebar;
