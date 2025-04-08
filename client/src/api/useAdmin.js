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

// for applcaitions
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


export const fetchPendingApplications = async (token, setPendingApplications, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/pending-applications`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPendingApplications(response.data);
  } catch (error) {
    setMessage("❌ Error fetching pending Applications.");
  }
};

export const fetchCheckedApplications = async (token, setCheckedApplications, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/checked-applications`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setCheckedApplications(response.data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "❌ Error fetching applications.";
    setMessage(errorMessage);
  }
};

export const fetchRecommendedApplications = async (token, setRecommendedApplications, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/recommended-applications`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setRecommendedApplications(response.data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "❌ Error fetching applications.";
    setMessage(errorMessage);
  }
};
