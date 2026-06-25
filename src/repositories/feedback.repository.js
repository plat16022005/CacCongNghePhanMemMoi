const Feedback = require("../models/feedback");

class FeedbackRepository {
  async create(data) {
    return await Feedback.create(data);
  }

  async findByResidentId(residentId) {
    return await Feedback.find({ residentId }).sort({ createdAt: -1 });
  }
}

module.exports = new FeedbackRepository();
