const mongoose = require("mongoose");

const rentalApplicationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    members: [{
      name: String,
      phoneNumber: String,
      cccdNumber: String,
      dob: String,
      occupation: String,
      cccdFrontImage: String,
      cccdBackImage: String
    }],
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const RentalApplication = mongoose.models.RentalApplication || mongoose.model("RentalApplication", rentalApplicationSchema);

module.exports = RentalApplication;
