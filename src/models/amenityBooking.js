const mongoose = require("mongoose");

const amenityBookingSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amenityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
      required: true
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // Format HH:mm
    endTime: { type: String, required: true },   // Format HH:mm
    numberOfPeople: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const AmenityBooking = mongoose.models.AmenityBooking || mongoose.model("AmenityBooking", amenityBookingSchema);
module.exports = AmenityBooking;
