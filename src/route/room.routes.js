const express = require("express");
const router = express.Router();
const roomCtrl = require("../controllers/room.controller");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");

// --- API CHO RENTER (KHÁCH TRỌ) ---
// Xem danh sách phòng trống
router.get("/available", verifyTokenLogin, authorize("user"), roomCtrl.getAvailableRoomsForTenant);
// Đăng ký thuê phòng
router.post("/:id/rent", verifyTokenLogin, authorize("user"), roomCtrl.rentRoom);
// Xem phòng của mình
router.get("/my-room", verifyTokenLogin, authorize("user"), roomCtrl.getMyRoom);
// Xem hóa đơn của mình
router.get("/my-invoices", verifyTokenLogin, authorize("user"), roomCtrl.getMyInvoices);

// --- API CHO ADMIN ---
// Thêm phòng mới
router.post("/", verifyTokenLogin, authorize("admin"), roomCtrl.createRoom);
// Lấy danh sách toàn bộ phòng
router.get("/", verifyTokenLogin, authorize("admin"), roomCtrl.getAllRooms);
// Lấy danh sách khách thuê chưa được gán phòng
router.get("/available-tenants", verifyTokenLogin, authorize("admin"), roomCtrl.getAvailableTenants);
// Gán khách thuê vào phòng
router.put("/:id/assign", verifyTokenLogin, authorize("admin"), roomCtrl.assignTenant);
// Cập nhật thông tin phòng (Sửa phòng)
router.put("/:id", verifyTokenLogin, authorize("admin"), roomCtrl.updateRoom);
// Xóa phòng trọ
router.delete("/:id", verifyTokenLogin, authorize("admin"), roomCtrl.deleteRoom);
// Tính toán hoàn cọc khi hủy đặt phòng
router.post("/cancel-refund", verifyTokenLogin, authorize("admin"), roomCtrl.calculateRefund);
// Tính tiền phạt vi phạm & đền bù tài sản
router.post("/test-fine", verifyTokenLogin, authorize("admin"), roomCtrl.calculateFine);
// Đánh giá điểm tín nhiệm & gia hạn
router.post("/test-credit", verifyTokenLogin, authorize("admin"), roomCtrl.evaluateCredit);
// Tính lương nhân viên
router.post("/test-salary", verifyTokenLogin, authorize("admin"), roomCtrl.calculatePayroll);
// Dự toán cải tạo nâng cấp phòng
router.post("/test-renovation", verifyTokenLogin, authorize("admin"), roomCtrl.estimateRenovation);
// Nhập số liệu tiêu thụ và kết xuất hóa đơn tháng
router.post("/:id/invoice", verifyTokenLogin, authorize("admin"), roomCtrl.generateInvoice);

module.exports = router;
