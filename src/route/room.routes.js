const express = require("express");
const router = express.Router();
const roomCtrl = require("../controllers/room.controller");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { uploadCccd } = upload;

// --- API CHO RENTER (KHÁCH TRỌ) ---
// Xem danh sách phòng trống
router.get("/available", verifyTokenLogin, authorize("user"), roomCtrl.getAvailableRoomsForTenant);
// Đăng ký thuê phòng (upload nhiều ảnh CCCD của người thuê chính và người ở ghép)
router.post("/:id/rent", verifyTokenLogin, authorize("user"), uploadCccd.any(), roomCtrl.rentRoom);
// Xem phòng của mình
router.get("/my-room", verifyTokenLogin, authorize("user"), roomCtrl.getMyRoom);
// Xem hóa đơn của mình
router.get("/my-invoices", verifyTokenLogin, authorize("user"), roomCtrl.getMyInvoices);
// Xem chi tiết 1 phòng (cho Renter)
router.get("/:id", verifyTokenLogin, authorize("user"), roomCtrl.getRoomById);

// --- API CHO MANAGER / ADMIN ---
// Thêm phòng mới
router.post("/", verifyTokenLogin, authorize("manager", "admin"), upload.array('images', 10), roomCtrl.createRoom);
// Lấy danh sách toàn bộ phòng
router.get("/", verifyTokenLogin, authorize("manager", "admin", "accountant"), roomCtrl.getAllRooms);
// Lấy danh sách khách thuê chưa được gán phòng
router.get("/available-tenants", verifyTokenLogin, authorize("manager", "admin"), roomCtrl.getAvailableTenants);
// Gán khách thuê vào phòng
router.put("/:id/assign", verifyTokenLogin, authorize("manager", "admin"), roomCtrl.assignTenant);
// Cập nhật thông tin phòng (Sửa phòng)
router.put("/:id", verifyTokenLogin, authorize("manager", "admin"), upload.array('images', 10), roomCtrl.updateRoom);
// Xóa phòng trọ
router.delete("/:id", verifyTokenLogin, authorize("manager", "admin"), roomCtrl.deleteRoom);
// Tính toán hoàn cọc khi hủy đặt phòng
router.post("/cancel-refund", verifyTokenLogin, authorize("manager", "admin"), roomCtrl.calculateRefund);
// Tính tiền phạt vi phạm & đền bù tài sản
router.post("/test-fine", verifyTokenLogin, authorize("manager", "admin"), roomCtrl.calculateFine);
// Đánh giá điểm tín nhiệm & gia hạn
router.post("/test-credit", verifyTokenLogin, authorize("manager", "admin"), roomCtrl.evaluateCredit);
// Tính lương nhân viên
router.post("/test-salary", verifyTokenLogin, authorize("manager", "admin"), roomCtrl.calculatePayroll);
// Dự toán cải tạo nâng cấp phòng
router.post("/test-renovation", verifyTokenLogin, authorize("manager", "admin"), roomCtrl.estimateRenovation);
// Nhập số liệu tiêu thụ và kết xuất hóa đơn tháng
router.post("/:id/invoice", verifyTokenLogin, authorize("manager", "admin"), roomCtrl.generateInvoice);

module.exports = router;
