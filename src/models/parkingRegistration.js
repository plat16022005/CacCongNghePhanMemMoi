const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    vehicleType: {
      type: String,
      enum: ["motorcycle", "car", "bicycle"],
      required: true
    },
    licensePlate: { type: String, required: true },
    vehicleBrand: { type: String, required: true },
    vehicleColor: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    slotNumber: { type: String, default: "" }
  },
  {
    timestamps: true
  }
);

const ParkingRegistration = mongoose.models.ParkingRegistration || mongoose.model("ParkingRegistration", parkingSchema);
module.exports = ParkingRegistration;
