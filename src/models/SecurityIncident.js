// SecurityIncident.js
const mongoose = require("mongoose");

const securityIncidentSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Ai phát hiện (Bảo vệ/Cư dân)
    title: { type: String, required: true }, // Tiêu đề: "Hỏa hoạn nhỏ tại phòng rác tầng 5"
    description: { type: String, required: true }, // Mô tả chi tiết sự việc
    location: { type: String, required: true }, // Vị trí xảy ra sự cố
    images: [{ type: String }], // Ảnh chụp hiện trường làm bằng chứng
    status: {
      type: String,
      enum: ["reported", "investigating", "resolved"],
      default: "reported",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.SecurityIncident ||
  mongoose.model("SecurityIncident", securityIncidentSchema);
