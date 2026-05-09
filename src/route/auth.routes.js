const express  = require('express');
const router   = express.Router();
const authCtrl = require('../controllers/auth.controller');
const { registerRules, verifyOtpRules } = require('../validations/register.validation');
const { validate }         = require('../middlewares/validate.middleware');
const { registerLimiter, resendOtpLimiter } = require('../middlewares/rateLimiter.middleware');

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

module.exports = router;
