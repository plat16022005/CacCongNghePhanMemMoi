const express = require("express");
const router = express.Router();
const securityCtrl = require("../controllers/security.controller");
const { verifyTokenLogin } = require("../middlewares/auth.middleware");

// Tạm thời comment authorize('security') nếu chưa test được auth role
router.use(verifyTokenLogin);
// router.use(authorize("security")); 

// --- DASHBOARD ---
router.get("/dashboard", securityCtrl.getDashboard);

// --- GUESTS / CHECKIN ---
router.post("/checkin/qr", securityCtrl.qrCheckin);
router.post("/checkin/manual", securityCtrl.manualCheckin);
router.post("/checkout/:guestId", securityCtrl.checkout);
router.get("/guests/today", securityCtrl.getGuestsToday);
router.get("/guests/lookup", securityCtrl.lookupGuests);

// --- VEHICLES ---
router.get("/vehicles", securityCtrl.lookupVehicle);
router.post("/vehicles/log", securityCtrl.logVehicleAction);
router.get("/vehicles/pending", securityCtrl.getPendingVehicles);

// --- INCIDENTS ---
router.get("/incidents", securityCtrl.getIncidents);
router.post("/incidents", securityCtrl.createIncident);
router.patch("/incidents/:id/close", securityCtrl.closeIncident);

module.exports = router;
