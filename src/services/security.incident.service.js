const Incident = require("../models/incident");
const Notification = require("../models/notification");
const User = require("../models/user");

class SecurityIncidentService {
  async getIncidents(query) {
    const { status, date, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);
      filter.createdAt = { $gte: d, $lt: nextD };
    }

    const incidents = await Incident.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Incident.countDocuments(filter);

    return {
      data: incidents,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async createIncident(data) {
    const incident = new Incident(data);
    await incident.save();

    // Push notification to manager if critical
    if (incident.severity === "critical") {
      const managers = await User.find({ role: "manager" });
      const notifs = managers.map(m => ({
        residentId: m._id, // Repurposing residentId as generic user target for notification
        title: "🚨 BÁO ĐỘNG KHẨN CẤP",
        content: `Sự cố nghiêm trọng: ${incident.title}. Tại: ${incident.location}. Vui lòng xử lý ngay lập tức!`,
        type: "general"
      }));
      if(notifs.length > 0) {
        await Notification.insertMany(notifs);
      }
    }

    // Logic 3: Incident -> Maintenance Sync
    // Kiểm tra các từ khóa liên quan đến sửa chữa kỹ thuật
    const keywords = ['hỏng', 'hư', 'vỡ', 'cháy', 'nước', 'điện', 'rò rỉ', 'chập', 'thang máy', 'bơm'];
    const lowerTitleDesc = (incident.title + " " + incident.description).toLowerCase();
    const needsMaintenance = keywords.some(kw => lowerTitleDesc.includes(kw));

    if (needsMaintenance) {
      const MaintenanceRequest = require("../models/maintenanceRequest");
      // Tìm một admin hoặc manager để gán làm người tạo yêu cầu, do bảo vệ không có residentId hợp lệ
      const adminUser = await User.findOne({ role: { $in: ["admin", "manager"] } });
      
      if (adminUser) {
        let category = "common_area";
        if (lowerTitleDesc.includes("nước") || lowerTitleDesc.includes("rò rỉ")) category = "plumbing";
        if (lowerTitleDesc.includes("điện") || lowerTitleDesc.includes("chập")) category = "electrical";
        if (lowerTitleDesc.includes("thang máy")) category = "elevator";

        let urgency = incident.severity === "critical" ? "emergency" : incident.severity === "high" ? "high" : "normal";

        await MaintenanceRequest.create({
          residentId: adminUser._id, // Repurposed for system-generated request
          title: `[TỪ BẢO VỆ] ${incident.title}`,
          description: `Vị trí: ${incident.location || 'Không rõ'}. Chi tiết: ${incident.description}`,
          category: category,
          urgency: urgency,
          imageUrls: incident.imageUrls || [],
          status: "pending"
        });
      }
    }

    return incident;
  }

  async closeIncident(id) {
    const incident = await Incident.findByIdAndUpdate(id, { status: "closed" }, { new: true });
    if (!incident) throw { status: 404, message: "Không tìm thấy sự cố" };
    return incident;
  }
}

module.exports = new SecurityIncidentService();
