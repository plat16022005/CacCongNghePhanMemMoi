const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
