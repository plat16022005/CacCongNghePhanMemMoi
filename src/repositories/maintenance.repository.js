const MaintenanceRequest = require("../models/maintenanceRequest");

class MaintenanceRepository {
  async create(data) {
    return await MaintenanceRequest.create(data);
  }

  async findByResidentId(residentId) {
    return await MaintenanceRequest.find({ residentId }).sort({ createdAt: -1 });
  }

  async findByIdAndResidentId(id, residentId) {
    return await MaintenanceRequest.findOne({ _id: id, residentId });
  }

  async getDashboardStats(userId) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const MaintenanceSchedule = require("../models/maintenanceSchedule");

    // My tasks
    const pendingTasks = await MaintenanceRequest.countDocuments({
      $or: [
        { assignedTo: userId, status: { $in: ["pending", "assigned"] } },
        { assignedTo: null, status: "pending" },
        { assignedTo: { $exists: false }, status: "pending" }
      ]
    });

    const inProgressTasks = await MaintenanceRequest.countDocuments({
      assignedTo: userId,
      status: "in_progress"
    });

    const completedTodayTasks = await MaintenanceRequest.countDocuments({
      assignedTo: userId,
      status: "completed",
      updatedAt: { $gte: todayStart, $lte: todayEnd }
    });

    const emergencyTasks = await MaintenanceRequest.countDocuments({
      urgency: "emergency",
      status: { $ne: "completed" },
      $or: [
        { assignedTo: userId },
        { assignedTo: null },
        { assignedTo: { $exists: false } }
      ]
    });

    const scheduledToday = await MaintenanceSchedule.countDocuments({
      assignedTo: userId,
      scheduledDate: { $gte: todayStart, $lte: todayEnd },
      status: "scheduled"
    });

    return {
      myTasks: {
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completedToday: completedTodayTasks
      },
      emergencyTasks,
      scheduledToday
    };
  }

  async getStats(userId) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const completedTasks = await MaintenanceRequest.find({
      assignedTo: userId,
      status: "completed",
      updatedAt: { $gte: startOfMonth }
    });

    const byCategory = {};
    let totalTime = 0;
    let countedTime = 0;

    completedTasks.forEach(task => {
      byCategory[task.category] = (byCategory[task.category] || 0) + 1;
      
      // Calculate completion time if possible
      if (task.createdAt && task.updatedAt) {
        totalTime += (task.updatedAt - task.createdAt) / (1000 * 60 * 60); // hours
        countedTime++;
      }
    });

    const byCategoryArr = Object.entries(byCategory).map(([category, count]) => ({ category, count }));
    const avgTime = countedTime > 0 ? (totalTime / countedTime).toFixed(1) : 0;

    return {
      thisMonth: {
        completed: completedTasks.length,
        avgCompletionTime: `${avgTime} giờ`,
        byCategory: byCategoryArr
      }
    };
  }
}

module.exports = new MaintenanceRepository();
