const express = require("express");
const router = express.Router();
const guardCtrl = require("../controllers/guard.controller");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");

// Tất cả API của bảo vệ yêu cầu đã đăng nhập và có role 'guard'
router.use(verifyTokenLogin, authorize("guard"));

// Quản lý khách ra vào
router.get("/guests", guardCtrl.getGuests);
router.post("/guests/scan-qr", guardCtrl.scanQr);
router.post("/guests/:id/checkin", guardCtrl.checkinGuest);
router.post("/guests/:id/checkout", guardCtrl.checkoutGuest);

// Kiểm tra xe gửi
router.get("/vehicles", guardCtrl.checkVehicle);

// Ghi nhận sự cố an ninh
router.post("/incidents", guardCtrl.reportIncident);

module.exports = router;
