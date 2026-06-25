const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null // null if broadcast to all
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["invoice_reminder", "maintenance_update", "announcement", "guest_approved", "survey", "general"],
      default: "general" 
    },
    isRead: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
module.exports = Notification;
