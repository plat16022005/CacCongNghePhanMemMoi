const { body } = require('express-validator');

exports.editProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Tên phải từ 2 đến 100 ký tự'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Họ tối đa 50 ký tự'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Tên tối đa 50 ký tự'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Địa chỉ tối đa 300 ký tự'),

  body('phoneNumber')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(84|0[35789])[0-9]{8}$/).withMessage('Số điện thoại không hợp lệ (VD: 0912345678)'),

  body('gender')
    .optional({ checkFalsy: true })
    .isIn(['male', 'female', 'other']).withMessage('Giới tính không hợp lệ'),

  body('dob')
    .optional({ checkFalsy: true })
    .trim(),

  body('occupation')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Nghề nghiệp tối đa 100 ký tự'),

  body('cccdNumber')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9]{12}$/).withMessage('Số CCCD phải là 12 chữ số'),
];
