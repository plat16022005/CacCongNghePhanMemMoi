const express = require("express");
const router = express.Router();
const roomCtrl = require("../controllers/room.controller");
const { verifyTokenLogin, authorize } = require("../middlewares/auth.middleware");

// --- API CHO RENTER (KHÁCH TRỌ) ---
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
// Nhập số liệu tiêu thụ và kết xuất hóa đơn tháng
router.post("/:id/invoice", verifyTokenLogin, authorize("admin"), roomCtrl.generateInvoice);

module.exports = router;
