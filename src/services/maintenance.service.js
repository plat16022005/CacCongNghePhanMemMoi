const maintenanceRepo = require("../repositories/maintenance.repository");
const notificationRepo = require("../repositories/notification.repository");

class MaintenanceService {
  async getMaintenanceRequests(residentId) {
    return await maintenanceRepo.findByResidentId(residentId);
  }

  async getMaintenanceById(id, residentId) {
    return await maintenanceRepo.findByIdAndResidentId(id, residentId);
  }

  async createMaintenance(residentId, data) {
    const request = await maintenanceRepo.create({ ...data, residentId });

    // Business rule: Nếu khẩn cấp, tạo notification cho manager
    if (data.urgency === "emergency") {
      await notificationRepo.create({
        residentId: null, // Broadcast hoặc gửi cho manager
        title: "Báo cáo khẩn cấp",
        content: `Cư dân báo cáo sự cố khẩn cấp: ${data.title}`,
        type: "maintenance_update"
      });
    }

    return request;
  }
}

module.exports = new MaintenanceService();
