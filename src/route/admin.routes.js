const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin.controller");
const { verifyTokenLogin } = require("../middlewares/auth.middleware");
const { logActivity } = require("../middlewares/activity.logger.middleware");

// Require auth
router.use(verifyTokenLogin);
// Require admin role
// router.use(authorize('admin')); // Uncomment when role middleware is ready

// Dashboard
router.get("/dashboard", adminCtrl.getDashboard);

// Users
router.get("/users", adminCtrl.getUsers);
router.get("/users/:id", adminCtrl.getUserById);
router.post("/users", logActivity("user_create"), adminCtrl.createUser);
router.patch("/users/:id", adminCtrl.updateUser);
router.patch("/users/:id/role", logActivity("role_change"), adminCtrl.changeRole);
router.patch("/users/:id/status", logActivity("status_change"), adminCtrl.changeStatus);
router.post("/users/:id/reset-password", logActivity("password_reset"), adminCtrl.resetPassword);

// Buildings
router.get("/buildings", adminCtrl.getBuildings);
router.post("/buildings", logActivity("building_create"), adminCtrl.createBuilding);
router.patch("/buildings/:id", adminCtrl.updateBuilding);
router.delete("/buildings/:id", logActivity("building_delete"), adminCtrl.deleteBuilding);
router.get("/buildings/:id/blocks", adminCtrl.getBlocks);
router.post("/buildings/:id/blocks", adminCtrl.addBlock);

// Config
router.get("/config", adminCtrl.getConfig);
router.patch("/config", logActivity("config_update"), adminCtrl.updateConfig);

// Logs
router.get("/logs", adminCtrl.getLogs);
router.get("/logs/user/:userId", adminCtrl.getLogsByUser);

module.exports = router;
