const mongoose = require("mongoose");

const CadreSchema = new mongoose.Schema({
  service: { type: String, required: true },
  workplace_id: { type: String, required: true },
  approvedCadre: { type: String, required: true },
  existingCadre: { type: String, required: true },
},
{ timestamps: true }
);
module.exports = mongoose.model("Cadre", CadreSchema);
