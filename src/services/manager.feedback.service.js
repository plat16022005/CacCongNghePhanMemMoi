const Feedback = require("../models/feedback");
const Notification = require("../models/notification");

class ManagerFeedbackService {
  async getFeedbacks(query) {
    const { status, category, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const feedbacks = await Feedback.find(filter)
      .populate("residentId", "name email phoneNumber")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
      
    const total = await Feedback.countDocuments(filter);

    return {
      data: feedbacks,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async getFeedbackById(id) {
    return await Feedback.findById(id).populate("residentId");
  }

  async respondFeedback(id, data) {
    const { response, status } = data;
    const feedback = await Feedback.findByIdAndUpdate(id, { response, status }, { new: true });
    
    // Tạo notification cho resident
    if (feedback) {
      await Notification.create({
        residentId: feedback.residentId,
        title: "Phản hồi góp ý của bạn",
        content: `Ban quản lý đã phản hồi góp ý "${feedback.title}": ${response}`,
        type: "general"
      });
    }

    return feedback;
  }

  async closeFeedback(id) {
    return await Feedback.findByIdAndUpdate(id, { status: "closed" }, { new: true });
  }
}

module.exports = new ManagerFeedbackService();
