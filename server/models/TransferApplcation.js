const mongoose = require("mongoose");

const TransferApplcationSchema = new mongoose.Schema({
  transferWindowId: { type: String, required: true },
  preferWorkplace_1: { type: String, required: true },
  preferWorkplace_2: { type: String, required: true },
  preferWorkplace_3: { type: String, required: true },
  remarks: { type: String, required: true },
  isSubmited: { type: Boolean, default: false }, // isSubmited status
  isChecked: { type: Boolean, default: false }, // isChecked status
  isRecommended: { type: Boolean, default: false }, // isRecommended status
  isApproved: { type: Boolean, default: false }, // isApproved status
  Replacement: { type: Boolean, default: false }, // Replacement
});

module.exports = mongoose.model("TransferApplcation", TransferApplcationSchema);
