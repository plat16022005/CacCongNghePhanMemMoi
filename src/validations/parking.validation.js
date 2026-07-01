const { body } = require('express-validator');

exports.createParkingRules = [
  body('vehicleType')
    .notEmpty().withMessage('Loại xe là bắt buộc')
    .isIn(['motorbike', 'car', 'bicycle']).withMessage('Loại xe không hợp lệ (motorbike, car, bicycle)'),

  body('licensePlate')
    .notEmpty().withMessage('Biển số xe là bắt buộc')
    .trim()
    .isLength({ max: 15 }).withMessage('Biển số tối đa 15 ký tự')
    .matches(/^[0-9]{2}[A-Z0-9]{1,2}[-\s]?[0-9]{4,5}$/).withMessage('Biển số xe không hợp lệ (VD: 59A-12345)'),

  body('vehicleBrand')
    .notEmpty().withMessage('Hãng xe là bắt buộc')
    .trim(),

  body('vehicleColor')
    .notEmpty().withMessage('Màu xe là bắt buộc')
    .trim()
];

exports.updateParkingRules = [
  body('vehicleColor')
    .optional()
    .trim()
    .notEmpty().withMessage('Màu xe không được để trống'),
    
  body('licensePlate')
    .optional()
    .trim()
    .notEmpty().withMessage('Biển số xe không được để trống')
    .isLength({ max: 15 }).withMessage('Biển số tối đa 15 ký tự')
    .matches(/^[0-9]{2}[A-Z0-9]{1,2}[-\s]?[0-9]{4,5}$/).withMessage('Biển số xe không hợp lệ (VD: 59A-12345)')
];
