const notificationRepo = require("../repositories/notification.repository");

class NotificationService {
  async getNotifications(residentId) {
    const notifications = await notificationRepo.findByResidentId(residentId);
    const unreadCount = await notificationRepo.countUnreadByResidentId(residentId);
    return {
      unreadCount,
      data: notifications
    };
  }

  async readNotification(id, residentId) {
    return await notificationRepo.updateReadStatus(id, residentId);
  }

  async readAllNotifications(residentId) {
    return await notificationRepo.updateAllRead(residentId);
  }
}

module.exports = new NotificationService();
