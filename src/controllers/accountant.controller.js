const accountantRepo = require("../repositories/accountant.repository");
const invoiceService = require("../services/accountant.invoice.service");
const paymentService = require("../services/accountant.payment.service");
const reportService = require("../services/accountant.report.service");

// --- DASHBOARD ---
exports.getDashboard = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7); // YYYY-MM
    const stats = await accountantRepo.getDashboardStats(month);
    res.status(200).json(stats);
  } catch (err) { next(err); }
};

// --- INVOICES ---
exports.getInvoices = async (req, res, next) => {
  try {
    const result = await invoiceService.getInvoices(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const result = await invoiceService.getInvoiceById(req.params.id);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.createInvoice = async (req, res, next) => {
  try {
    const result = await invoiceService.createInvoice(req.body);
    res.status(201).json({ message: "Tạo hóa đơn thành công", data: result });
  } catch (err) { next(err); }
};

exports.createBulkInvoices = async (req, res, next) => {
  try {
    const result = await invoiceService.createBulkInvoices(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const result = await invoiceService.updateInvoice(req.params.id, req.body);
    res.status(200).json({ message: "Cập nhật thành công", data: result });
  } catch (err) { next(err); }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    await invoiceService.deleteInvoice(req.params.id);
    res.status(200).json({ message: "Xóa hóa đơn thành công" });
  } catch (err) { next(err); }
};

// --- PAYMENTS & DEBTS ---
exports.getPayments = async (req, res, next) => {
  try {
    const result = await paymentService.getPayments(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const result = await paymentService.confirmPayment(req.params.invoiceId, req.body, req.user);
    res.status(200).json({ message: "Xác nhận thanh toán thành công", data: result });
  } catch (err) { next(err); }
};

exports.getDebts = async (req, res, next) => {
  try {
    const result = await paymentService.getDebts(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.remindDebts = async (req, res, next) => {
  try {
    const { apartmentIds, message } = req.body;
    const result = await paymentService.remindDebts(apartmentIds, message);
    res.status(200).json({ message: `Đã gửi nhắc nợ đến ${result.remindedCount} căn hộ` });
  } catch (err) { next(err); }
};

// --- SERVICE FEES ---
exports.getServiceFees = async (req, res, next) => {
  try {
    const data = await invoiceService.getServiceFees();
    res.status(200).json({ data });
  } catch (err) { next(err); }
};

exports.createServiceFee = async (req, res, next) => {
  try {
    const data = await invoiceService.createServiceFee(req.body);
    res.status(201).json({ message: "Tạo biểu phí thành công", data });
  } catch (err) { next(err); }
};

exports.updateServiceFee = async (req, res, next) => {
  try {
    const data = await invoiceService.updateServiceFee(req.params.id, req.body);
    res.status(200).json({ message: "Cập nhật biểu phí thành công", data });
  } catch (err) { next(err); }
};

// --- REPORTS ---
exports.getMonthlyReport = async (req, res, next) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const result = await reportService.getMonthlyReport(month);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.exportReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ message: "Yêu cầu from và to" });

    const workbook = await reportService.exportExcel(from, to);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=BaoCao_TC_${from}_${to}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { next(err); }
};
