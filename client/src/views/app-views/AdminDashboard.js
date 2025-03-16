import React, { useEffect } from "react";
import { Layout, Spin, Typography } from "antd";
import ApprovalAdmin from "../../components/admin/ApprovalAdmin";
import CheckingAdmin from "../../components/admin/CheckingAdmin";
import RecommendAdmin from "../../components/admin/RecommendAdmin";
import useCheckAdminAuth from "../../utils/checkAdminAuth";
import SuperAdmin from "../../components/admin/SuperAdmin";
import getOneWorkplace from "../../api/getOneWorkplace";

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { adminData, loading: adminLoading } = useCheckAdminAuth();
  const {
    workplace,
    loading: workplaceLoading,
    fetchWorkplace,
  } = getOneWorkplace();

  const adminRole = adminData?.adminRole || null;
  const adminWorkplace = workplace || null;


  useEffect(() => {
    fetchWorkplace(); // Fetch workplaces when the component mounts
  }, [fetchWorkplace]);

  if (adminLoading | workplaceLoading)
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
    <Content
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <Title level={3} style={{ marginBottom: 10 }}>
        Welcome,{" "}
        {adminRole === "checkingAdmin"
          ? "Checking Admin"
          : adminRole === "recommendAdmin"
          ? "Recommend Admin"
          : adminRole === "approveAdmin"
          ? "Approve Admin"
          : "Super Admin"}
      </Title>
     
      <Text classNfame="text-sm px-4 py-1">
        {adminWorkplace && <strong>{adminWorkplace.workplace}</strong>}
      </Text>
      {adminRole === "approveAdmin" ? (
        <ApprovalAdmin />
      ) : adminRole === "recommendAdmin" ? (
        <RecommendAdmin />
      ) : adminRole === "superAdmin" ? (
        <SuperAdmin />
      ) : (
        <CheckingAdmin />
      )}
    </Content>
  );
};

export default AdminDashboard;
