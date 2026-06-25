const ActivityLog = require("../models/activityLog");

class AdminLogService {
  async getLogs(query) {
    const { action, userId, from, to, page = 1, limit = 50 } = query;
    const filter = {};

    if (action) filter.action = action;
    if (userId) filter.userId = userId;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;
    const logs = await ActivityLog.find(filter)
      .populate("userId", "name role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(filter);

    return {
      data: logs.map(l => ({
        id: l._id,
        userId: l.userId ? l.userId._id : null,
        userName: l.userId ? `${l.userId.name} (${l.userId.role})` : "Unknown",
        action: l.action,
        target: l.target,
        detail: l.detail,
        ipAddress: l.ipAddress,
        createdAt: l.createdAt
      })),
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async getLogsByUser(userId, query) {
    query.userId = userId;
    return this.getLogs(query);
  }
}

module.exports = new AdminLogService();
