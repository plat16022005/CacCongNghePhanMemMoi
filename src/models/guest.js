const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    guestName: { type: String, required: true },
    cccd: { type: String, required: true },
    phone: { type: String, required: true },
    visitDate: { type: Date, required: true },
    visitTime: { type: String, default: "00:00" },
    leaveDate: { type: Date, required: false },
    reason: { type: String, default: "" },
    purpose: { type: String, default: "" },
    numberOfGuests: { type: Number, default: 1 },
    checkinTime: { type: Date, default: null },
    checkoutTime: { type: Date, default: null },
    note: { type: String, default: "" },
    type: { type: String, enum: ["scheduled", "manual"], default: "scheduled" },
    qrUsed: { type: Boolean, default: false },
    apartmentNumber: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "arrived", "left", "checked_in", "checked_out"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Guest = mongoose.models.Guest || mongoose.model("Guest", guestSchema);
module.exports = Guest;
