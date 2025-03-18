const { check, validationResult } = require("express-validator");
const TransferWindow = require("../models/TransferWindow");
const mongoose = require("mongoose"); // Import mongoose

// Validation Rules
exports.validateTransferWindow = [
  check("name").notEmpty().withMessage("window name is required"),
  check("closingDate").notEmpty().withMessage("closing date is required"),
];

// Create TransferWindow
exports.createTransferWindow = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const transferWindow = await TransferWindow.create(req.body);
    res.status(201).json(transferWindow);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All TransferWindows
exports.getAllTransferWindows = async (_req, res) => {
  try {
    const transferWindows = await TransferWindow.find();
    res.json(transferWindows);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get TransferWindow using _id
exports.getOneTransferWindow = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid transfer window ID" });
  }

  try {
    const transferWindow = await TransferWindow.findById(id);

    if (!transferWindow) {
      return res.status(404).json({ error: "TransferWindow not found" });
    }

    res.json(transferWindow);
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

exports.updateTransferWindow = async (req, res) => {
  try {
    const transferWindow = await TransferWindow.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!transferWindow)
      return res.status(404).json({ error: "Record Not Found" });

    res.json({ message: "Update successful", data: transferWindow });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};
