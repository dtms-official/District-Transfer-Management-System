import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { message } from "antd";

const Workplaces = () => {
  const [workplaces, setWorkplaces] = useState([]);

  const fetchWorkplaces = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/workplace`
      );
      setWorkplaces(response.data || []);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch workplaces"
      );
    }
  }, []);

  useEffect(() => {
    fetchWorkplaces();
  }, [fetchWorkplaces]);

  return { workplaces, fetchWorkplaces };
};

export default Workplaces;
