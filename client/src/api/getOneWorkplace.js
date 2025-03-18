import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { message } from "antd";
import useCheckAdminAuth from "../utils/checkAdminAuth"; // ✅ Import at top level

const Workplace = () => {
  const [workplace, setWorkplace] = useState(null);
  const { adminData } = useCheckAdminAuth(); // ✅ Hook at top level
  const [loading, setLoading] = useState(null);
  
  const workplaceId = adminData.workplace_id || null;

  const fetchWorkplace = useCallback(async () => {
    if (!workplaceId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/workplace/${workplaceId}`);
      setWorkplace(response.data);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch workplace"
      );
      console.error("Error fetching workplace:", error);
    } finally {
      setLoading(false);
    }
  }, [workplaceId]); // ✅ Depend on workplaceId


  useEffect(() => { fetchWorkplace(); }, [fetchWorkplace]);

  return { workplace, loading, fetchWorkplace };
};

export default Workplace;
