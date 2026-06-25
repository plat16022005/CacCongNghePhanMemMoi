const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const incidentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    imageUrls: [
      {
        type: String,
      },
    ],
    involvedPeople: {
      type: String,
    },
    reportedBy: {
      type: String, // Tên bảo vệ hoặc ID
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);
