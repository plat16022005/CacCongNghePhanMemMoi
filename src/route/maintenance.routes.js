const express = require("express");
const router = express.Router();
const maintenanceCtrl = require("../controllers/maintenance.controller");
const { verifyTokenLogin } = require("../middlewares/auth.middleware");

router.use(verifyTokenLogin);
// router.use(authorize('maintenance'));

// Dashboard & Stats
router.get("/dashboard", maintenanceCtrl.getDashboard);
router.get("/stats", maintenanceCtrl.getStats);

// Tasks
router.get("/tasks", maintenanceCtrl.getMyTasks);
router.get("/tasks/all", maintenanceCtrl.getAllTasks); // Requires manager + maintenance
router.get("/tasks/:id", maintenanceCtrl.getTaskById);
router.patch("/tasks/:id/accept", maintenanceCtrl.acceptTask);
router.patch("/tasks/:id/progress", maintenanceCtrl.updateTaskProgress);
router.patch("/tasks/:id/complete", maintenanceCtrl.completeTask);
router.patch("/tasks/:id/assign", maintenanceCtrl.assignTask); // Requires manager
router.get("/tasks/:id/history", maintenanceCtrl.getTaskHistory);

// Schedules
router.get("/schedule", maintenanceCtrl.getSchedules);
router.post("/schedule", maintenanceCtrl.createSchedule);
router.patch("/schedule/:id", maintenanceCtrl.updateSchedule);
router.patch("/schedule/:id/done", maintenanceCtrl.markScheduleDone);
router.delete("/schedule/:id", maintenanceCtrl.deleteSchedule);

module.exports = router;
