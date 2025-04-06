const TransferApplication = require("../../models/TransferApplcation");
const Admin = require("../../models/Admin");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

// Get All  TransferApplcations
const getTotalSubmitedTransferApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { workplace_id, adminRole } = decodedToken;

    let filter = { isSubmited: true };

    // if (adminRole !== "superAdmin") {
    //   filter.workplace_id = workplace_id; // Apply workplace filter for non-superAdmins
    // }

    const totalTransferApplications = await TransferApplication.find(filter)
      .populate("userId", "nameWithInitial designation duty_assumed_date")
      .exec();

    res.status(200).json(totalTransferApplications);
  } catch (error) {
    console.error("Error fetching total transfer applications:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

const getPendingTransferApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const workplaceId = decodedToken.workplace_id; // Get workplace_id from token

    const pendingApplications = await TransferApplication.find({
      isSubmited: true,
      isChecked: false,
      isRecommended: false,
      isApproved: false,
      isRejected: false,
      workplace_id: workplaceId,
    });

    res.status(200).json(pendingApplications);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error });
  }
};

const getCheckedTransferApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const workplaceId = decodedToken.workplace_id; // Get workplace_id from token

    const checkedTransferApplcations = await TransferApplication.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: false,
      isRejected: false,
      isApproved: false,
      workplace_id: workplaceId,
    });

    res.status(200).json(checkedTransferApplcations);
  } catch (error) {
    console.error(
      "Error fetching checked transfer applcations:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

const getRecommendedTransferApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const workplaceId = decodedToken.workplace_id; // Get workplace_id from token

    const recommendedTransferApplcations = await TransferApplication.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: true,
      isRejected: false,
      isApproved: false,
      workplace_id: workplaceId, // Match TransferApplcations' workplace_id with admin's
    });

    res.status(200).json(recommendedTransferApplcations);
  } catch (error) {
    console.error(
      "Error fetching recommended transfer applcations:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

const getApprovedTransferApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const workplaceId = decodedToken.workplace_id; // Get workplace_id from token

    const approvedTransferApplcations = await TransferApplication.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: true,
      isRejected: false,
      isApproved: true,
      workplace_id: workplaceId, // Match TransferApplcations' workplace_id with admin's
    });

    res.status(200).json(approvedTransferApplcations);
  } catch (error) {
    console.error(
      "Error fetching approved transfer applcations:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

// For super admin only
const getRejectedTransferApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const workplaceId = decodedToken.workplace_id; // Get workplace_id from token

    const rejectedTransferApplcations = await TransferApplication.find({
      isSubmited: false,
      isChecked: false,
      isRecommended: false,
      isRejected: true,
      isApproved: false,
      workplace_id: workplaceId, // Match Transfer Applcations' workplace_id with admin's
    });

    res.status(200).json(rejectedTransferApplcations);
  } catch (error) {
    console.error(
      "Error fetching rejected transfer applcations:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

// For super admin only
const approveTransferApplication = async (req, res) => {
  const { TransferApplcationId } = req.params;

  try {
    const transferApplcation = await TransferApplication.findById(
      TransferApplcationId
    );
    if (!transferApplcation) {
      return res.status(404).json({ error: "Transfer applcation not found" });
    }

    transferApplcation.isSubmited = true;
    transferApplcation.isChecked = true;
    transferApplcation.isRecommended = true;
    transferApplcation.isApproved = true; // Approve TransferApplcation
    transferApplcation.isRejected = false;
    transferApplcation.rejectReason = null;

    await TransferApplication.save();

    res
      .status(200)
      .json({ message: "Transfer applcation approved successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res.status(500).json({
      error: "Cannot approve the transfer applcation right now. try again",
    });
  }
};

// check TransferApplcation TransferApplcation
const checkTransferApplication = async (req, res) => {
  const { TransferApplcationId } = req.params;

  try {
    const transferApplcation = await TransferApplication.findById(
      TransferApplcationId
    );
    if (!transferApplcation) {
      return res.status(404).json({ error: "Transfer applcation not found" });
    }

    transferApplcation.isSubmited = true;
    transferApplcation.isChecked = true; // check TransferApplcation
    transferApplcation.isRecommended = false;
    transferApplcation.isApproved = false;
    transferApplcation.isRejected = false;
    transferApplcation.rejectReason = null;
    await TransferApplcation.save();

    res
      .status(200)
      .json({ message: "Transfer applcation checked successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res.status(500).json({
      error: "Cannot check the transfer applcation right now. try again",
    });
  }
};

// Approve TransferApplcation
const recommendTransferApplication = async (req, res) => {
  const { TransferApplcationId } = req.params;

  try {
    const transferApplcation = await TransferApplication.findById(
      TransferApplcationId
    );
    if (!transferApplcation) {
      return res.status(404).json({ error: "Transfer applcation not found" });
    }

    transferApplcation.isSubmited = true;
    transferApplcation.isChecked = true;
    transferApplcation.isRecommended = true; // Recommended TransferApplcation
    transferApplcation.isApproved = false;
    transferApplcation.isRejected = false;
    transferApplcation.rejectReason = null;
    await TransferApplication.save();

    res
      .status(200)
      .json({ message: "Transfer applcation recommended successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res.status(500).json({
      error: "Cannot recommend the transfer applcation right now. try again",
    });
  }
};

// Reject TransferApplcation (Delete TransferApplcation)
const rejectTransferApplication = async (req, res) => {
  const { TransferApplcationId } = req.params;
  const { rejectReason } = req.body;

  try {
    const transferApplcation = await TransferApplication.findByIdAndUpdate(
      TransferApplcationId,
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
    if (!transferApplcation)
      return res.status(404).json({ message: "Transfer applcation not found" });

    res.status(200).json({
      message: "Transfer applcation rejected successfully",
      transferApplcation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
};

module.exports = {
  getTotalSubmitedTransferApplications,
  getPendingTransferApplications,
  getRejectedTransferApplications,
  getCheckedTransferApplications,
  getRecommendedTransferApplications,
  getApprovedTransferApplications,
  checkTransferApplication,
  recommendTransferApplication,
  approveTransferApplication,
  rejectTransferApplication,
};
