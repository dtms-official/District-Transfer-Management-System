import React, { useState } from "react";
import { Menu, Drawer, Button } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  MenuOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import SettingsModal from "./SettingsModal"; // Import child modal component

const Sidebar = () => {
  const [visible, setVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  // Drawer Control
  const showDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  // Settings Modal Control
  const showSettingsModal = () => setIsSettingsModalVisible(true);
  const closeSettingsModal = () => setIsSettingsModalVisible(false);

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
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

      {/* Sidebar Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        open={visible}
      >
        <Menu mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />} onClick={closeDrawer}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>

          <Menu.SubMenu
            key="2"
            icon={<BarChartOutlined />}
            title="Transfer Management"
          >
            <Menu.Item key="2-1" onClick={closeDrawer}>
              <Link to="/dashboard/transfer-management/transfer-applications">
                Apply for transfer
              </Link>
            </Menu.Item>
            <Menu.Item key="2-2" onClick={closeDrawer}>
              <Link to="/dashboard/transfer-management/my-applications">
                My applications
              </Link>
            </Menu.Item>
          </Menu.SubMenu>

          {/* Single Settings Option */}
          <Menu.Item
            key="3"
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
