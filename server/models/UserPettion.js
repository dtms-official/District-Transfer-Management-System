const mongoose = require("mongoose");

const UserPettionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
    year:    { type: Number },  
    type:    { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPettion", UserPettionSchema);
