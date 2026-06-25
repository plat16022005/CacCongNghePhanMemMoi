const User = require("../models/user");
const Building = require("../models/building");
const Room = require("../models/room");
const ActivityLog = require("../models/activityLog");

class AdminRepository {
  async getDashboardStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const users = await User.find({}, "role lastLogin");
    const totalUsers = users.length;
    
    const byRole = { resident: 0, manager: 0, security: 0, accountant: 0, maintenance: 0, admin: 0 };
    let activeToday = 0;

    users.forEach(u => {
      byRole[u.role] = (byRole[u.role] || 0) + 1;
      if (u.lastLogin && u.lastLogin >= todayStart) {
        activeToday++;
      }
    });

    const buildingsCount = await Building.countDocuments();
    const apartmentsCount = await Room.countDocuments();

    // Mock DB size (in real world, requires mongoose.connection.db.stats())
    const dbSizeMB = 125; 
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (3600*24));
    const hours = Math.floor(uptimeSeconds % (3600*24) / 3600);
    const uptimeStr = `${days} ngày ${hours} giờ`;

    const recentErrors = await ActivityLog.countDocuments({ 
      createdAt: { $gte: todayStart },
      action: { $regex: /error/i } // if any
    });

    return {
      users: {
        total: totalUsers,
        byRole,
        activeToday
      },
      system: {
        buildings: buildingsCount,
        totalApartments: apartmentsCount,
        dbSizeMB,
        uptime: uptimeStr
      },
      recentErrors
    };
  }
}

module.exports = new AdminRepository();
