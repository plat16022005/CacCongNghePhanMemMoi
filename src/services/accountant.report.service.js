const RoomInvoice = require("../models/roomInvoice");
const exceljs = require("exceljs");

class AccountantReportService {
  async getMonthlyReport(month) {
    const invoices = await RoomInvoice.find({ period: month });
    
    let totalBilled = 0;
    let totalCollected = 0;

    const byTypeMap = {};

    for (const inv of invoices) {
      const amt = inv.amount || inv.totalBill;
      totalBilled += amt;
      
      if (!byTypeMap[inv.type]) {
        byTypeMap[inv.type] = { type: inv.type, billed: 0, collected: 0, rate: 0 };
      }
      
      byTypeMap[inv.type].billed += amt;
      if (inv.status === "paid") {
        totalCollected += amt;
        byTypeMap[inv.type].collected += amt;
      }
    }

    const byType = Object.values(byTypeMap).map(t => {
      t.rate = t.billed > 0 ? (t.collected / t.billed) * 100 : 0;
      return t;
    });

    return {
      period: month,
      byType,
      total: {
        billed: totalBilled,
        collected: totalCollected,
        outstanding: totalBilled - totalCollected
      }
    };
  }

  async exportExcel(from, to) {
    // Basic implementation
    const dFrom = new Date(from);
    const dTo = new Date(to);
    dTo.setHours(23, 59, 59, 999);

    const invoices = await RoomInvoice.find({
      createdAt: { $gte: dFrom, $lte: dTo }
    }).populate("room", "roomNumber").populate("tenant", "name");

    const workbook = new exceljs.Workbook();
    
    // Sheet 1: Tổng hợp
    const sheet1 = workbook.addWorksheet("Tổng hợp");
    sheet1.columns = [
      { header: "Mã phòng", key: "room", width: 15 },
      { header: "Chủ hộ", key: "tenant", width: 25 },
      { header: "Loại phí", key: "type", width: 15 },
      { header: "Kỳ", key: "period", width: 15 },
      { header: "Số tiền", key: "amount", width: 20 },
      { header: "Trạng thái", key: "status", width: 15 },
    ];

    invoices.forEach(inv => {
      sheet1.addRow({
        room: inv.room?.roomNumber,
        tenant: inv.tenant?.name,
        type: inv.type,
        period: inv.period || inv.month,
        amount: inv.amount || inv.totalBill,
        status: inv.status
      });
    });

    return workbook;
  }
}

module.exports = new AccountantReportService();
