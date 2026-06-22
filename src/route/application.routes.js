const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/application.controller");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");

// Manager/Admin routes
router.get("/", verifyTokenLogin, authorize("manager", "admin"), appCtrl.getAllApplications);
router.put("/:id/approve", verifyTokenLogin, authorize("manager", "admin"), appCtrl.approveApplication);
router.put("/:id/reject", verifyTokenLogin, authorize("manager", "admin"), appCtrl.rejectApplication);
router.put("/:id/confirm-deposit", verifyTokenLogin, authorize("manager", "admin"), appCtrl.confirmDeposit);

module.exports = router;
