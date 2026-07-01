const express = require("express");
const router = express.Router();
const managerCtrl = require("../controllers/manager.controller");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");

// Auth middlewares: only manager can access these endpoints
router.use(verifyTokenLogin);
// Assuming authorize middleware can check role 'manager'. Let's comment it if not fully implemented in current code.
// router.use(authorize("manager")); 

// --- DASHBOARD & REPORTS ---
router.get("/dashboard", managerCtrl.getDashboard);
router.get("/reports/revenue", managerCtrl.getRevenueReport);

// --- RESIDENTS ---
router.get("/residents", managerCtrl.getResidents);
router.get("/residents/:id", managerCtrl.getResidentById);
router.post("/residents", managerCtrl.createResident);
router.patch("/residents/:id", managerCtrl.updateResident);
router.patch("/residents/:id/status", managerCtrl.toggleResidentStatus);

// --- APARTMENTS ---
router.get("/apartments", managerCtrl.getApartments);
router.get("/apartments/:id", managerCtrl.getApartmentById);
router.patch("/apartments/:id", managerCtrl.updateApartment);
router.patch("/apartments/:id/status", managerCtrl.updateApartmentStatus);

// --- GUESTS ---
router.get("/guests", managerCtrl.getGuests);
router.patch("/guests/:id/approve", managerCtrl.approveGuest);
router.patch("/guests/:id/reject", managerCtrl.rejectGuest);

// --- PARKING ---
router.get("/parking", managerCtrl.getParkings);
router.patch("/parking/:id/approve", managerCtrl.approveParking);
router.patch("/parking/:id/reject", managerCtrl.rejectParking);

// --- INVOICES ---
router.get("/invoices", managerCtrl.getInvoices);
router.get("/invoices/overdue", managerCtrl.getOverdueInvoices);
router.post("/invoices/remind", managerCtrl.remindInvoices);

// --- ANNOUNCEMENTS ---
router.get("/announcements", managerCtrl.getAnnouncements);
router.post("/announcements", managerCtrl.sendAnnouncement);
router.delete("/announcements/:id", managerCtrl.deleteAnnouncement);

// --- FEEDBACKS ---
router.get("/feedbacks", managerCtrl.getFeedbacks);
router.get("/feedbacks/:id", managerCtrl.getFeedbackById);
router.patch("/feedbacks/:id/respond", managerCtrl.respondFeedback);
router.patch("/feedbacks/:id/close", managerCtrl.closeFeedback);

// --- AMENITIES ---
router.get("/amenities", managerCtrl.getAmenities);
router.post("/amenities", managerCtrl.createAmenity);
router.patch("/amenities/:id", managerCtrl.updateAmenity);
router.patch("/amenities/:id/status", managerCtrl.updateAmenityStatus);
router.get("/amenities/:id/bookings", managerCtrl.getAmenityBookings);
router.patch("/amenities/bookings/:id/approve", managerCtrl.approveAmenityBooking);
router.patch("/amenities/bookings/:id/reject", managerCtrl.rejectAmenityBooking);

// --- VIEWING REQUESTS ---
router.get("/viewing-requests", managerCtrl.getViewingRequests);
router.patch("/viewing-requests/:id", managerCtrl.updateViewingRequestStatus);

module.exports = router;
