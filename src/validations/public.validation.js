const { query, body } = require("express-validator");

exports.getApartmentsRules = [
  query("minPrice").optional().isInt({ min: 0 }).withMessage("minPrice phải là số nguyên dương"),
  query("maxPrice").optional().isInt({ min: 0 }).withMessage("maxPrice phải là số nguyên dương"),
  query("minArea").optional().isInt({ min: 0 }).withMessage("minArea phải là số nguyên dương"),
  query("maxArea").optional().isInt({ min: 0 }).withMessage("maxArea phải là số nguyên dương"),
  query("bedrooms").optional().isInt({ min: 0, max: 10 }).withMessage("bedrooms từ 0-10"),
  query("bathrooms").optional().isInt({ min: 0, max: 10 }).withMessage("bathrooms từ 0-10"),
  query("page").optional().isInt({ min: 1 }).withMessage("page phải lớn hơn 0"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit từ 1-50")
];

exports.createViewingRequestRules = [
  body("roomId").notEmpty().withMessage("Mã căn hộ là bắt buộc"),
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Họ tên không được để trống")
    .isLength({ max: 100 })
    .withMessage("Họ tên tối đa 100 ký tự"),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .matches(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
    .withMessage("Số điện thoại không hợp lệ"),
  body("preferredDate")
    .notEmpty()
    .withMessage("Ngày xem nhà là bắt buộc")
    .isISO8601()
    .withMessage("Định dạng ngày không hợp lệ")
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error("Ngày xem nhà không được ở trong quá khứ");
      }
      return true;
    }),
  body("preferredTimeSlot")
    .notEmpty()
    .withMessage("Khung giờ xem nhà là bắt buộc")
    .isIn(["morning", "afternoon", "evening"])
    .withMessage("Khung giờ không hợp lệ")
];
