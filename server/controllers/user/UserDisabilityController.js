const { check, validationResult } = require("express-validator");
const UserDisability = require("../../models/UserDisability");

exports.validateDisability = [
  check("type").notEmpty().withMessage("type is required"),
  check("level").notEmpty().withMessage("level is required"),
];

// Create Disability
exports.createDisability = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const disability = await UserDisability.create(req.body);
    res.status(201).json(disability);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All Disability
exports.getAllDisabilities = async (_req, res) => {
  try {
    const disabilities = await UserDisability.find();
    res.json(disabilities);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get  Disability using id
exports.getOneDisability = async (req, res) => {
  try {
    const disability = await UserDisability.findById(req.params.id); // Find by id passed in the request
    if (!disability) {
      return res.status(404).json({ error: "Disability not found" });
    }
    res.json(disability);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

exports.getUserDisabilities = async (req, res) => {
  try {
    const disabilities = await UserDisability.find({
      userId: req.params.userId,
    }); // Find all by userId
    if (!disabilities.length) {
      return res.status(404).json({ error: "No disabilities" });
    }
    res.json(disabilities);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Update Disability
exports.updateDisability = async (req, res) => {
  try {
    const disability = await UserDisability.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!disability) {
      return res.status(404).json({ error: "Record Not Found" });
    }

    res.json({ message: "Update successful", data: disability });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete Disability
exports.deleteDisability = async (req, res) => {
  try {
    const deleted = await UserDisability.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
