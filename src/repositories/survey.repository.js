const Survey = require("../models/survey");
const SurveyResponse = require("../models/surveyResponse");

class SurveyRepository {
  async findAllOpenSurveys() {
    return await Survey.find({ status: "open" }).sort({ createdAt: -1 });
  }

  async findSurveyById(id) {
    return await Survey.findById(id);
  }

  async createSurveyResponse(data) {
    return await SurveyResponse.create(data);
  }

  async findSurveyResponseByResidentAndSurvey(residentId, surveyId) {
    return await SurveyResponse.findOne({ residentId, surveyId });
  }
}

module.exports = new SurveyRepository();
