const User = require("../../models/User");
const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");

// Get All  Users for all admins
const getTotalSubmitedUsers = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const { workplace_id, adminRole } = decodedToken; // Extract workplace_id & adminRole

    const filter =
      adminRole === "superAdmin"
        ? {
            isSubmited: true,
          }
        : {
            isSubmited: true,

            workplace_id,
          };

    const totalUsers = await User.find(filter);

    res.status(200).json(totalUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const workplaceId = decodedToken.workplace_id; // Get workplace_id from token

    const pendingUsers = await User.find({
      isSubmited: true,
      isChecked: false,
      isRecommended: false,
      isRejected: false,
      isApproved: false,
      workplace_id: workplaceId, // Match workplace_id
    });

    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({
      error: "Something went wrong. Please try again later",
      details: error,
    });
  }
};

const getCheckedUsers = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const workplaceId = decodedToken.workplace_id; // Get workplace_id from token

    const checkedusers = await User.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: false,
      isRejected: false,
      isApproved: false,
      workplace_id: workplaceId, // Match users' workplace_id with admin's
    });

    res.status(200).json(checkedusers);
  } catch (error) {
    console.error("Error fetching checked users:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

const getRecommendedUsers = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const workplaceId = decodedToken.workplace_id; // Get workplace_id from token

    const recommendedusers = await User.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: true,
      isRejected: false,
      isApproved: false,
      workplace_id: workplaceId, // Match users' workplace_id with admin's
    });

    res.status(200).json(recommendedusers);
  } catch (error) {
    console.error("Error fetching recommended users:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

// check User for checking admin
const checkUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isSubmited = true;
    user.isChecked = true; // check User
    user.isRecommended = false;
    user.isApproved = false;
    user.isRejected = false;
    user.rejectReason = null;
    await user.save();

    res.status(200).json({ message: "User checked successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res
      .status(500)
      .json({ error: "Cannot check the user right now. try again" });
  }
};

// Approve User for recommend admin
const recommendUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isSubmited = true;
    user.isChecked = true;
    user.isRecommended = true; // Recommended User
    user.isApproved = false;
    user.isRejected = false;
    user.rejectReason = null;
    await user.save();

    res.status(200).json({ message: "User recommended successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res
      .status(500)
      .json({ error: "Cannot recommend the user right now. try again" });
  }
};

// Approve User for approve admin
const approveUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isSubmited = true;
    user.isChecked = true;
    user.isRecommended = true;
    user.isApproved = true; // Approve user
    user.isRejected = false;
    user.rejectReason = null;
    user.progressValue += 15; // Add 15 progress value to the existing progressValue

    await user.save();

    res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res
      .status(500)
      .json({ error: "Cannot approve the user right now. try again" });
  }
};

// Reject User for all admins
const rejectUser = async (req, res) => {
  const { userId } = req.params;
  const { rejectReason } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isSubmited: false,
        isChecked: false,
        isRecommended: false,
        isApproved: false,
        isRejected: true,
        rejectReason,
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User rejected successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

// For super admin only
const getApprovedUsers = async (req, res) => {
  try {
    const approvedUsers = await User.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: true,
      isRejected: false,
      isApproved: true,
    });

    res.status(200).json(approvedUsers);
  } catch (error) {
    console.error("Error fetching approved users:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

const getRejectedUsers = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const workplaceId = decodedToken.workplace_id; // Get workplace_id from token

    const rejectedUsers = await User.find({
      isSubmited: false,
      isChecked: false,
      isRecommended: false,
      isRejected: true,
      isApproved: false,
      workplace_id: workplaceId, // Match users' workplace_id with admin's
    });

    res.status(200).json(rejectedUsers);
  } catch (error) {
    console.error("Error fetching rejected users:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

module.exports = {
  getTotalSubmitedUsers,
  getRejectedUsers,
  getPendingUsers,
  getCheckedUsers,
  getRecommendedUsers,
  getApprovedUsers,
  checkUser,
  recommendUser,
  approveUser,
  rejectUser,
};
