const express = require("express");
const router = express.Router();
const maintenanceCtrl = require("../controllers/maintenance.controller");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");

// Tất cả các API yêu cầu đăng nhập và có role 'maintenance'
router.use(verifyTokenLogin, authorize("maintenance"));

// Quản lý yêu cầu sửa chữa
router.get("/requests", maintenanceCtrl.getRequests);
router.patch("/requests/:id/status", maintenanceCtrl.claimRequest);
router.patch("/executions/:id/update", maintenanceCtrl.updateProgress);
router.patch("/executions/:id/complete", maintenanceCtrl.completeRepair);

// Quản lý thiết bị & lịch bảo trì
router.get("/assets", maintenanceCtrl.getAssets);
router.get("/schedules", maintenanceCtrl.getSchedules);
router.post("/schedules", maintenanceCtrl.createSchedule);

module.exports = router;
