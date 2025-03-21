const mongoose = require("mongoose");

const UserleavedetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
    year: { type: Number, required: true  },  
    type: { type: String, required: true },
    no_of_days: { type: Number, required: true  }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserLeaveDetail", UserleavedetailsSchema);
