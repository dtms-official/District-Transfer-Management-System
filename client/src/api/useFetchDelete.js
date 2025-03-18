import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { message } from "antd";

const useFetchDelete = (fetchEndpoint, deleteEndpoint) => {
  const [data, setData] = useState([]);
  const [fetchDeleteloading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/${fetchEndpoint}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data || []);
    } catch (error) {
      console.log(error.response?.data?.error || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [fetchEndpoint]); // Add fetchEndpoint as a dependency

  // Deleting data by ID
  const deleteData = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/${deleteEndpoint}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData((prev) => prev.filter((item) => item._id !== id)); // Remove deleted item from the state
      message.success("Deleted successfully");
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to delete data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Add fetchData to the dependency array

  return { data, fetchDeleteloading, fetchData, deleteData };
};

export default useFetchDelete;
