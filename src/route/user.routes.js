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

module.exports = router;
