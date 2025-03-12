const mongoose = require("mongoose");

const UserMedicalConditionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Foreign key reference
    type: { type: String, required: true },
    notes: { type: String, required: true },

  },
  { timestamps: true }
);

module.exports = mongoose.model("UserMedicalCondition", UserMedicalConditionSchema);
