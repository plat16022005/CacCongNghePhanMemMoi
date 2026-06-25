const MaintenanceSchedule = require("../models/maintenanceSchedule");

class MaintenanceScheduleService {
  async getSchedules(query) {
    // query.month format: YYYY-MM
    const filter = {};
    if (query.month) {
      const year = parseInt(query.month.split("-")[0]);
      const month = parseInt(query.month.split("-")[1]) - 1;
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59);
      
      filter.scheduledDate = { $gte: startDate, $lte: endDate };
    }

    const schedules = await MaintenanceSchedule.find(filter)
      .populate("assignedTo", "name")
      .sort({ scheduledDate: 1 });

    const data = schedules.map(s => ({
      id: s._id,
      title: s.title,
      category: s.category,
      scheduledDate: s.scheduledDate.toISOString().split("T")[0],
      scheduledTime: s.scheduledTime,
      estimatedDuration: s.estimatedDuration,
      assignedTo: s.assignedTo ? s.assignedTo.name : null,
      status: s.status,
      recurrence: s.recurrence
    }));

    return { data };
  }

  async createSchedule(data) {
    const schedule = new MaintenanceSchedule(data);
    await schedule.save();
    return schedule;
  }

  async updateSchedule(id, data) {
    return await MaintenanceSchedule.findByIdAndUpdate(id, data, { new: true });
  }

  async markDone(id) {
    const schedule = await MaintenanceSchedule.findById(id);
    if (!schedule) throw { status: 404, message: "Không tìm thấy lịch" };

    schedule.status = "done";
    schedule.completedAt = new Date();
    await schedule.save();

    // Tự động sinh lịch tiếp theo
    if (schedule.recurrence && schedule.recurrence !== "once") {
      const nextDate = new Date(schedule.scheduledDate);
      
      switch (schedule.recurrence) {
        case "weekly":
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case "monthly":
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case "quarterly":
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
        case "annually":
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }

      await MaintenanceSchedule.create({
        title: schedule.title,
        category: schedule.category,
        scheduledDate: nextDate,
        scheduledTime: schedule.scheduledTime,
        estimatedDuration: schedule.estimatedDuration,
        assignedTo: schedule.assignedTo,
        recurrence: schedule.recurrence,
        status: "scheduled"
      });
    }

    return schedule;
  }

  async deleteSchedule(id) {
    await MaintenanceSchedule.findByIdAndDelete(id);
    return { success: true };
  }
}

module.exports = new MaintenanceScheduleService();
