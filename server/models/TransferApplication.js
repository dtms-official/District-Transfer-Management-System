const mongoose = require("mongoose");

const TransferApplcationSchema = new mongoose.Schema(
  {
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

    workplace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workplace",
      required: [true, "Workplace ID is required"],
    },

    remarks: { type: String },
    score: {
      totalScore: { type: String },
      dutyYears: { type: String },
      age: { type: String },
      outerDistrict: { type: String },
      residentDistance: { type: String },
      civilStatus: { type: String },
      gender: { type: String },
      petitionStatus: { type: String },
      dependency: {
        infant: { type: String },
        schoolChild: { type: String },
        breastfeeding: { type: String },
        specialNeed: { type: String },
        chronicDisease: { type: String },
        elderlyDependent: { type: String },
        disabledDependent: { type: String },
      },
      disease: { type: String },
      softWorkRecommendation: { type: String },
      medicalCondition: { type: String },
      disability: { type: String },
      disabilityLevel: { type: String },
    },
    transferDesision: { type: String },
    transferDesisionType: { type: String },
    transfered_workplace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workplace",
      default: null,
    },
    isSubmited: { type: Boolean, default: true }, // isSubmited status
    isChecked: { type: Boolean, default: false }, // isChecked status
    isRecommended: { type: Boolean, default: false }, // isRecommended status
    isApproved: { type: Boolean, default: false }, // isApproved status
    isRejected: { type: Boolean, default: false }, // isRejected status
    isProcessed: { type: Boolean, default: false }, // isProccessed status
    isPublished: { type: Boolean, default: false }, // isPublished status
    Replacement: { type: Boolean, default: false }, // Replacement
    Replacement_userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransferApplcation", TransferApplcationSchema);
