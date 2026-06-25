const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    category: {
      type: String,
      enum: ["service", "security", "cleanliness", "staff", "maintenance", "amenity", "management", "other"],
      default: "other"
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "closed"],
      default: "pending"
    },
    response: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
