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
    leaveDate: { type: Date, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "arrived", "left"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Guest = mongoose.models.Guest || mongoose.model("Guest", guestSchema);
module.exports = Guest;
