const mongoose = require("mongoose");

const CadreSchema = new mongoose.Schema({
  service: { type: String, required: true },
  approvedCadre: { type: String, required: true },
  existingCadre: { type: String, required: true },
});

module.exports = mongoose.model("Cadre", CadreSchema);
