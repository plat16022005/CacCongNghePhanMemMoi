const mongoose = require("mongoose");

const surveyResponseSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey",
      required: true
    },
    residentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    answers: [
      {
        questionId: { type: Number, required: true },
        value: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

const SurveyResponse = mongoose.models.SurveyResponse || mongoose.model("SurveyResponse", surveyResponseSchema);
module.exports = SurveyResponse;
