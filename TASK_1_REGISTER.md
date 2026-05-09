# 📋 TASK 1 — Chức năng Register

> **Thành viên phụ trách:** ___________________  
> **Branch:** `feature/register-<ten-thanh-vien>`  
> **Deadline:** ___________________

---

## 🎯 Mục tiêu

Xây dựng API đăng ký tài khoản gồm:
- ✅ Validation dữ liệu đầu vào (express-validator)
- ✅ Rate Limiting (chống spam đăng ký)
- ✅ Hash mật khẩu (bcryptjs)
- ✅ Gửi OTP kích hoạt qua email
- ✅ API xác thực OTP để kích hoạt tài khoản

---

## 📌 Endpoints cần implement

| Method | URL | Mô tả |
|--------|-----|-------|
| POST | `/api/auth/register` | Đăng ký, gửi OTP kích hoạt |
| POST | `/api/auth/verify-otp` | Nhập OTP để kích hoạt tài khoản |
| POST | `/api/auth/resend-otp` | Gửi lại OTP nếu hết hạn |

---

## 🏗️ Kiến trúc 3 tầng

```
Request → routes/auth.routes.js
        → middlewares/validate.middleware.js (validation + rate limit)
        → controllers/auth.controller.js    (Presentation tier)
        → services/auth.service.js          (Business Logic tier)
        → repositories/user.repository.js  (Data tier)
        → config/db.js (MySQL/MongoDB)
```

---

## 📝 Các bước thực hiện

### Bước 1: Tạo validation rules

Tạo file `src/validations/register.validation.js`:

```javascript
const { body } = require('express-validator');

exports.registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tên không được để trống')
    .isLength({ min: 2, max: 100 }).withMessage('Tên từ 2–100 ký tự'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')
    .matches(/[A-Z]/).withMessage('Mật khẩu cần có ít nhất 1 chữ hoa')
    .matches(/[0-9]/).withMessage('Mật khẩu cần có ít nhất 1 chữ số'),

  body('confirmPassword')
    .notEmpty().withMessage('Vui lòng xác nhận mật khẩu')
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error('Mật khẩu xác nhận không khớp');
      return true;
    }),
];

exports.verifyOtpRules = [
  body('email')
    .trim().isEmail().withMessage('Email không hợp lệ'),
  body('otp')
    .trim()
    .notEmpty().withMessage('OTP không được để trống')
    .isLength({ min: 6, max: 6 }).withMessage('OTP phải gồm 6 chữ số')
    .isNumeric().withMessage('OTP chỉ gồm chữ số'),
];
```

---

### Bước 2: Tạo middleware validate chung

Tạo file `src/middlewares/validate.middleware.js`:

```javascript
const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array().map(e => ({ field: e.path, msg: e.msg })),
    });
  }
  next();
};
```

---

### Bước 3: Tạo Rate Limiter cho Register

Tạo file `src/middlewares/rateLimiter.middleware.js`:

```javascript
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
```

---

### Bước 4: Tạo User Repository (Tầng Data)

Tạo file `src/repositories/user.repository.js`:

```javascript
const db = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

const createUser = async ({ name, email, password, role = 'user' }) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, 0)',
    [name, email, password, role]
  );
  return result.insertId;
};

const activateUser = async (email) => {
  await db.query('UPDATE users SET is_active = 1 WHERE email = ?', [email]);
};

const findById = async (id) => {
  const [rows] = await db.query('SELECT id, name, email, role, avatar, phone FROM users WHERE id = ?', [id]);
  return rows[0] || null;
};

module.exports = { findByEmail, createUser, activateUser, findById };
```

---

### Bước 5: Tạo Auth Service (Tầng Business Logic)

Tạo file `src/services/auth.service.js` — phần Register:

```javascript
const bcrypt       = require('bcryptjs');
const redis        = require('../config/redis');
const { sendMail } = require('../config/mailer');
const userRepo     = require('../repositories/user.repository');
const { generateOTP, hashOTP } = require('../utils/otp.util');
require('dotenv').config();

const OTP_EXPIRE = parseInt(process.env.OTP_EXPIRE_MINUTES || 5) * 60; // giây

// ─── REGISTER ────────────────────────────────────────────────────────────────
exports.register = async ({ name, email, password }) => {
  // 1. Kiểm tra email đã tồn tại chưa
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw { status: 409, message: 'Email đã được đăng ký' };
  }

  // 2. Hash mật khẩu
  const hashed = await bcrypt.hash(password, 12);

  // 3. Tạo user (chưa kích hoạt)
  await userRepo.createUser({ name, email, password: hashed });

  // 4. Tạo OTP và lưu Redis (dạng hash)
  const otp    = generateOTP();
  const hOtp   = hashOTP(otp);
  const redisKey = `otp:register:${email}`;
  await redis.setEx(redisKey, OTP_EXPIRE, hOtp);

  // 5. Gửi mail
  await sendMail({
    to:      email,
    subject: '🔐 Kích hoạt tài khoản của bạn',
    html: `
      <h2>Xin chào ${name}!</h2>
      <p>Mã OTP kích hoạt tài khoản của bạn là:</p>
      <h1 style="color:#2563eb;letter-spacing:8px">${otp}</h1>
      <p>Mã có hiệu lực trong <strong>${OTP_EXPIRE / 60} phút</strong>.</p>
      <p>Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
    `,
  });

  return { message: 'Đăng ký thành công! Vui lòng kiểm tra email để lấy OTP kích hoạt.' };
};

// ─── VERIFY OTP ──────────────────────────────────────────────────────────────
exports.verifyRegisterOtp = async ({ email, otp }) => {
  const redisKey = `otp:register:${email}`;
  const stored   = await redis.get(redisKey);

  if (!stored) {
    throw { status: 400, message: 'OTP đã hết hạn hoặc không tồn tại' };
  }

  const hOtp = hashOTP(otp);
  if (stored !== hOtp) {
    throw { status: 400, message: 'OTP không chính xác' };
  }

  // Kích hoạt tài khoản
  await userRepo.activateUser(email);

  // Xóa OTP khỏi Redis
  await redis.del(redisKey);

  return { message: 'Kích hoạt tài khoản thành công! Bạn có thể đăng nhập.' };
};

// ─── RESEND OTP ───────────────────────────────────────────────────────────────
exports.resendOtp = async ({ email }) => {
  const user = await userRepo.findByEmail(email);
  if (!user)      throw { status: 404, message: 'Email không tồn tại' };
  if (user.is_active) throw { status: 400, message: 'Tài khoản đã được kích hoạt' };

  const otp      = generateOTP();
  const hOtp     = hashOTP(otp);
  const redisKey = `otp:register:${email}`;
  await redis.setEx(redisKey, OTP_EXPIRE, hOtp);

  await sendMail({
    to:      email,
    subject: '🔐 Gửi lại mã OTP kích hoạt',
    html: `<h2>Mã OTP mới của bạn:</h2>
           <h1 style="color:#2563eb;letter-spacing:8px">${otp}</h1>
           <p>Hiệu lực trong <strong>${OTP_EXPIRE / 60} phút</strong>.</p>`,
  });

  return { message: 'Đã gửi lại OTP. Vui lòng kiểm tra email.' };
};
```

---

### Bước 6: Tạo Auth Controller (Tầng Presentation)

Tạo/thêm vào file `src/controllers/auth.controller.js`:

```javascript
const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    res.status(201).json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyRegisterOtp({ email, otp });
    res.status(200).json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.resendOtp({ email });
    res.status(200).json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
};
```

---

### Bước 7: Tạo Routes

Tạo file `src/routes/auth.routes.js` — phần Register:

```javascript
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
```

---

## 🧪 Test trên Postman

### Test 1: Đăng ký thành công
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "test@gmail.com",
  "password": "Password1",
  "confirmPassword": "Password1"
}
```
**Kết quả mong đợi:** `201` + message gửi OTP

---

### Test 2: Validation lỗi
```json
{ "name": "", "email": "invalid-email", "password": "123" }
```
**Kết quả mong đợi:** `400` + danh sách lỗi validation

---

### Test 3: Rate Limit (gửi 6 lần liên tiếp)
**Kết quả mong đợi:** lần thứ 6 trả về `429 Too Many Requests`

---

### Test 4: Xác thực OTP
```
POST http://localhost:3000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "test@gmail.com",
  "otp": "123456"
}
```
**Kết quả mong đợi:** `200` + message kích hoạt thành công

---

### Test 5: OTP sai
```json
{ "email": "test@gmail.com", "otp": "000000" }
```
**Kết quả mong đợi:** `400` OTP không chính xác

---

## ✅ Checklist hoàn thành

- [ ] Tạo xong file `register.validation.js`
- [ ] Tạo xong file `validate.middleware.js`
- [ ] Tạo xong file `rateLimiter.middleware.js`
- [ ] Tạo xong file `user.repository.js`
- [ ] Viết hàm `register`, `verifyRegisterOtp`, `resendOtp` trong service
- [ ] Tạo xong controller
- [ ] Tạo xong routes
- [ ] Test tất cả case trên Postman
- [ ] Commit đúng format lên Github cá nhân
- [ ] Tạo Pull Request vào Github nhóm

---

## 📤 Hướng dẫn commit & push

```bash
git checkout -b feature/register-<ten-ban>
git add .
git commit -m "feat(register): add validation, rate limiting, OTP email activation"
git push origin feature/register-<ten-ban>
```

Sau đó vào Github tạo Pull Request vào nhánh `main` của nhóm.
