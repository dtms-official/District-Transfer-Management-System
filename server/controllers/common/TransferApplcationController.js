const { check, validationResult } = require("express-validator");
const TransferApplication = require("../../models/TransferApplcation");
const TransferWindow = require("../../models/TransferWindow");
const Workplace = require("../../models/Workplace");
const mongoose = require("mongoose");

// Validation Rules
exports.validate = [
  check("transferWindowId")
    .notEmpty()
    .withMessage("transfer window id is required")
    .isMongoId()
    .withMessage("Invalid transfer window ID"),
  check("preferWorkplace_1")
    .notEmpty()
    .withMessage("prefer workplace 1 is required")
    .isMongoId()
    .withMessage("Invalid workplace id"),
  check("preferWorkplace_2")
    .notEmpty()
    .withMessage("prefer workplace 2 is required")
    .isMongoId()
    .withMessage("Invalid workplace id"),
  check("preferWorkplace_3")
    .notEmpty()
    .withMessage("prefer workplace 3 is required")
    .isMongoId()
    .withMessage("Invalid workplace id"),
];

// Create TransferApplcation
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { transferWindowId, preferWorkplace_1, preferWorkplace_2, preferWorkplace_3 } = req.body;

    // Check if transferWindowId exists in the TransferWindow collection
    const transferWindowExists = await TransferWindow.findById(transferWindowId);
    if (!transferWindowExists) {
      return res.status(400).json({ error: "No transfer window found for the provided ID" });
    }

    const workplaceIds = [preferWorkplace_1, preferWorkplace_2, preferWorkplace_3];
    const uniqueWorkplaceIds = new Set(workplaceIds);

    if (uniqueWorkplaceIds.size !== workplaceIds.length) {
      return res.status(400).json({ error: "Preferred workplace ID(s) must be unique" });
    }

    const workplaces = await Workplace.find({ _id: { $in: workplaceIds } });

    if (workplaces.length !== 3) {
      return res.status(400).json({ error: "No workplaces found for the provided ID(s)" });
    }

    const data = await TransferApplication.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong. Please try again later",
      details: err.message,
    });
  }
};

// Get All transferApplicaitons
exports.getAll = async (_req, res) => {
  try {
    const data = await TransferApplication.find();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Unable to fetch data. Please try again later" });
  }
};

// Get  Dependence using id
exports.getUnique = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res
      .status(400)
      .json({ error: "Invalid request. Please check your ID" });

  try {
    const data = await TransferApplication.findById(req.params.id);
    if (!data) return res.status(404).json({ error: "No record found" });

    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Unable to fetch the data. Please try again later" });
  }
};

// Get  All Dependence using userID
exports.getDataByUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId))
      return res.status(400).json({ error: "Invalid ID format" });

    const data = await TransferApplication.find({ userId: req.params.userId });
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "You haven’t submitted any applications yet" });
    }
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Unable to fetch data. Please try again later" });
  }
};

// Update transferApplicaiton
exports.update = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ error: "Invalid ID format" });

  if (!req.body || Object.keys(req.body).length === 0)
    return res.status(400).json({ error: "Update data cannot be empty" });

  try {
    const data = await TransferApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!data)
      return res.status(404).json({ error: "No record found to update" });

    res.json({ message: "Updated successfully", data });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete transferApplicaiton
exports.delete = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res
      .status(400)
      .json({ error: "Invalid request. Please check your ID" });

  try {
    const data = await TransferApplication.findByIdAndDelete(req.params.id);
    if (!data)
      return res.status(404).json({ error: "No record found to delete" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Deletion failed. Please try again later" });
  }
};
