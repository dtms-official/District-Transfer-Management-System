const { check, validationResult } = require("express-validator");
const Cadre = require("../../models/Cadre");

// Validation Rules
exports.validate = [
  check("service").notEmpty().withMessage("Service is required"),
  check("workplace_id").notEmpty().withMessage("Workplace id  is required"),
  check("approvedCadre").notEmpty().withMessage("Approved cadre is required"),
  check("existingCadre").notEmpty().withMessage("Existing cadre is required"),
];

// Create Cadre
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { service, workplace_id } = req.body;

    const exists = await Cadre.findOne({ service, workplace_id });
    if (exists)
      return res
        .status(400)
        .json({ error: "Service already exists for this workplace" });

    const cadre = await Cadre.create(req.body);
    res.status(201).json(cadre);
  } catch (err) {
    res.status(500).json({ error: "Creation failed", details: err.message });
  }
};

// Get All Cadres
exports.getAll = async (_req, res) => {
  try {
    const cadres = await Cadre.find();
    res.json(cadres);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

// Get  Dependence using id
exports.getUnique = async (req, res) => {
  try {
    const cadre = await Cadre.findById(req.params.id); // Find by id passed in the request
    if (!cadre) {
      return res.status(404).json({ error: "Cadre not found" });
    }
    res.json(cadre);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};

// Update Cadre
exports.update = async (req, res) => {
  try {
    const cadre = await Cadre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!cadre) {
      return res.status(404).json({ error: "Record Not Found" });
    }

    res.json({ message: "Update successful", data: cadre });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete Cadre
exports.delete = async (req, res) => {
  try {
    const deleted = await Cadre.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
