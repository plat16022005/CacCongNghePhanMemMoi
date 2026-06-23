const express = require("express");
const router = express.Router();
const accountantCtrl = require("../controllers/accountant.controller");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");

// Tất cả các API yêu cầu đăng nhập và có role 'accountant'
router.use(verifyTokenLogin, authorize("accountant"));

// Hóa đơn
router.get("/invoices", accountantCtrl.getInvoices);
router.post("/invoices", accountantCtrl.createInvoice);
router.post("/invoices/auto-generate", accountantCtrl.autoGenerateInvoices);
router.patch("/invoices/:id/confirm", accountantCtrl.confirmPayment);

// Công nợ
router.get("/debts", accountantCtrl.getDebts);

module.exports = router;
