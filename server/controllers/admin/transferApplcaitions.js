const TransferApplcation = require("../../models/TransferApplcation");
const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");

// Get All  TransferApplcations
const getTotalSubmitedTransferApplcations = async (req, res) => {
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

    const pendingTransferApplcations = await TransferApplcation.find(filter);

    res.status(200).json(pendingTransferApplcations);
  } catch (error) {
    console.error(
      "Error fetching pending transfer applcations:",
      error.message
    );
    res.status(500).json({error: "Something went wrong. Please try again later",
 });
  }
};

const getRejectedTransferApplcations = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    const adminWorkplace = admin ? admin.workplace_id : null;

    if (!adminWorkplace) {
      return res.status(400).json({ error: "Admin workplace not found" });
    }

    const rejectedTransferApplcations = await TransferApplcation.find({
      isSubmited: false,
      isChecked: false,
      isRecommended: false,
      isRejected: true,
      isApproved: false,
      workplace_id: adminWorkplace, // Match Transfer Applcations' workplace_id with admin's
    });

    res.status(200).json(rejectedTransferApplcations);
  } catch (error) {
    console.error(
      "Error fetching rejected transfer applcations:",
      error.message
    );
    res.status(500).json({error: "Something went wrong. Please try again later",
 });
  }
};

const getCheckedTransferApplcations = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    const adminWorkplace = admin ? admin.workplace_id : null;

    if (!adminWorkplace) {
      return res.status(400).json({ error: "Admin workplace not found" });
    }

    const checkedTransferApplcations = await TransferApplcation.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: false,
      isRejected: false,
      isApproved: false,
      workplace_id: adminWorkplace, // Match TransferApplcations' workplace_id with admin's
    });

    res.status(200).json(checkedTransferApplcations);
  } catch (error) {
    console.error(
      "Error fetching checked transfer applcations:",
      error.message
    );
    res.status(500).json({error: "Something went wrong. Please try again later",
 });
  }
};

const getRecommendedTransferApplcations = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    const adminWorkplace = admin ? admin.workplace_id : null;

    if (!adminWorkplace) {
      return res.status(400).json({ error: "Admin workplace not found" });
    }

    const recommendedTransferApplcations = await TransferApplcation.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: true,
      isRejected: false,
      isApproved: false,
      workplace_id: adminWorkplace, // Match TransferApplcations' workplace_id with admin's
    });

    res.status(200).json(recommendedTransferApplcations);
  } catch (error) {
    console.error(
      "Error fetching recommended transfer applcations:",
      error.message
    );
    res.status(500).json({error: "Something went wrong. Please try again later",
 });
  }
};

const getApprovedTransferApplcations = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    const adminWorkplace = admin ? admin.workplace_id : null;

    if (!adminWorkplace) {
      return res.status(400).json({ error: "Admin workplace not found" });
    }

    const approvedTransferApplcations = await TransferApplcation.find({
      isSubmited: true,
      isChecked: true,
      isRecommended: true,
      isRejected: false,
      isApproved: true,
      workplace_id: adminWorkplace, // Match TransferApplcations' workplace_id with admin's
    });

    res.status(200).json(approvedTransferApplcations);
  } catch (error) {
    console.error(
      "Error fetching approved transfer applcations:",
      error.message
    );
    res.status(500).json({error: "Something went wrong. Please try again later",
 });
  }
};

// check TransferApplcation TransferApplcation
const checkTransferApplcation = async (req, res) => {
  const { TransferApplcationId } = req.params;

  try {
    const TransferApplcation = await TransferApplcation.findById(
      TransferApplcationId
    );
    if (!TransferApplcation) {
      return res.status(404).json({ error: "Transfer applcation not found" });
    }

    TransferApplcation.isSubmited = true;
    TransferApplcation.isChecked = true; // check TransferApplcation
    TransferApplcation.isRecommended = false;
    TransferApplcation.isApproved = false;
    TransferApplcation.isRejected = false;
    TransferApplcation.rejectReason = null;
    await TransferApplcation.save();

    res
      .status(200)
      .json({ message: "Transfer applcation checked successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res
      .status(500)
      .json({
        error: "Cannot check the transfer applcation right now. try again",
      });
  }
};

// Approve TransferApplcation
const recommendTransferApplcation = async (req, res) => {
  const { TransferApplcationId } = req.params;

  try {
    const transferApplcation = await TransferApplcation.findById(
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
    await TransferApplcation.save();

    res
      .status(200)
      .json({ message: "Transfer applcation recommended successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res
      .status(500)
      .json({
        error: "Cannot recommend the Transfer applcation right now. try again",
      });
  }
};

// Approve TransferApplcation
const approveTransferApplcation = async (req, res) => {
  const { TransferApplcationId } = req.params;

  try {
    const transferApplcation = await TransferApplcation.findById(
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

    await TransferApplcation.save();

    res
      .status(200)
      .json({ message: "Transfer applcation approved successfully" });
  } catch (error) {
    console.error("Approval Error:", error.message);
    res
      .status(500)
      .json({
        error: "Cannot approve the transfer applcation right now. try again",
      });
  }
};

// Reject TransferApplcation (Delete TransferApplcation)
const rejectTransferApplcation = async (req, res) => {
  const { TransferApplcationId } = req.params;
  const { rejectReason } = req.body;

  try {
    const transferApplcation = await TransferApplcation.findByIdAndUpdate(
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

    res
      .status(200)
      .json({
        message: "Transfer applcation rejected successfully",
        TransferApplcation,
      });
  } catch (error) {
    res.status(500).json({error: "Something went wrong. Please try again later",
 });
  }
};

module.exports = {
  getTotalSubmitedTransferApplcations,
  getRejectedTransferApplcations,
  getCheckedTransferApplcations,
  getRecommendedTransferApplcations,
  getApprovedTransferApplcations,
  checkTransferApplcation,
  recommendTransferApplcation,
  approveTransferApplcation,
  rejectTransferApplcation,
};
