const express  = require('express');
const router   = express.Router();
const authCtrl = require('../controllers/auth.controller');
const { registerRules, verifyOtpRules, forgotPasswordRules, resetPasswordRules } = require('../validations/register.validation');
const { validate }         = require('../middlewares/validate.middleware');
const { registerLimiter, resendOtpLimiter, forgotPasswordLimiter, resetPasswordLimiter } = require('../middlewares/rateLimiter.middleware');

// POST /api/auth/register
router.post('/register',
  registerLimiter,
  registerRules,
  validate,
  authCtrl.register
);

// POST /api/auth/verify-otp
router.post('/verify-otp',
  verifyOtpRules,
  validate,
  authCtrl.verifyOtp
);

// POST /api/auth/resend-otp
router.post('/resend-otp',
  resendOtpLimiter,
  authCtrl.resendOtp
);

// POST /api/auth/forgot-password
router.post('/forgot-password',
  forgotPasswordLimiter,
  forgotPasswordRules,
  validate,
  authCtrl.forgotPassword
);

// POST /api/auth/reset-password
router.post('/reset-password',
  resetPasswordLimiter,
  resetPasswordRules,
  validate,
  authCtrl.resetPassword
);

module.exports = router;
