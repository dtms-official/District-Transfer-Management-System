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
import SettingsModal from "./SettingsModal";

const Sidebar = () => {
  const { adminData, loading } = useCheckAdminAuth();
  const adminRole = adminData?.adminRole || null;

  const [visible, setVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const showSettingsModal = () => {
    setIsSettingsModalVisible(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalVisible(false);
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
          style={{ fontSize: "24px", transform: "scale(2)" }}
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
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/admin_dashboard" onClick={closeDrawer}>
              Dashboard
            </Link>
          </Menu.Item>

          {adminRole === "superAdmin" && (
            <Menu.Item key="2" icon={<TeamOutlined />}>
              <Link to="/admin_dashboard/admin-management" onClick={closeDrawer}>
                Admin Management
              </Link>
            </Menu.Item>
          )}
          <Menu.Item key="3" icon={<TeamOutlined />}>
            <Link to="/admin_dashboard/user-management" onClick={closeDrawer}>
              User Management
            </Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<SolutionOutlined />}>
            <Link to="/admin_dashboard/cadre-management" onClick={closeDrawer}>
              Cadre Management
            </Link>
          </Menu.Item>
          <Menu.SubMenu
            key="5"
            icon={<BarChartOutlined />}
            title="Transfer Management"
          >
            {adminRole === "superAdmin" && (
              <Menu.Item key="2-1">
                <Link
                  to="/admin_dashboard/transfer-management/transfer-window"
                  onClick={closeDrawer}
                >
                  Transfer Window
                </Link>
              </Menu.Item>
            )}
            <Menu.Item key="2-2">
              <Link
                to="/admin_dashboard/transfer-management/transfer-applications"
                onClick={closeDrawer}
              >
                Transfer Applications
              </Link>
            </Menu.Item>
            <Menu.Item key="2-3">
              <Link
                to="/admin_dashboard/transfer-management/notApllied-user"
                onClick={closeDrawer}
              >
                Not Applied List
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item
            key="6"
            icon={<SettingOutlined />}
            onClick={() => {
              closeDrawer();
              showSettingsModal();
            }}
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


