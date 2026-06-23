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
    images: [{ type: String }], // Ảnh đính kèm sự cố
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const MaintenanceRequest = mongoose.models.MaintenanceRequest || mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
module.exports = MaintenanceRequest;
