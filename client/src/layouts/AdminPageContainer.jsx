import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import HeaderBar from "../components/admin/Headerbar";

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
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageContainer;
