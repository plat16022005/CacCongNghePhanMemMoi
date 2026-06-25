const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    questions: [
      {
        questionId: { type: Number, required: true },
        content: { type: String, required: true },
        type: { type: String, enum: ["text", "rating", "multiple_choice"], default: "text" },
        options: { type: [String], default: [] }
      }
    ],
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

const Survey = mongoose.models.Survey || mongoose.model("Survey", surveySchema);
module.exports = Survey;
