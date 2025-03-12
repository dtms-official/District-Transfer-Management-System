const { check, validationResult } = require("express-validator");
const UserDisease = require("../../models/UserDisease");

// Validation Rules
exports.validateDisease = [
  check("type").notEmpty().withMessage("type is required"),
  check("are_you_taking_treatment")
    .notEmpty()
    .withMessage("are you taking treatment is required"),
];

// Create Disease
exports.createDisease = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const disease = await UserDisease.create(req.body);
    res.status(201).json(disease);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All Diseases
exports.getAllDiseases = async (_req, res) => {
  try {
    const diseases = await UserDisease.find();
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get  Dependence using id
exports.getOneDisease = async (req, res) => {
  try {
    const disease = await UserDisease.findById(req.params.id); // Find by id passed in the request
    if (!disease) {
      return res.status(404).json({ error: "Disease not found" });
    }
    res.json(disease);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Get  All Dependence using userID
exports.getUserDiseases = async (req, res) => {
  try {
    const diseases = await UserDisease.find({ userId: req.params.userId }); // Find all by userId
    if (!diseases.length) {
      return res.status(404).json({ error: "No diseases" });
    }
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Update Disease
exports.updateDisease = async (req, res) => {
  try {
    const disease = await UserDisease.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!disease) {
      return res.status(404).json({ error: "Record Not Found" });
    }

    res.json({ message: "Update successful", data: disease });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete Disease
exports.deleteDisease = async (req, res) => {
  try {
    const deleted = await UserDisease.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
