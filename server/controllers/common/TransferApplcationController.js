const { check, validationResult } = require("express-validator");
const TransferApplcation = require("../../models/TransferApplcation");
const mongoose = require("mongoose"); // Import mongoose

// Validation Rules
exports.validateTransferApplcation = [
  check("transferWindowId")
    .notEmpty()
    .withMessage("Transfer window id is required"),
  check("preferWorkplace_1")
    .notEmpty()
    .withMessage("1st prefer workplace required"),
  check("preferWorkplace_2")
    .notEmpty()
    .withMessage("2nd prefer workplace is required"),
  check("preferWorkplace_3")
    .notEmpty()
    .withMessage("3rd prefer workplace is required"),
  check("remarks").notEmpty().withMessage("remarks is required"),
];

// Create TransferWindow
exports.createTransferApplcation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const transferApplcation = await TransferApplcation.create(req.body);
    res.status(201).json(transferApplcation);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All TransferApplcations
exports.getAllTransferApplcations = async (_req, res) => {
  try {
    const transferApplcations = await TransferApplcation.find();
    res.json(transferApplcations);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get TransferApplcation using _id
exports.getOneTransferApplcation = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid transfer applcation ID" });
  }

  try {
    const transferApplcation = await TransferApplcation.findById(id);

    if (!transferApplcation) {
      return res.status(404).json({ error: "Transfer applcation not found" });
    }

    res.json(transferApplcation);
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

exports.updateTransferApplcation = async (req, res) => {
  try {
    const transferApplcation = await TransferApplcation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!transferApplcation)
      return res.status(404).json({ error: "Record Not Found" });

    res.json({ message: "Update successful", data: transferApplcation });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};
