import React from "react";
import { Link } from "react-router-dom";
import { Layout, Button, Typography, Space } from "antd";
import logo from "../../assets/images/logo.png";
import bg from "../../assets/images/images.jpg";
import { jsPDF } from "jspdf";

const { Content, Header } = Layout;
const { Title } = Typography;

const HomePage = () => {
  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("User Guide", 20, 20);
    doc.text("Welcome to the User Guide. Here you can find all the information you need to get started with our platform.", 20, 30);
    doc.text("Step 1: Register an account.", 20, 40);
    doc.text("Step 2: Log in and start exploring.", 20, 50);
    doc.text("Step 3: Get help if needed by clicking the Help button.", 20, 60);
    doc.text("Thank you for using our service!", 20, 70);
    doc.save("user-guide.pdf");
  };

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
      <Header style={{ background: "transparent", padding: "10px" }}></Header>
      <Content style={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
        <img src={logo} alt="logo" style={{ width: "150px", marginBottom: "20px" }} />
        <Title style={{ color: "white" }} level={2}>
          District Secretariat Ampara{" "}
        </Title>

        <Space size="large">
          <Link to="/login">
            <Button type="primary" size="large">
              Login
            </Button>
          </Link>

          <Button onClick={generatePdf} type="default" size="large">
            Help
          </Button>
        </Space>
      </Content>
    </Layout>
  );
};

export default HomePage;
