const { check, validationResult } = require("express-validator");
const UserDependence = require("../../models/UserDependence");

// Validation Rules
exports.validateDependence = [
  check("dependentName").notEmpty().withMessage("dependentName is required"),
  check("dependentRelationship")
    .notEmpty()
    .withMessage("dependentRelationship is required"),
  check("").notEmpty().withMessage("gender is required"),
  check("dependent_DOB").notEmpty().withMessage("dependent DOB is required"),
];

// Create Dependence
exports.createDependence = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  // Check if NIC already exists
  const existingDependentNIC = await UserDependence.findOne({
    dependentNIC: req.body.dependentNIC,
  });
  if (existingDependentNIC) {
    return res.status(400).json({ error: "Dependent NIC is already in use" });
  }
  try {
    const dependence = await UserDependence.create(req.body);
    res.status(201).json(dependence);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All Dependences
exports.getAllDependences = async (_req, res) => {
  try {
    const dependences = await UserDependence.find();
    res.json(dependences);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get  Dependence using id
exports.getOneDependence = async (req, res) => {
  try {
    const dependence = await UserDependence.findById(req.params.id); // Find by id passed in the request
    if (!dependence) {
      return res.status(404).json({ error: "Dependence not found" });
    }
    res.json(dependence);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

exports.getUserDependences = async (req, res) => {
  try {
    const dependences = await UserDependence.find({
      userId: req.params.userId,
    }); // Find all by userId
    if (!dependences.length) {
      return res.status(404).json({ error: "No dependences" });
    }
    res.json(dependences);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Update Dependence
exports.updateDependence = async (req, res) => {
  try {
    const dependence = await UserDependence.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!dependence) {
      return res.status(404).json({ error: "Record Not Found" });
    }

    res.json({ message: "Update successful", data: dependence });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete Dependence
exports.deleteDependence = async (req, res) => {
  try {
    const deleted = await UserDependence.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
