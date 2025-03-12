const mongoose = require("mongoose");

const UserWorkHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Foreign key reference
    start_date: { type: Date, required: true }, // Use Date type for dates
    end_date: { type: Date, required: true },
    workplace: { type: String, required: true },
    nature_of_duty: { type: String, required: true },
    type_of_transfer: { type: String },
    transfer_order_issued_year: { type: String },
    mutual_officer_nic: { type: String },
    reason_for_transfer: { type: String },
    other_transfer_details: { type: String },
    workplace_type: { type: String, required: true },
    other_workplace_type: { type: String },
    workplace_city: { type: String, required: true },
    workplace_postalcode: { type: String }, // Fixed data type
    designation: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserWorkHistory", UserWorkHistorySchema);
