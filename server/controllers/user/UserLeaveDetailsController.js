const { check, validationResult } = require("express-validator");
const UserLeaveDetail = require("../../models/UserLeave");

// Validation Rules
exports.validateLeaveDetail = [
  check("year").notEmpty().withMessage("year is required"),
  check("type")
    .notEmpty()
    .withMessage("are you taking leave is required"),
    check("no_of_days").notEmpty().withMessage("days is required"),
];

// Create leaves
exports.createLeaveDetail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const leavedetail = await UserLeaveDetail.create(req.body);
    res.status(201).json(leavedetail);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All leaves
exports.getAllLeaveDetails = async (_req, res) => {
  try {
    const leavedetails = await UserLeaveDetail.find();
    res.json(leavedetails);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get  leave using id
exports.getOneLeaveDetail = async (req, res) => {
  try {
    const leavedetail = await UserLeaveDetail.findById(req.params.id); // Find by id passed in the request
    if (!leavedetail) {
      return res.status(404).json({ error: "leave not found" });
    }
    res.json(leavedetail);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Get  All leave using userID
exports.getUserLeaveDetails = async (req, res) => {
  try {
    const leavedetails = await UserLeaveDetail.find({ userId: req.params.userId }); // Find all by userId
    if (!leavedetails.length) {
      return res.status(404).json({ error: "No leave details" });
    }
    res.json(leavedetails);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Update leave
exports.updateLeaveDetail = async (req, res) => {
  try {
    const leavedetail = await UserLeaveDetail.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!leavedetail) {
      return res.status(404).json({ error: "Record Not Found" });
    }

    res.json({ message: "Update successful", data: leavedetail});
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete leave
exports.deleteLeaveDetail = async (req, res) => {
  try {
    const deleted = await UserLeaveDetail.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
