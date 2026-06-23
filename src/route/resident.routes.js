const express = require("express");
const router = express.Router();
const residentCtrl = require("../controllers/resident.controller");
const { editProfileRules } = require("../validations/user.validation");
const { validate } = require("../middlewares/validate.middleware");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");

// Tất cả API của cư dân phải đăng nhập
router.use(verifyTokenLogin);

// Profile
router.get("/profile", residentCtrl.getProfile);
router.patch("/profile", editProfileRules, validate, residentCtrl.updateProfile);

// Apartment
router.get("/apartment", residentCtrl.getApartment);

// Invoices
router.get("/invoices", residentCtrl.getInvoices);
router.get("/invoices/:id", residentCtrl.getInvoiceById);

// Payment (Demo)
router.post("/invoices/:id/pay", residentCtrl.payInvoice);
router.post("/invoices/payment/callback", residentCtrl.paymentCallback);

// Guests
router.post("/guests", residentCtrl.createGuest);
router.get("/guests", residentCtrl.getGuests);
router.delete("/guests/:id", residentCtrl.deleteGuest);

// Parking
router.post("/parking", residentCtrl.createParking);
router.get("/parking", residentCtrl.getParking);
router.delete("/parking/:id", residentCtrl.deleteParking);

// Notifications
router.get("/notifications", residentCtrl.getNotifications);
router.patch("/notifications/read-all", residentCtrl.readAllNotifications);
router.patch("/notifications/:id/read", residentCtrl.readNotification);

// Feedbacks
router.post("/feedbacks", residentCtrl.createFeedback);
router.get("/feedbacks", residentCtrl.getFeedbacks);

// Maintenance
router.post("/maintenance", residentCtrl.createMaintenance);
router.get("/maintenance", residentCtrl.getMaintenance);

module.exports = router;
