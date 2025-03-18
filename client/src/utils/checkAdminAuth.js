import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { message } from "antd";

const useCheckAdminAuth = () => {
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token || token.split(".").length !== 3) {
      localStorage.removeItem("adminToken");
      navigate("/admin_login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        message.error("Session expired. Please re-login");
        localStorage.removeItem("adminToken");
        navigate("/admin_login");
      } else {
        setAdminData(decodedToken);
      }
    } catch {
      localStorage.removeItem("adminToken");
      navigate("/admin_login");
    }

    setLoading(false);
  }, [navigate]);

  return { adminData, loading };
};

export default useCheckAdminAuth;
