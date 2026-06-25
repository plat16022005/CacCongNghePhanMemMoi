const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const maintenanceScheduleSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["elevator", "generator", "water_pump", "fire_system", "common_area", "other"],
      required: true,
    },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true }, // "HH:mm"
    estimatedDuration: { type: Number, required: true }, // minutes
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recurrence: {
      type: String,
      enum: ["once", "weekly", "monthly", "quarterly", "annually"],
      default: "once",
    },
    status: {
      type: String,
      enum: ["scheduled", "done", "cancelled"],
      default: "scheduled",
    },
    completedAt: { type: Date },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceSchedule", maintenanceScheduleSchema);
