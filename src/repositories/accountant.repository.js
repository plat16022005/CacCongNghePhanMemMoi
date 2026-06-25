const RoomInvoice = require("../models/roomInvoice");

class AccountantRepository {
  async getDashboardStats(month) {
    // month format: "YYYY-MM"
    const invoicesThisMonth = await RoomInvoice.find({ period: month });
    
    let totalBilled = 0;
    let totalCollected = 0;
    let totalOverdue = 0;
    let overdueCount = 0;
    let pendingConfirmation = 0; // For online/transfer payments that might need review (mocking this logic or counting pending payments)

    for (const inv of invoicesThisMonth) {
      totalBilled += inv.amount || inv.totalBill;
      if (inv.status === "paid") totalCollected += inv.amount || inv.totalBill;
      if (inv.status === "overdue") {
        totalOverdue += inv.amount || inv.totalBill;
        overdueCount++;
      }
    }

    // Lấy số liệu quá hạn chung (không chỉ trong tháng này)
    const allOverdue = await RoomInvoice.find({ status: "overdue" });
    const globalOverdueAmount = allOverdue.reduce((acc, inv) => acc + (inv.amount || inv.totalBill), 0);

    return {
      currentMonth: month,
      totalBilled,
      totalCollected,
      totalOverdue: globalOverdueAmount,
      overdueCount: allOverdue.length,
      invoicesCreatedThisMonth: invoicesThisMonth.length,
      pendingConfirmation // default 0 for now
    };
  }
}

module.exports = new AccountantRepository();
