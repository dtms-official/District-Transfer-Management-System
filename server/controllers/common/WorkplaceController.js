const { check, validationResult } = require("express-validator");
const Workplace = require("../../models/Workplaces");
const mongoose = require("mongoose"); // Import mongoose

// Validation Rules
exports.validateWorkplace = [
  check("workplace").notEmpty().withMessage("workplace is required"),
  check("GPS_coordinates")
    .notEmpty()
    .withMessage("GPS_coordinates is required"),
];

// Create WorkPlace
exports.createWorkPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const workplace = await Workplace.create(req.body);
    res.status(201).json(workplace);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All WorkPlaces
exports.getAllWorkplaces = async (_req, res) => {
  try {
    const workplaces = await Workplace.find();
    res.json(workplaces);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get Workplace using _id
exports.getOneWorkplace = async (req, res) => {
  const { id } = req.params; // Extracting id from the URL params

  // Check if the provided id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid workplace ID" });
  }

  try {
    // Find the workplace by _id
    const workplace = await Workplace.findById(id);

    // Check if the workplace was found
    if (!workplace) {
      return res.status(404).json({ error: "Workplace not found" });
    }

    // Send the workplace data as response
    res.json(workplace);
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};
