const mongoose = require("mongoose"); // ✅ Import mongoose

const WorkplaceSchema = new mongoose.Schema(
  {
    workplace: { type: String, required: true },
    GPS_longitude: { type: String, default: null },
    GPS_latitude: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workplace", WorkplaceSchema);
