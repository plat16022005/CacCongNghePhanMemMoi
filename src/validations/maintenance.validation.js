const { body } = require('express-validator');

exports.createMaintenanceRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Tiêu đề không được để trống hoặc chỉ chứa khoảng trắng')
    .isLength({ max: 200 }).withMessage('Tiêu đề tối đa 200 ký tự'),

  body('description')
    .trim()
    .notEmpty().withMessage('Mô tả không được để trống')
    .isLength({ max: 5000 }).withMessage('Mô tả tối đa 5000 ký tự')
    .custom(value => {
      // Basic check to prevent excessive emojis or unprintable characters (optional basic strip)
      const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      if ((value.match(emojiRegex) || []).length > 10) {
        throw new Error('Mô tả chứa quá nhiều ký tự đặc biệt/emoji');
      }
      return true;
    }),

  body('issueType')
    .notEmpty().withMessage('Loại sự cố là bắt buộc')
];
