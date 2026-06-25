const RoomInvoice = require("../models/roomInvoice");
const PaymentRecord = require("../models/paymentRecord");
const Room = require("../models/room");
const Notification = require("../models/notification");

class AccountantPaymentService {
  async getPayments(query) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const payments = await PaymentRecord.find()
      .populate({
        path: "invoiceId",
        populate: [
          { path: "room", select: "roomNumber" },
          { path: "tenant", select: "name" }
        ]
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ paidAt: -1 });

    const formatted = payments.map(p => ({
      id: p._id,
      invoiceId: p.invoiceId?._id,
      apartmentCode: p.invoiceId?.room?.roomNumber,
      residentName: p.invoiceId?.tenant?.name,
      amount: p.amount,
      method: p.method,
      paidAt: p.paidAt,
      confirmedBy: p.confirmedBy
    }));

    return { data: formatted };
  }

  async confirmPayment(invoiceId, payload, user) {
    const invoice = await RoomInvoice.findById(invoiceId).populate("tenant");
    if (!invoice) throw { status: 404, message: "Hóa đơn không tồn tại" };
    if (invoice.status === "paid") throw { status: 400, message: "Hóa đơn đã được thanh toán" };

    invoice.status = "paid";
    await invoice.save();

    const record = new PaymentRecord({
      invoiceId: invoice._id,
      amount: payload.amount,
      method: payload.paymentMethod,
      note: payload.note,
      confirmedBy: user ? user.name : "Admin"
    });
    await record.save();

    // Notify resident
    if (invoice.tenant) {
      await Notification.create({
        residentId: invoice.tenant._id,
        title: "✅ Thanh toán thành công",
        content: `Đã xác nhận thanh toán ${payload.amount.toLocaleString()}đ cho hóa đơn ${invoice.type} kỳ ${invoice.period}.`,
        type: "payment_success"
      });
    }

    return record;
  }

  async getDebts(query) {
    // Lấy công nợ theo từng phòng (các hóa đơn unpaid/overdue)
    const { minAmount, overdueOnly } = query;

    const filter = { status: { $in: ["unpaid", "overdue"] } };
    if (overdueOnly === "true") {
      filter.status = "overdue";
    }

    const invoices = await RoomInvoice.find(filter).populate("room").populate("tenant");
    
    const debtMap = {};
    let totalDebtAll = 0;

    for (const inv of invoices) {
      if (!inv.room) continue;
      const roomId = inv.room._id.toString();
      if (!debtMap[roomId]) {
        debtMap[roomId] = {
          apartmentId: roomId,
          apartmentCode: inv.room.roomNumber,
          residentName: inv.tenant ? inv.tenant.name : "N/A",
          totalDebt: 0,
          invoiceCount: 0,
          oldestDueDate: inv.dueDate
        };
      }
      
      debtMap[roomId].totalDebt += (inv.amount || inv.totalBill);
      debtMap[roomId].invoiceCount += 1;
      
      if (inv.dueDate && (!debtMap[roomId].oldestDueDate || inv.dueDate < debtMap[roomId].oldestDueDate)) {
        debtMap[roomId].oldestDueDate = inv.dueDate;
      }

      totalDebtAll += (inv.amount || inv.totalBill);
    }

    let data = Object.values(debtMap);
    
    if (minAmount) {
      data = data.filter(d => d.totalDebt >= parseInt(minAmount));
    }

    return {
      data,
      summary: {
        totalApartments: data.length,
        totalDebt: totalDebtAll
      }
    };
  }

  async remindDebts(apartmentIds, customMessage) {
    let rooms;
    if (apartmentIds && apartmentIds.length > 0) {
      rooms = await Room.find({ _id: { $in: apartmentIds } });
    } else {
      // Remind all
      rooms = await Room.find({ status: "occupied" });
    }

    const notifications = [];
    for (const room of rooms) {
      if (!room.tenantId) continue;
      
      const unpaid = await RoomInvoice.find({ roomId: room._id, status: { $in: ["unpaid", "overdue"] } });
      if (unpaid.length === 0) continue;

      const totalAmount = unpaid.reduce((acc, inv) => acc + (inv.amount || inv.totalBill), 0);

      const msg = customMessage || `Kính báo: Quý cư dân hiện đang có ${unpaid.length} hóa đơn chưa thanh toán. Tổng dư nợ: ${totalAmount.toLocaleString()}đ. Vui lòng thanh toán sớm để tránh gián đoạn dịch vụ.`;

      notifications.push({
        residentId: room.tenantId,
        title: "🔔 Nhắc nhở thanh toán phí chung cư",
        content: msg,
        type: "invoice_reminder"
      });
    }

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return { remindedCount: notifications.length };
  }
}

module.exports = new AccountantPaymentService();
