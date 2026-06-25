const { body } = require('express-validator');

exports.guestRules = [
  body('visitDate')
    .notEmpty().withMessage('Ngày đến thăm là bắt buộc')
    .isISO8601().withMessage('Ngày không hợp lệ')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Ngày đến thăm phải trong tương lai');
      }
      return true;
    })
];

exports.parkingRules = [
  body('licensePlate')
    .notEmpty().withMessage('Biển số xe là bắt buộc')
    .matches(/^[0-9]{2}[A-Z]-[0-9]{4,5}$/i).withMessage('Biển số không hợp lệ (VD: 51A-12345)')
];

exports.feedbackRules = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Đánh giá phải từ 1 đến 5 sao')
];

exports.amenityBookingRules = [
  body('startTime').matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Giờ bắt đầu không hợp lệ (HH:mm)'),
  body('endTime').matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage('Giờ kết thúc không hợp lệ (HH:mm)')
];
