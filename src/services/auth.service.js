const bcrypt = require("bcryptjs");
const { sendMail } = require("../config/mailer");
const userRepo = require("../repositories/user.repository");
const { generateOTP, hashOTP } = require("../utils/otp.util");
require("dotenv").config();

const otpCache = new Map();
const OTP_EXPIRE = parseInt(process.env.OTP_EXPIRE_MINUTES || 5) * 60; // giây

// ─── REGISTER ────────────────────────────────────────────────────────────────
exports.register = async ({ name, email, password }) => {
  // 1. Kiểm tra email đã tồn tại chưa
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw { status: 409, message: "Email đã được đăng ký" };
  }

  // 2. Hash mật khẩu
  const hashed = await bcrypt.hash(password, 12);

  // 3. Tạo user (chưa kích hoạt)
  await userRepo.createUser({ name, email, password: hashed });

  // 4. Tạo OTP và lưu vào bộ nhớ tạm (Map)
  const otp = generateOTP();
  const hOtp = hashOTP(otp);

  otpCache.set(email, {
    otp: hOtp,
    expiresAt: Date.now() + OTP_EXPIRE * 1000,
  });

  // 5. Gửi mail
  await sendMail({
    to: email,
    subject: "🔐 Kích hoạt tài khoản của bạn",
    html: `
      <h2>Xin chào ${name}!</h2>
      <p>Mã OTP kích hoạt tài khoản của bạn là:</p>
      <h1 style="color:#2563eb;letter-spacing:8px">${otp}</h1>
      <p>Mã có hiệu lực trong <strong>${OTP_EXPIRE / 60} phút</strong>.</p>
      <p>Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
    `,
  });

  return {
    message:
      "Đăng ký thành công! Vui lòng kiểm tra email để lấy OTP kích hoạt.",
  };
};

// ─── VERIFY OTP ──────────────────────────────────────────────────────────────
exports.verifyRegisterOtp = async ({ email, otp }) => {
  const cached = otpCache.get(email);

  if (!cached || Date.now() > cached.expiresAt) {
    if (cached) otpCache.delete(email); // Xóa nếu hết hạn
    throw { status: 400, message: "OTP đã hết hạn hoặc không tồn tại" };
  }

  const hOtp = hashOTP(otp);
  if (cached.otp !== hOtp) {
    throw { status: 400, message: "OTP không chính xác" };
  }

  // Kích hoạt tài khoản
  await userRepo.activateUser(email);

  // Xóa OTP khỏi Map
  otpCache.delete(email);

  return { message: "Kích hoạt tài khoản thành công! Bạn có thể đăng nhập." };
};

// ─── RESEND OTP ───────────────────────────────────────────────────────────────
exports.resendOtp = async ({ email }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw { status: 404, message: "Email không tồn tại" };
  if (user.is_active)
    throw { status: 400, message: "Tài khoản đã được kích hoạt" };

  const otp = generateOTP();
  const hOtp = hashOTP(otp);

  otpCache.set(email, {
    otp: hOtp,
    expiresAt: Date.now() + OTP_EXPIRE * 1000,
  });

  await sendMail({
    to: email,
    subject: "🔐 Gửi lại mã OTP kích hoạt",
    html: `<h2>Mã OTP mới của bạn:</h2>
           <h1 style="color:#2563eb;letter-spacing:8px">${otp}</h1>
           <p>Hiệu lực trong <strong>${OTP_EXPIRE / 60} phút</strong>.</p>`,
  });

  return { message: "Đã gửi lại OTP. Vui lòng kiểm tra email." };
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
exports.forgotPassword = async ({ email }) => {
  const user = await userRepo.findByEmail(email);
  if (!user)
    throw { status: 404, message: "Email không tồn tại trong hệ thống" };

  const otp = generateOTP();
  const hOtp = hashOTP(otp);

  otpCache.set(email + "_reset", {
    otp: hOtp,
    expiresAt: Date.now() + OTP_EXPIRE * 1000,
  });

  await sendMail({
    to: email,
    subject: "🔐 Lấy lại mật khẩu",
    html: `
      <h2>Xin chào ${user.name || "bạn"}!</h2>
      <p>Mã OTP để đặt lại mật khẩu của bạn là:</p>
      <h1 style="color:#2563eb;letter-spacing:8px">${otp}</h1>
      <p>Mã có hiệu lực trong <strong>${OTP_EXPIRE / 60} phút</strong>.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `,
  });

  return { message: "Mã OTP đặt lại mật khẩu đã được gửi đến email." };
};

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────
exports.resetPassword = async ({ email, otp, newPassword }) => {
  const cacheKey = email + "_reset";
  const cached = otpCache.get(cacheKey);

  if (!cached || Date.now() > cached.expiresAt) {
    if (cached) otpCache.delete(cacheKey);
    throw { status: 400, message: "Mã OTP đã hết hạn hoặc không tồn tại" };
  }

  const hOtp = hashOTP(otp);
  if (cached.otp !== hOtp) {
    throw { status: 400, message: "Mã OTP không chính xác" };
  }

  const user = await userRepo.findByEmail(email);
  if (!user) throw { status: 404, message: "Tài khoản không tồn tại" };

  const hashed = await bcrypt.hash(newPassword, 12);
  await userRepo.updatePassword(email, hashed);

  // Xóa OTP khỏi Map
  otpCache.delete(cacheKey);

  return { message: "Đặt lại mật khẩu thành công!" };
};

const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt.util");

// ─── LOGIN ───────────────────────────────────────────────────────────────────
exports.login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw { status: 401, message: "Email hoặc mật khẩu không đúng" };
  if (!user.is_active)
    throw {
      status: 403,
      message: "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email.",
    };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw { status: 401, message: "Email hoặc mật khẩu không đúng" };

  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user.id });

  return { accessToken, refreshToken };
};

// ─── REFRESH TOKEN ───────────────────────────────────────────────────────────
exports.refreshToken = async (refreshToken) => {
  if (!refreshToken) throw { status: 401, message: "Không có refresh token" };

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw {
      status: 403,
      message: "Refresh token không hợp lệ hoặc đã hết hạn",
    };
  }

  const user = await userRepo.findById(decoded.id);
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };

  const payload = { id: user.id, email: user.email, role: user.role };
  const newAccess = generateAccessToken(payload);
  const newRefresh = generateRefreshToken({ id: user.id });

  return { newAccess, newRefresh };
};

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
exports.logout = async (refreshToken) => {};
