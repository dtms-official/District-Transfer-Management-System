import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/user/Sidebar";
import HeaderBar from "../components/user/Headerbar";

const { Header, Content } = Layout;

const PageContainer = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}

      <Sidebar />

      <Layout>
        {/* Header */}
        <Header style={{ padding: 0, background: "#fff" }}>
          <HeaderBar />
        </Header>

        {/* Main Content */}
        <Content
          style={{
            minHeight: 280,
            backgroundColor: "#f5f5f5",
            alignItems: "center",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageContainer;
