const express = require("express");
const router = express.Router();
const accountantCtrl = require("../controllers/accountant.controller");
const { verifyTokenLogin } = require("../middlewares/auth.middleware");

// Middlewares
router.use(verifyTokenLogin);
// router.use(authorize('accountant'));

// Dashboard
router.get("/dashboard", accountantCtrl.getDashboard);

// Invoices
router.get("/invoices", accountantCtrl.getInvoices);
router.post("/invoices", accountantCtrl.createInvoice);
router.post("/invoices/bulk", accountantCtrl.createBulkInvoices);
router.get("/invoices/:id", accountantCtrl.getInvoiceById);
router.patch("/invoices/:id", accountantCtrl.updateInvoice);
router.delete("/invoices/:id", accountantCtrl.deleteInvoice);

// Payments & Debts
router.get("/payments", accountantCtrl.getPayments);
router.patch("/payments/:invoiceId/confirm", accountantCtrl.confirmPayment);
router.get("/debts", accountantCtrl.getDebts);
router.post("/debts/remind", accountantCtrl.remindDebts);

// Service Fees
router.get("/service-fees", accountantCtrl.getServiceFees);
router.post("/service-fees", accountantCtrl.createServiceFee);
router.patch("/service-fees/:id", accountantCtrl.updateServiceFee);

// Reports
router.get("/reports/monthly", accountantCtrl.getMonthlyReport);
router.get("/reports/export", accountantCtrl.exportReport);

module.exports = router;
