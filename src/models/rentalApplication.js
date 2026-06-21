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
    tenantInfo: {
      name: String,
      occupation: String,
      dob: String,
      phoneNumber: String,
      gender: String,
      address: String,
      cccdFrontImage: String,
      cccdBackImage: String,
    },
    members: [
      {
        name: String,
        phoneNumber: String,
        dob: String,
        occupation: String,
        gender: String,
        address: String,
        cccdFrontImage: String,
        cccdBackImage: String,
      },
    ],
    rawSubmission: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
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

const RentalApplication = mongoose.models.RentalApplication || mongoose.model(
  "RentalApplication",
  rentalApplicationSchema,
  "rental_applications"
);

module.exports = RentalApplication;
