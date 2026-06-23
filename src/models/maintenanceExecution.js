const mongoose = require("mongoose");

const maintenanceExecutionSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceRequest",
      required: true,
      unique: true, // Mỗi đơn yêu cầu chỉ có 1 tiến trình xử lý
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledDate: { type: Date }, // Ngày hẹn sửa chữa
    cost: { type: Number, default: 0 }, // Chi phí linh kiện/vật tư
    technicalNotes: { type: String, default: "" },
    imagesBefore: [{ type: String }],
    imagesAfter: [{ type: String }],
    executionStatus: {
      type: String,
      enum: ["assigned", "fixing", "done", "failed"],
      default: "assigned",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.MaintenanceExecution ||
  mongoose.model("MaintenanceExecution", maintenanceExecutionSchema);
