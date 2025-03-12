import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const HeaderBar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    sessionStorage.clear();
    navigate("/admin_login", { replace: true });
  };

  const menu = (
    <Menu>
      {/* <Menu.Item key="1" icon={<UserOutlined />}>
        Profile
      </Menu.Item> */}
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: 20,
        background: "#fff",
      }}
    >
      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar
          size="large"
          icon={<UserOutlined />}
          style={{ cursor: "pointer", margin: "13px", background: "#0176d0" }}
        />
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
