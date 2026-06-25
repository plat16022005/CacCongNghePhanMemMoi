const feedbackRepo = require("../repositories/feedback.repository");

class FeedbackService {
  async getFeedbacks(residentId) {
    return await feedbackRepo.findByResidentId(residentId);
  }

  async createFeedback(residentId, data) {
    return await feedbackRepo.create({ ...data, residentId });
  }
}

module.exports = new FeedbackService();
