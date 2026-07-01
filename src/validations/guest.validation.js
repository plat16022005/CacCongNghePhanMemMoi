const { body } = require('express-validator');

exports.createGuestRules = [
  body('guestName')
    .notEmpty().withMessage('Tên khách không được để trống')
    .trim()
    .matches(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/)
    .withMessage('Tên khách không được chứa số hoặc ký tự đặc biệt'),

  body('cccd')
    .notEmpty().withMessage('CCCD là trường bắt buộc')
    .trim()
    .matches(/^[0-9]{12}$/).withMessage('Số CCCD phải là 12 chữ số'),

  body('phone')
    .notEmpty().withMessage('Số điện thoại là bắt buộc')
    .customSanitizer(value => {
      // Remove spaces and dashes
      return value.replace(/[\s-]/g, '');
    })
    .matches(/^(84|0[35789])[0-9]{8}$/).withMessage('Số điện thoại không hợp lệ'),

  body('visitDate')
    .notEmpty().withMessage('Ngày đến là bắt buộc')
    .isISO8601().withMessage('Ngày đến không đúng định dạng'),

  body('numberOfGuests')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Số lượng khách phải từ 1 đến 10 người')
];
