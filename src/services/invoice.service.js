const invoiceRepo = require("../repositories/invoice.repository");
const notificationRepo = require("../repositories/notification.repository");

class InvoiceService {
  async getInvoices(residentId, filters) {
    return await invoiceRepo.findByTenantId(residentId, filters);
  }

  async getInvoiceById(id, residentId) {
    return await invoiceRepo.findByIdAndTenantId(id, residentId);
  }

  async payInvoice(id, residentId) {
    const invoice = await invoiceRepo.findByIdAndTenantId(id, residentId);
    if (!invoice) throw { status: 404, message: "Hóa đơn không tồn tại" };
    if (invoice.status === "paid") throw { status: 400, message: "Hóa đơn đã được thanh toán" };

    // Simulate payment gateway URL generation
    return { paymentUrl: `https://payment-gateway.vn/pay?token=demo-${id}` };
  }

  async paymentCallback(invoiceId, residentId) {
    const invoice = await invoiceRepo.findByIdAndTenantId(invoiceId, residentId);
    if (!invoice) throw { status: 404, message: "Hóa đơn không tồn tại" };

    await invoiceRepo.updateStatus(invoiceId, "paid");

    // Tự động tạo notification
    await notificationRepo.create({
      residentId,
      title: "Thanh toán thành công",
      content: `Hóa đơn ${invoice.type} tháng ${invoice.period || invoice.month} đã thanh toán thành công.`,
      type: "invoice_reminder"
    });

    return true;
  }
}

module.exports = new InvoiceService();
