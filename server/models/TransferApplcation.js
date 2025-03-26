const mongoose = require("mongoose");

const TransferApplcationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  transferWindowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TransferWindow",
    required: [true, "Transfer window ID is required"],
  },
  preferWorkplace_1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workplace",
    required: [true, "Workplace ID is required"],
  },
  preferWorkplace_2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workplace",
    required: [true, "Workplace ID is required"],
  },
  preferWorkplace_3: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workplace",
    required: [true, "Workplace ID is required"],
  },
  remarks: { type: String },
  score: { type: String },
  transferDesision: { type: String },
  isSubmited: { type: Boolean, default: true }, // isSubmited status
  isChecked: { type: Boolean, default: false }, // isChecked status
  isRecommended: { type: Boolean, default: false }, // isRecommended status
  isApproved: { type: Boolean, default: false }, // isApproved status
  notApproved: { type: Boolean, default: false }, // isRejected status
  isProccessed: { type: Boolean, default: false }, // isProccessed status
  Replacement: { type: Boolean, default: false }, // Replacement
  Replacement_userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

module.exports = mongoose.model("TransferApplcation", TransferApplcationSchema);
