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

    return incident;
  }

  async closeIncident(id) {
    const incident = await Incident.findByIdAndUpdate(id, { status: "closed" }, { new: true });
    if (!incident) throw { status: 404, message: "Không tìm thấy sự cố" };
    return incident;
  }
}

module.exports = new SecurityIncidentService();
