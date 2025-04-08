/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Avatar, Dropdown, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const HeaderBar = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    message.success("Logged out successfully");
    navigate("/login"); // Redirect to login page
  };

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <Link to="/dashboard/update-profile">Profile</Link>,
    },
    {
      key: "2",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: 20,
        background: "#fdfbff",
      }}
    >
      <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Avatar
            size="large"
            className="bg-blue-500"
            icon={<UserOutlined />}
          />
        </a>
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
