const RoomInvoice = require("../models/roomInvoice");
const Room = require("../models/room");
const User = require("../models/user");
const MaintenanceRequest = require("../models/maintenanceRequest");

class ManagerRepository {
  async getDashboardStats() {
    const totalApartments = await Room.countDocuments();
    const occupiedApartments = await Room.countDocuments({ status: "occupied" });
    const totalResidents = await User.countDocuments({ role: "resident" });
    const unpaidInvoices = await RoomInvoice.countDocuments({ status: { $ne: "paid" } });
    const openMaintenance = await MaintenanceRequest.countDocuments({ status: { $in: ["pending", "in_progress"] } });
    
    // Revenue this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueArr = await RoomInvoice.aggregate([
      { $match: { status: "paid", updatedAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalBill" } } }
    ]);
    const revenueThisMonth = revenueArr[0]?.total || 0;

    return {
      totalApartments,
      occupiedApartments,
      totalResidents,
      unpaidInvoices,
      openMaintenanceRequests: openMaintenance,
      revenueThisMonth
    };
  }

  async getRevenueReport(startDate, endDate) {
    const report = await RoomInvoice.aggregate([
      { 
        $match: { 
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$totalBill" },
          paid: { 
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$totalBill", 0] } 
          },
          unpaid: { 
            $sum: { $cond: [{ $ne: ["$status", "paid"] }, "$totalBill", 0] } 
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return report.map(r => ({
      period: r._id,
      total: r.total,
      paid: r.paid,
      unpaid: r.unpaid
    }));
  }
}

module.exports = new ManagerRepository();
