const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const maintenanceHistorySchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "MaintenanceRequest",
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceHistory", maintenanceHistorySchema);
