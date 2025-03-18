const mongoose = require("mongoose");

const UserDisabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Foreign key reference
    type: { type: String, required: true },
    level: { type: String, required: true },
    since_birth: { type: Boolean, required: true },
    how_many_years: { type: Number }, // Store the number of years if "No"
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDisability", UserDisabilitySchema);
