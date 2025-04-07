const TransferApplication = require("../../models/TransferApplication");
// const Admin = require("../../models/Admin");
// const User = require("../../models/User");
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

    if (adminRole !== "superAdmin") {
      filter.workplace_id = workplace_id; // Apply workplace filter for non-superAdmins
    }

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
    })
      .populate("userId", "nameWithInitial designation duty_assumed_date")
      .exec();

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
    })
      .populate("userId", "nameWithInitial designation duty_assumed_date")
      .exec();

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
    })
      .populate("userId", "nameWithInitial designation duty_assumed_date")
      .exec();

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
    })
      .populate("userId", "nameWithInitial designation duty_assumed_date")
      .exec();

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
      isSubmited: true,
      isChecked: false,
      isRecommended: false,
      isRejected: true,
      isApproved: false,
      workplace_id: workplaceId, // Match Transfer Applcations' workplace_id with admin's
    })
      .populate("userId", "nameWithInitial designation duty_assumed_date")
      .exec();

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
  const { id } = req.params;

  try {
    const transferApplication = await TransferApplication.findById(id);
    if (!transferApplication) {
      return res.status(404).json({ error: "Transfer application not found" });
    }

    // Update the application status to approved
    transferApplication.isSubmited = true;
    transferApplication.isChecked = true;
    transferApplication.isRecommended = true; // Mark as recommended
    transferApplication.isApproved = true; // Mark as approved
    transferApplication.isRejected = false;
    transferApplication.rejectReason = null;

    // Save the updated document
    await transferApplication.save();

    res
      .status(200)
      .json({ message: "Transfer application approved successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res.status(500).json({
      error: "Cannot approve the transfer application right now. Try again.",
    });
  }
};

// check TransferApplcation TransferApplcation
const checkTransferApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const transferApplication = await TransferApplication.findById(id);
    if (!transferApplication) {
      return res.status(404).json({ error: "Transfer application not found" });
    }

    transferApplication.isSubmited = true;
    transferApplication.isChecked = true;
    transferApplication.isRecommended = false;
    transferApplication.isApproved = false;
    transferApplication.isRejected = false;
    transferApplication.rejectReason = null;

    await transferApplication.save();

    res
      .status(200)
      .json({ message: "Transfer application checked successfully" });
  } catch (error) {
    console.error("Check Error:", error.message);
    res.status(500).json({
      error: "Cannot check the transfer application right now. Try again.",
    });
  }
};

// Approve TransferApplcation
const recommendTransferApplication = async (req, res) => {
  const { id } = req.params; // Using 'id' instead of 'TransferApplcationId'

  try {
    const transferApplication = await TransferApplication.findById(id);
    if (!transferApplication) {
      return res.status(404).json({ error: "Transfer application not found" });
    }

    // Update the application status
    transferApplication.isSubmited = true;
    transferApplication.isChecked = true;
    transferApplication.isRecommended = true; // Mark as recommended
    transferApplication.isApproved = false;
    transferApplication.isRejected = false;
    transferApplication.rejectReason = null;

    // Save the updated document
    await transferApplication.save();

    res
      .status(200)
      .json({ message: "Transfer application recommended successfully" });
  } catch (error) {
    console.error("Recommendation Error:", error.message);
    res.status(500).json({
      error: "Cannot recommend the transfer application right now. Try again.",
    });
  }
};

const rejectTransferApplication = async (req, res) => {
  const { id } = req.params; // Using 'id' instead of 'TransferApplcationId'

  try {
    const transferApplication = await TransferApplication.findByIdAndUpdate(
      id, // Using 'id' here
      {
        isSubmited: true,
        isChecked: false,
        isRecommended: false,
        isApproved: false,
        isRejected: true,
      },
      { new: true }
    );
    if (!transferApplication)
      return res
        .status(404)
        .json({ message: "Transfer application not found" });

    res.status(200).json({
      message: "Transfer application rejected successfully",
      transferApplication,
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
