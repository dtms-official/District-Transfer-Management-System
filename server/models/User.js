const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nameWithInitial: { type: String, required: true },
    NIC: { type: String, required: true, unique: true }, // Unique NIC
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    workplace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workplace",
      required: true,
    }, // Foreign key reference
    email: { type: String, default: null, sparse: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },

    //Null fields: Users can still update their profile after registration is approved by the admin
    first_appointment_date: { type: Date },
    duty_assumed_date: { type: Date, default: null },
    designation: { type: String, default: null },
    service: { type: String, default: null },
    class: { type: String, default: null },
    city: { type: String, default: null },

    // Additionally added
    resident_type: { type: String, default: null },
    wop_number: { type: String, default: null },
    civil_status: { type: String, default: null },
    GPS_longitude: { type: String, default: null },
    GPS_latitude: { type: String, default: null },

    progressValue: { type: Number, default: 15 }, // isSubmited status
    isUpdated: { type: Boolean, default: false }, // isUpdated status
    isSubmited: { type: Boolean, default: false }, // isSubmited status
    isChecked: { type: Boolean, default: false }, // isChecked status
    isRecommended: { type: Boolean, default: false }, // isRecommended status
    isApproved: { type: Boolean, default: false }, // isApproved status
    isRejected: { type: Boolean, default: false }, // isRejected status
    rejectReason: { type: String, default: null },

    // new fields for the five collections
    isMedicalConditionSubmited: { type: Boolean, default: false },
    isWorkHistorySubmited: { type: Boolean, default: false },
    isLeaveDetailsSubmited: { type: Boolean, default: false },
    isPettionSubmited: { type: Boolean, default: false },
    isDependenceSubmited: { type: Boolean, default: false },
    isDisabilitySubmited: { type: Boolean, default: false },
    isDiseaseSubmited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
