const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const { editProfileRules } = require("../validations/user.validation");
const { validate } = require("../middlewares/validate.middleware");
const {
  verifyToken,
  authorize,
  verifyTokenLogin,
} = require("../middlewares/auth.middleware");

// PUT /api/user/profile
router.put(
  "/profile",
  verifyTokenLogin,
  editProfileRules,
  validate,
  userCtrl.editProfile,
);

// GET /api/user/profile
router.get(
  "/profile",
  verifyTokenLogin,
  authorize("user", "admin"),
  userCtrl.getUserProfile,
);

// GET /api/manager/profile
router.get(
  "/manager/profile",
  verifyTokenLogin,
  authorize("manager"),
  userCtrl.getManagerProfile,
);

// Admin dashboard APIs
router.get(
  "/admin/users",
  verifyTokenLogin,
  authorize("admin"),
  userCtrl.getAllUsers,
);

router.put(
  "/admin/users/:id/role",
  verifyTokenLogin,
  authorize("admin"),
  userCtrl.updateUserRole,
);

router.put(
  "/admin/users/:id/status",
  verifyTokenLogin,
  authorize("admin"),
  userCtrl.toggleUserStatus,
);

router.post(
  "/admin/users/manager",
  verifyTokenLogin,
  authorize("admin"),
  userCtrl.createManagerUser,
);

router.get(
  "/admin/stats",
  verifyTokenLogin,
  authorize("admin"),
  userCtrl.getAdminDashboardStats,
);

module.exports = router;
