const Notification = require("../models/notification");

class NotificationRepository {
  async findByResidentId(residentId) {
    return await Notification.find({
      $or: [{ residentId }, { residentId: null }]
    }).sort({ createdAt: -1 });
  }

  async countUnreadByResidentId(residentId) {
    return await Notification.countDocuments({
      $or: [{ residentId }, { residentId: null }],
      isRead: false
    });
  }

  async updateReadStatus(id, residentId) {
    return await Notification.findOneAndUpdate(
      { _id: id, $or: [{ residentId }, { residentId: null }] },
      { isRead: true },
      { new: true }
    );
  }

  async updateAllRead(residentId) {
    return await Notification.updateMany(
      { $or: [{ residentId }, { residentId: null }], isRead: false },
      { isRead: true }
    );
  }

  async create(data) {
    return await Notification.create(data);
  }
}

module.exports = new NotificationRepository();
