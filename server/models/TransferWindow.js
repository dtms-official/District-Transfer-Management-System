const mongoose = require("mongoose"); // ✅ Import mongoose

const TransferWindowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    closingDate: { type: Date, required: true },
    isTerminated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransferWindow", TransferWindowSchema);
