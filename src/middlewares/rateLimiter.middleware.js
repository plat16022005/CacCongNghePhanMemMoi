const rateLimit = require('express-rate-limit');

// Giới hạn 5 lần đăng ký trong 15 phút từ cùng IP
exports.registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Giới hạn gửi lại OTP: 3 lần / 10 phút
exports.resendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { message: 'Quá nhiều yêu cầu gửi OTP, thử lại sau 10 phút' },
});
