const mongoose = require("mongoose");

const guestAccessLogSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    qrCodeToken: {
      type: String,
      required: true,
      unique: true,
    },
    actualCheckIn: { type: Date }, // Giờ vào thực tế
    actualCheckOut: { type: Date }, // Giờ ra thực tế
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.GuestAccessLog ||
  mongoose.model("GuestAccessLog", guestAccessLogSchema);
