import React from "react";
import { Link } from "react-router-dom";
import { Layout, Button, Typography, Space } from "antd";
import logo from "../../assets/images/logo.png";
import bg from "../../assets/images/images.jpg";

const { Content, Header } = Layout;
const { Title } = Typography;

const HomePage = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        textAlign: "center",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Header with Language Selector */}
      <Header
        style={{
          background: "transparent", // Correct spelling
          padding: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      ></Header>

      {/* Main Content */}
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: "150px", marginBottom: "20px" }}
        />
        <Title style={{ color: "white" }} level={2}>
          District Secretariat Ampara{" "}
        </Title>

        {/* Buttons Section */}
        <Space size="large">
          <Link to="/login">
            <Button type="primary" size="large">
              Get start
            </Button>
          </Link>
        </Space>
      </Content>
    </Layout>
  );
};

export default HomePage;
