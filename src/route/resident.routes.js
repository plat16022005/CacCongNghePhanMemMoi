const express = require("express");
const router = express.Router();
const residentCtrl = require("../controllers/resident.controller");
const { editProfileRules } = require("../validations/user.validation");
const { createGuestRules } = require("../validations/guest.validation");
const { createParkingRules, updateParkingRules } = require("../validations/parking.validation");
const { createMaintenanceRules } = require("../validations/maintenance.validation");
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
router.post("/guests", createGuestRules, validate, residentCtrl.createGuest);
router.get("/guests", residentCtrl.getGuests);
router.delete("/guests/:id", residentCtrl.deleteGuest);

// Parking
router.post("/parking", createParkingRules, validate, residentCtrl.createParking);
router.get("/parking", residentCtrl.getParking);
router.patch("/parking/:id", updateParkingRules, validate, residentCtrl.updateParking);
router.delete("/parking/:id", residentCtrl.deleteParking);

// Notifications
router.get("/notifications", residentCtrl.getNotifications);
router.patch("/notifications/read-all", residentCtrl.readAllNotifications);
router.patch("/notifications/:id/read", residentCtrl.readNotification);

// Feedbacks
router.post("/feedbacks", residentCtrl.createFeedback);
router.get("/feedbacks", residentCtrl.getFeedbacks);

// Maintenance
router.post("/maintenance", createMaintenanceRules, validate, residentCtrl.createMaintenance);
router.get("/maintenance", residentCtrl.getMaintenance);

// Amenities
router.get("/amenities", residentCtrl.getAmenities);
router.get("/amenities/bookings", residentCtrl.getMyBookings);
router.get("/amenities/:id/slots", residentCtrl.getAmenitySlots);
router.post("/amenities/:id/book", residentCtrl.createBooking);
router.delete("/amenities/bookings/:id", residentCtrl.cancelBooking);

// Surveys
router.get("/surveys", residentCtrl.getSurveys);
router.get("/surveys/:id", residentCtrl.getSurveyById);
router.post("/surveys/:id/submit", residentCtrl.submitSurvey);

module.exports = router;
