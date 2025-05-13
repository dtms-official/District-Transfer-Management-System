import React from "react";
import { Link } from "react-router-dom";
import { Layout, Button, Typography, Space } from "antd";
import logo from "../../assets/images/logo.png";
import bg from "../../assets/images/images.jpg";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const { Content, Header } = Layout;
const { Title } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/about");
  };
  const generatePdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Admin Accounts Overview", 20, 20);

    // Kalmunai Section
    doc.setFontSize(12);
    doc.text("Divisional Secretariat, Kalmunai", 20, 30);
    doc.text(
      "1. Admin ID: S5371V | Role: Super Admin      | Password: 259227",
      20,
      40
    );
    doc.text(
      "2. Admin ID: C8151T | Role: Checking Admin   | Password: 999789",
      20,
      50
    );
    doc.text(
      "3. Admin ID: R5221E | Role: Recommend Admin  | Password: 942516",
      20,
      60
    );

    // Navithanveli Section
    doc.text("Divisional Secretariat, Navithanveli", 20, 80);
    doc.text(
      "4. Admin ID: C6176S | Role: Checking Admin   | Password: 542994",
      20,
      90
    );
    doc.text(
      "5. Admin ID: R4769I | Role: Recommend Admin  | Password: 221931",
      20,
      100
    );
    doc.text(
      "6. Admin ID: A4798F | Role: Approve Admin    | Password: 998421",
      20,
      110
    );

    // Footer Note
    doc.setFontSize(10);
    doc.text(
      "* Passwords are stored securely in production using bcrypt.",
      20,
      130
    );

    doc.save("admin-accounts.pdf");
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
        <Title
          level={2}
          style={{
            color: "#fff",
            textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
            fontWeight: "bold",
            fontSize: "1.9rem",
          }}
        >
          District Secretariat Ampara
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

          <Button onClick={handleClick} type="default" size="large">
      About
    </Button>
        </Space>
      </Content>
    </Layout>
  );
};

export default HomePage;
