const mongoose = require("mongoose");

const TransferApplcationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  transferWindowId: { type: String, required: true },
  preferWorkplace_1: { type: String, required: true },
  preferWorkplace_2: { type: String, required: true },
  preferWorkplace_3: { type: String, required: true },
  remarks: { type: String },
  score: { type: String },
  isSubmited: { type: Boolean, default: true }, // isSubmited status
  isChecked: { type: Boolean, default: false }, // isChecked status
  isRecommended: { type: Boolean, default: false }, // isRecommended status
  isApproved: { type: Boolean, default: false }, // isApproved status
  Replacement: { type: Boolean, default: false }, // Replacement
  Replacement_userId: { type: String }, // Replacement
});

module.exports = mongoose.model("TransferApplcation", TransferApplcationSchema);
