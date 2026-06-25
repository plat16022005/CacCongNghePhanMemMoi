const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["plumbing", "electrical", "elevator", "common_area", "other"],
      default: "other"
    },
    urgency: {
      type: String,
      enum: ["low", "normal", "high", "emergency"],
      default: "normal"
    },
    imageUrls: { type: [String], default: [] },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    completionNote: { type: String },
    materialsUsed: [{
      name: String,
      quantity: Number,
      cost: Number
    }],
    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "waiting_parts", "completed", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const MaintenanceRequest = mongoose.models.MaintenanceRequest || mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
module.exports = MaintenanceRequest;
