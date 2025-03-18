const { check, validationResult } = require("express-validator");
const UserMedicalCondition = require("../../models/UserMedicalCondition");

// Validation Rules
exports.validateMedicalCondition = [
  check("type").notEmpty().withMessage("type is required"),
  check("notes").notEmpty().withMessage("notes is required"),
];

// Create MedicalCondition
exports.createMedicalCondition = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const medicalcondition = await UserMedicalCondition.create(req.body);
    res.status(201).json(medicalcondition);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All MedicalConditions
exports.getAllMedicalConditions = async (_req, res) => {
  try {
    const medicalconditions = await UserMedicalCondition.find();
    res.json(medicalconditions);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get  MedicalCondition using id
exports.getOneMedicalCondition = async (req, res) => {
  try {
    const medicalcondition = await UserMedicalCondition.findById(req.params.id); // Find by id passed in the request
    if (!medicalcondition) {
      return res.status(404).json({ error: "MedicalConditions not found" });
    }
    res.json(medicalcondition);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Get  All MedicalCondition using userID
exports.getUserMedicalConditions = async (req, res) => {
  try {
    const medicalconditions = await UserMedicalCondition.find({
      userId: req.params.userId,
    }); // Find all by userId
    if (!medicalconditions.length) {
      return res.status(404).json({ error: "No medical conditions" });
    }
    res.json(medicalconditions);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Update MedicalCondition
exports.updateMedicalCondition = async (req, res) => {
  try {
    const medicalcondition = await UserMedicalCondition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!medicalcondition) {
      return res.status(404).json({ error: "Record Not Found" });
    }

    res.json({ message: "Update successful", data: medicalcondition });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete MedicalCondition
exports.deleteMedicalCondition = async (req, res) => {
  try {
    const deleted = await UserMedicalCondition.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
