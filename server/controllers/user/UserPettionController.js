const { check, validationResult } = require("express-validator");
const UserPettion = require("../../models/UserPettion");

// Validation Rules
exports.validatePettion = [
  check("year").notEmpty().withMessage("year is required"),
  check("type")
    .notEmpty()
    .withMessage("type is required"),
    check("details").notEmpty().withMessage(" is required"),
];

// Create Pettion
exports.createPettion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const pettiondetail = await UserPettion.create(req.body);
    res.status(201).json(pettiondetail);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All Pettion
exports.getAllPettion = async (_req, res) => {
  try {
    const pettiondetails  = await UserPettion.find();
    res.json(pettiondetails);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get  Pettion using id
exports.getOnePettion = async (req, res) => {
  try {
    const pettiondetail = await UserPettion.findById(req.params.id); // Find by id passed in the request
    if (!pettiondetail) {
      return res.status(404).json({ error: "Pettion not found" });
    }
    res.json(pettiondetail);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Get  All Pettion using userID
exports.getUserPettion = async (req, res) => {
  try {
    const pettiondetails = await UserPettion.find({ userId: req.params.userId }); // Find all by userId
    if (!pettiondetails.length) {
      return res.status(404).json({ error: "No Pettions" });
    }
    res.json(pettiondetails);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Update Pettion
exports.updatePettion = async (req, res) => {
  try {
    const pettiondetail = await UserPettion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vpettiondetail) {
      return res.status(404).json({ error: "Record Not Found" });
    }

    res.json({ message: "Update successful", data: pettiondetail});
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete Pettion
exports.deletePettion = async (req, res) => {
  try {
    const deleted = await UserPettion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
