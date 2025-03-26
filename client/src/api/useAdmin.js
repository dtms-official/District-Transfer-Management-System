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




// For Transfer Applications
export const fetchPendingTransferApplications = async (token, setPendingTransferApplications, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/pending-transfer-application`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPendingTransferApplications(response.data);
  } catch (error) {
    setMessage("❌ Error fetching total transfer applications.");
  }
};

export const fetchRejectedTransferApplications = async (token, setRejectedTransferApplications, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/rejected-transfer-application`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRejectedTransferApplications(response.data);
  } catch (error) {
    setMessage("❌ Error fetching rejected transfer applications.");
  }
};

export const fetchCheckedTransferApplications = async (token, setCheckedTransferApplications, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/checked-transfer-application`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCheckedTransferApplications(response.data);
  } catch (error) {
    setMessage("❌ Error fetching checked transfer applications.");
  }
};

export const fetchRecommendedTransferApplications = async (token, setRecommendedTransferApplications, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/recommended-transfer-application`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRecommendedTransferApplications(response.data);
  } catch (error) {
    setMessage("❌ Error fetching recommended transfer applications.");
  }
};

export const fetchApprovedTransferApplications = async (token, setApprovedTransferApplications, setMessage) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/admin/approved-transfer-application`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setApprovedTransferApplications(response.data);
  } catch (error) {
    setMessage("❌ Error fetching approved transfer applications.");
  }
};
