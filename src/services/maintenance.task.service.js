const MaintenanceRequest = require("../models/maintenanceRequest");
const MaintenanceHistory = require("../models/maintenanceHistory");
const Notification = require("../models/notification");
const Room = require("../models/room");

class MaintenanceTaskService {
  async getMyTasks(userId, query) {
    const { status, urgency, category } = query;
    let filter = {
      $or: [
        { assignedTo: userId },
        { assignedTo: null },
        { assignedTo: { $exists: false } }
      ]
    };

    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (category) filter.category = category;

    const tasks = await MaintenanceRequest.find(filter)
      .populate("residentId", "name phone")
      .populate("assignedTo", "name")
      .sort({ urgency: 1, createdAt: 1 }); // Assuming "emergency" might not sort correctly with string sort, will need to handle.
      
    // Custom sort to ensure emergency is first
    const urgencyOrder = { emergency: 1, high: 2, normal: 3, low: 4 };
    
    tasks.sort((a, b) => {
      if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    // Formatting
    const formatted = [];
    for (const t of tasks) {
      // Find room for apartmentCode
      const room = await Room.findOne({ tenantId: t.residentId });
      
      formatted.push({
        id: t._id,
        title: t.title,
        category: t.category,
        urgency: t.urgency,
        status: t.status,
        apartmentCode: room ? room.roomNumber : "N/A",
        residentName: t.residentId ? t.residentId.name : "N/A",
        description: t.description,
        createdAt: t.createdAt,
        assignedTo: t.assignedTo ? t.assignedTo.name : "N/A"
      });
    }

    return { data: formatted };
  }

  async getAllTasks(query) {
    const tasks = await MaintenanceRequest.find()
      .populate("residentId", "name phone")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 });
    
    // Formatting
    const formatted = [];
    for (const t of tasks) {
      const room = await Room.findOne({ tenantId: t.residentId });
      formatted.push({
        id: t._id,
        title: t.title,
        category: t.category,
        urgency: t.urgency,
        status: t.status,
        apartmentCode: room ? room.roomNumber : "N/A",
        residentName: t.residentId ? t.residentId.name : "N/A",
        description: t.description,
        createdAt: t.createdAt,
        assignedTo: t.assignedTo ? t.assignedTo.name : "Chưa phân công"
      });
    }

    return { data: formatted };
  }

  async getTaskById(id) {
    const task = await MaintenanceRequest.findById(id)
      .populate("residentId", "name phone")
      .populate("assignedTo", "name");
      
    if (!task) throw { status: 404, message: "Không tìm thấy yêu cầu" };
    
    const room = await Room.findOne({ tenantId: task.residentId });
    
    return {
      ...task.toObject(),
      apartmentCode: room ? room.roomNumber : "N/A"
    };
  }

  async acceptTask(id, user) {
    const task = await MaintenanceRequest.findById(id);
    if (!task) throw { status: 404, message: "Không tìm thấy yêu cầu" };
    
    const userId = user.id || user.userId;
    if (task.assignedTo && task.assignedTo.toString() !== userId) {
      throw { status: 403, message: "Yêu cầu đã được phân công cho người khác" };
    }

    task.status = "assigned";
    if (!task.assignedTo) task.assignedTo = userId;
    await task.save();

    await MaintenanceHistory.create({
      taskId: task._id,
      status: "assigned",
      note: "Đã tiếp nhận yêu cầu",
      updatedBy: userId
    });

    return task;
  }

  async updateProgress(id, payload, user) {
    const task = await MaintenanceRequest.findById(id);
    if (!task) throw { status: 404, message: "Không tìm thấy" };
    
    const userId = user.id || user.userId;
    task.status = payload.status || "in_progress";
    await task.save();

    await MaintenanceHistory.create({
      taskId: task._id,
      status: task.status,
      note: payload.note || "Cập nhật tiến độ",
      updatedBy: userId
    });

    return task;
  }

  async completeTask(id, payload, user) {
    const task = await MaintenanceRequest.findById(id);
    if (!task) throw { status: 404, message: "Không tìm thấy" };
    
    const userId = user.id || user.userId;
    task.status = "completed";
    task.completionNote = payload.completionNote;
    if (payload.materialsUsed) task.materialsUsed = payload.materialsUsed;
    await task.save();

    await MaintenanceHistory.create({
      taskId: task._id,
      status: "completed",
      note: payload.completionNote || "Đã hoàn thành công việc",
      updatedBy: userId
    });

    // Send notification
    await Notification.create({
      residentId: task.residentId,
      title: "✅ Yêu cầu sửa chữa đã hoàn thành",
      content: `Yêu cầu "${task.title}" của bạn đã được xử lý xong.`,
      type: "maintenance_update"
    });

    return task;
  }

  async assignTask(id, assignedTo, user) {
    const task = await MaintenanceRequest.findById(id);
    if (!task) throw { status: 404, message: "Không tìm thấy" };
    
    const userId = user.id || user.userId;
    task.assignedTo = assignedTo;
    task.status = "assigned";
    await task.save();

    await MaintenanceHistory.create({
      taskId: task._id,
      status: "assigned",
      note: "Được phân công bởi Quản lý",
      updatedBy: userId
    });

    return task;
  }

  async getTaskHistory(id) {
    const history = await MaintenanceHistory.find({ taskId: id })
      .populate("updatedBy", "name")
      .sort({ createdAt: 1 });
      
    return {
      taskId: id,
      history: history.map(h => ({
        status: h.status,
        note: h.note,
        updatedBy: h.updatedBy ? h.updatedBy.name : "N/A",
        at: h.createdAt
      }))
    };
  }
}

module.exports = new MaintenanceTaskService();
