const mongoose = require("mongoose");

const UserDiseaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Foreign key reference
    type: { type: String, required: true }, // Use Date type for dates
    are_you_taking_treatment: { type: Boolean, required: true },
    treatment_date: { type: Date }, // Store date if "Yes"
    soft_work_recommendation: { type: Boolean, required: true },
    soft_work_period: { type: Number }, // Use Date type for dates

  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDisease", UserDiseaseSchema);
