const mongoose = require("mongoose");

const UserDependenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"], // Custom message
    },
    dependentName: {
      type: String,
      required: [true, "Dependent name is required"], // Custom message
    },
    dependentRelationship: {
      type: String,
      required: [true, "Dependent relationship is required"], // Custom message
    },
    dependentNIC: {
      type: String,
      unique: true,
      sparse: true,
    },
    workplace: {
      type: String,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"], // Custom message
    },
    natureOfDependency: {
      type: String,
      required: [true, "Nature dependency is required"], // Custom message
    },

    dependent_DOB: {
      type: Date,
      required: [true, "Dependent Date of Birth is required"], // Custom message
    },
    school: {
      type: String,
    },
    city: {
      type: String,
    },
    postalcode: {
      type: String,
    },
    grade: {
      type: String,
    },
    disability_type: {
      type: String,
    },
    disease_type: {
      type: String,
    },
    Does_this_dependent_currently_undergo_any_treatment: {
      type: Boolean,
    },
    breastfeeding_required: {
      type: Boolean,
    },
    special_need_desc: {
      type: String,
    },
    live_with_dependant: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserDependence", UserDependenceSchema);
