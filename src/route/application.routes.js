const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/application.controller");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");

// Admin routes
router.get("/", verifyTokenLogin, authorize("admin"), appCtrl.getAllApplications);
router.put("/:id/approve", verifyTokenLogin, authorize("admin"), appCtrl.approveApplication);
router.put("/:id/reject", verifyTokenLogin, authorize("admin"), appCtrl.rejectApplication);
router.put("/:id/confirm-deposit", verifyTokenLogin, authorize("admin"), appCtrl.confirmDeposit);

module.exports = router;
