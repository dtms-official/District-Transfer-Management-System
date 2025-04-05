import axios from "axios";

// For Users
export const fetchPendingUsers = async (token, setPendingUsers, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/pending-users`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPendingUsers(response.data);
  } catch (error) {
    setMessage("❌ Error fetching pending users.");
  }
};

export const fetchCheckedUsers = async (token, setCheckedUsers, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/checked-users`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setCheckedUsers(response.data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "❌ Error fetching users.";
    setMessage(errorMessage);
  }
};

export const fetchRecommendedUsers = async (token, setRecommendedUsers, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/recommended-users`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setRecommendedUsers(response.data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "❌ Error fetching users.";
    setMessage(errorMessage);
  }
};


