const cron = require("node-cron");
const RoomInvoice = require("../models/roomInvoice");
const Notification = require("../models/notification");

const startInvoiceJob = () => {
  // Chạy mỗi ngày lúc 00:05
  cron.schedule("5 0 * * *", async () => {
    console.log("[CRON] Bắt đầu quét hóa đơn quá hạn...");
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Tìm tất cả hóa đơn chưa thanh toán và đã quá hạn
      const overdueInvoices = await RoomInvoice.find({
        status: "unpaid",
        dueDate: { $lt: today }
      });

      if (overdueInvoices.length === 0) {
        console.log("[CRON] Không có hóa đơn quá hạn mới.");
        return;
      }

      for (const invoice of overdueInvoices) {
        invoice.status = "overdue";
        await invoice.save();

        // Gửi notification nhắc nợ
        if (invoice.tenantId) {
          await Notification.create({
            residentId: invoice.tenantId,
            title: "⚠️ Hóa đơn quá hạn",
            content: `Hóa đơn kỳ ${invoice.period || invoice.month} (Loại: ${invoice.type}) của bạn đã quá hạn thanh toán. Vui lòng thanh toán ngay để tránh bị phạt.`,
            type: "invoice_reminder",
            isRead: false
          });
        }
      }

      console.log(`[CRON] Đã cập nhật ${overdueInvoices.length} hóa đơn thành quá hạn.`);
    } catch (err) {
      console.error("[CRON] Lỗi quét hóa đơn:", err);
    }
  });
};

module.exports = startInvoiceJob;
