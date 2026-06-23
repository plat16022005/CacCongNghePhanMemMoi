const mongoose = require("mongoose");

const assetMaintenanceSchema = new mongoose.Schema(
  {
    assetName: { type: String, required: true }, // "Thang máy block A", "Máy phát điện"
    maintenanceType: { type: String, required: true }, // "Định kỳ tháng", "Sửa chữa đột xuất"
    plannedDate: { type: Date, required: true }, // Ngày lên lịch bảo trì
    actualDate: { type: Date }, // Ngày thực hiện thực tế
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Thợ kỹ thuật phụ trách
    result: { type: String, default: "" }, // "Đã tra dầu, vận hành tốt"
    status: {
      type: String,
      enum: ["scheduled", "completed", "skipped"],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.AssetMaintenance ||
  mongoose.model("AssetMaintenance", assetMaintenanceSchema);
