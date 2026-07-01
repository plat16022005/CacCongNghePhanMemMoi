const multer = require("multer");
const path = require("path");

// Cấu hình lưu trữ
const storage = multer.memoryStorage(); // Hoặc diskStorage tùy chiến lược

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Định dạng file không được hỗ trợ (chỉ hỗ trợ JPG, PNG, WEBP, PDF)"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;
