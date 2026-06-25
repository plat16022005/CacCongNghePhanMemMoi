const RoomInvoice = require("../models/roomInvoice");
const Notification = require("../models/notification");

class ManagerInvoiceService {
  async getInvoices(query) {
    const { status, month, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (month) filter.period = month; // or month depending on model field

    const invoices = await RoomInvoice.find(filter)
      .populate("tenantId", "name email phoneNumber")
      .populate("room", "roomNumber block")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
      
    const total = await RoomInvoice.countDocuments(filter);

    return {
      data: invoices,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async getOverdueInvoices() {
    const today = new Date();
    return await RoomInvoice.find({
      status: { $ne: "paid" },
      dueDate: { $lt: today }
    }).populate("tenantId").populate("room");
  }

  async remindInvoices(data) {
    const { month, invoiceType } = data;
    let filter = { status: { $ne: "paid" } };
    if (month) filter.period = month;
    if (invoiceType && invoiceType !== "all") filter.type = invoiceType;

    const unpaidInvoices = await RoomInvoice.find(filter).distinct("tenantId");

    // Tạo notification cho từng resident
    const notifs = unpaidInvoices.map(residentId => ({
      residentId,
      title: "Nhắc nhở thanh toán hóa đơn",
      content: `Kính gửi cư dân, bạn có hóa đơn chưa thanh toán cho tháng ${month || 'này'}. Vui lòng kiểm tra và thanh toán sớm để tránh gián đoạn dịch vụ.`,
      type: "invoice_reminder"
    }));

    if (notifs.length > 0) {
      await Notification.insertMany(notifs);
    }

    return unpaidInvoices.length;
  }
}

module.exports = new ManagerInvoiceService();
