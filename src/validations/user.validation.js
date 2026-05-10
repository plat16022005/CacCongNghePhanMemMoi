const { body } = require('express-validator');

exports.editProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Tên từ 2–100 ký tự')
    .escape(), // Chặn mã độc XSS
    
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Họ tối đa 50 ký tự')
    .escape(),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Tên tối đa 50 ký tự')
    .escape(),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Địa chỉ tối đa 200 ký tự')
    .escape(),

  body('phoneNumber')
    .optional()
    .trim()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/).withMessage('Số điện thoại không hợp lệ (phải là định dạng VN)')
    .escape(),

  body('gender')
    .optional()
    .isBoolean().withMessage('Giới tính phải là true/false'),
];
