const surveyRepo = require("../repositories/survey.repository");

class SurveyService {
  async getSurveys() {
    return await surveyRepo.findAllOpenSurveys();
  }

  async getSurveyById(id) {
    return await surveyRepo.findSurveyById(id);
  }

  async submitSurvey(surveyId, residentId, answers) {
    const survey = await surveyRepo.findSurveyById(surveyId);
    if (!survey || survey.status !== "open") {
      throw { status: 400, message: "Khảo sát không tồn tại hoặc đã đóng" };
    }

    const existing = await surveyRepo.findSurveyResponseByResidentAndSurvey(residentId, surveyId);
    if (existing) {
      throw { status: 400, message: "Bạn đã nộp bài khảo sát này rồi" };
    }

    return await surveyRepo.createSurveyResponse({
      surveyId,
      residentId,
      answers
    });
  }
}

module.exports = new SurveyService();
