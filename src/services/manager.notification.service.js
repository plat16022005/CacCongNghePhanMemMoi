const Notification = require("../models/notification");

class ManagerNotificationService {
  async getAnnouncements(query) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ type: "announcement" })
      .populate("residentId", "name")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
      
    const total = await Notification.countDocuments({ type: "announcement" });

    return {
      data: notifications,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async sendAnnouncement(data) {
    const { title, content, targetRole, targetApartments } = data;

    if (targetRole === "all" || targetRole === "resident") {
      // Gửi cho tất cả cư dân (residentId = null nghĩa là broadcast)
      return await Notification.create({
        residentId: null,
        title,
        content,
        type: "announcement"
      });
    } else if (targetRole === "specific" && targetApartments && targetApartments.length > 0) {
      // Logic gửi cho mảng user specific
      // Trong demo ta lưu 1 mảng. Vì model đang là residentId Object, có thể insertMany
      const notifs = targetApartments.map(resId => ({
        residentId: resId,
        title,
        content,
        type: "announcement"
      }));
      return await Notification.insertMany(notifs);
    }
  }

  async deleteAnnouncement(id) {
    return await Notification.findByIdAndDelete(id);
  }
}

module.exports = new ManagerNotificationService();
