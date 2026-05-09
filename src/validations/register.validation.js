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
