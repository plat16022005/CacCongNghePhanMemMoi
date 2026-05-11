const rateLimit = require("express-rate-limit");

// Giới hạn 5 lần đăng ký trong 15 phút từ cùng IP
exports.registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút" },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Quá nhiều yêu cầu đăng nhập, thử lại sau 15 phút" },
});

// Giới hạn gửi lại OTP: 3 lần / 10 phút
exports.resendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { message: "Quá nhiều yêu cầu gửi OTP, thử lại sau 10 phút" },
});

// Giới hạn quên mật khẩu: 3 lần / 15 phút
exports.forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "Quá nhiều yêu cầu quên mật khẩu, thử lại sau 15 phút" },
});

// Giới hạn đổi mật khẩu (nhập sai OTP nhiều lần): 5 lần / 15 phút
exports.resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Quá nhiều yêu cầu đổi mật khẩu, thử lại sau 15 phút" },
});
