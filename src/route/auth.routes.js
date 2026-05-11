const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");
const {
  registerRules,
  verifyOtpRules,
  forgotPasswordRules,
  resetPasswordRules,
} = require("../validations/register.validation");
const { validate } = require("../middlewares/validate.middleware");
const {
  registerLimiter,
  resendOtpLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  loginLimiter,
} = require("../middlewares/rateLimiter.middleware");
const { loginRules } = require("../validations/login.validation");

// POST /api/auth/register
router.post(
  "/register",
  registerLimiter,
  registerRules,
  validate,
  authCtrl.register,
);

// POST /api/auth/verify-otp
router.post("/verify-otp", verifyOtpRules, validate, authCtrl.verifyOtp);

// POST /api/auth/resend-otp
router.post("/resend-otp", resendOtpLimiter, authCtrl.resendOtp);

// POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordRules,
  validate,
  authCtrl.forgotPassword,
);

// POST /api/auth/reset-password
router.post(
  "/reset-password",
  resetPasswordLimiter,
  resetPasswordRules,
  validate,
  authCtrl.resetPassword,
);

// POST /api/auth/login
router.post("/login", loginLimiter, loginRules, validate, authCtrl.login);

// POST /api/auth/refresh
router.post("/refresh", authCtrl.refresh);

// POST /api/auth/logout
router.post("/logout", authCtrl.logout);

module.exports = router;
