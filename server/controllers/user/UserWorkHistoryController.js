const { check, validationResult } = require("express-validator");
const UserWorkHistory = require("../../models/UserWorkHistory");

// Validation Rules
exports.validateWorkHistory = [
  check("start_date").notEmpty().withMessage("Duty commenced date is required"),
  check("end_date").notEmpty().withMessage("Duty completed date is required"),
  check("start_date").optional().isISO8601().withMessage("Invalid date format"),
  check("end_date").optional().isISO8601().withMessage("Invalid date format"),
  check("workplace").notEmpty().withMessage("Workplace is required"),
  check("nature_of_duty").notEmpty().withMessage("Nature of duty type is required"),
  check("workplace_type").notEmpty().withMessage("Workplace type is required"),
  check("workplace_city").notEmpty().withMessage("Workplace city is required"),
  check("designation").notEmpty().withMessage("Designation is required"),
];

// Create WorkHistory
exports.createWorkHistory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const workhistory = await UserWorkHistory.create(req.body);
    res.status(201).json(workhistory);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All WorkHistorys
exports.getAllWorkHistories = async (_req, res) => {
  try {
    const workhistories = await UserWorkHistory.find();
    res.json(workhistories);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get  WorkHistory using userId
exports.getOneWorkHistory = async (req, res) => {
  try {
    const workhistory = await UserWorkHistory.findById(req.params.id); // Find by id passed in the request
    if (!workhistory) {
      return res.status(404).json({ error: "Work history not found" });
    }
    res.json(workhistory);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Get All User WorkHistorie using userId
exports.getUserWorkHistories = async (req, res) => {
  try {
    const workhistories = await UserWorkHistory.find({
      userId: req.params.userId,
    }); // Find all by userId
    if (!workhistories.length) {
      return res.status(404).json({ error: "No work histories" });
    }
    res.json(workhistories);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Update WorkHistory
exports.updateWorkHistory = async (req, res) => {
  try {
    const WorkHistory = await UserWorkHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!WorkHistory)
      return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Update successful", data: WorkHistory });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// Delete WorkHistory
exports.deleteWorkHistory = async (req, res) => {
  try {
    const deleted = await UserWorkHistory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
