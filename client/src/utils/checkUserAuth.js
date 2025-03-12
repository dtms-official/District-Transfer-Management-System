import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { message } from "antd";

const useCheckUserAuth = () => {
  const [userData, setUserData] = useState(null);
  const [authloading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token.split(".").length !== 3 || token == null) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        message.error("Session expired, Please relogin!");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setUserData(decodedToken);
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }

    setLoading(false);
  }, [navigate]);

  return { userData, authloading };
};

export default useCheckUserAuth;
