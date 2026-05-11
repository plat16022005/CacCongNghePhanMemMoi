const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const { editProfileRules } = require("../validations/user.validation");
const { validate } = require("../middlewares/validate.middleware");
const { verifyToken, authorize } = require("../middlewares/auth.middleware");

// PUT /api/user/profile
router.put(
  "/profile",
  verifyToken, // Lớp bảo mật: Authentication
  editProfileRules, // Lớp bảo mật: Input Validation
  validate,
  userCtrl.editProfile,
);

// GET /api/user/profile
router.get(
  "/profile",
  verifyToken,
  authorize("user", "admin"),
  userCtrl.getUserProfile,
);

// GET /api/admin/profile
router.get(
  "/admin/profile",
  verifyToken,
  authorize("admin"),
  userCtrl.getAdminProfile,
);

module.exports = router;
