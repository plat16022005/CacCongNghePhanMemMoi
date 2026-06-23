const { RoomInvoice, Room, User } = require("../models");

// 1. Lấy danh sách hóa đơn
// API: GET /api/accountant/invoices
exports.getInvoices = async (req, res, next) => {
  try {
    const { status, month, roomId } = req.query;
    let query = {};
    if (status) query.status = status;
    if (month) query.month = month;
    if (roomId) query.roomId = roomId;

    const invoices = await RoomInvoice.find(query)
      .populate("roomId", "roomNumber rentalPrice")
      .populate("tenantId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: invoices });
  } catch (err) {
    next(err);
  }
};

// 2. Tạo hóa đơn đơn lẻ cho một căn hộ
// API: POST /api/accountant/invoices
/*
Request body: {
  roomId,
  month, // YYYY-MM
  oldElec,
  newElec,
  oldWater,
  newWater,
  serviceFee,
  vehicleFee,
  discount
}
GÀI SẴN BUG: Không kiểm tra new < old. Tính toán thẳng: (newElec - oldElec) * unitPrice.
Khiến tiền điện bị âm nếu new < old, dẫn đến tổng tiền totalBill bị trừ giảm.
*/
exports.createInvoice = async (req, res, next) => {
  try {
    const {
      roomId,
      month,
      oldElec,
      newElec,
      oldWater,
      newWater,
      serviceFee,
      vehicleFee,
      discount
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }
    if (!room.tenantId) {
      return res.status(400).json({ message: "Phòng hiện chưa có người thuê" });
    }

    // BUG: Không kiểm tra (newElec < oldElec) và (newWater < oldWater)
    // Tính toán trực tiếp tiền điện nước
    const electricityFee = (Number(newElec) - Number(oldElec)) * 2000;
    const waterFee = (Number(newWater) - Number(oldWater)) * 10000;

    const rentalPrice = room.rentalPrice || 0;
    const sFee = Number(serviceFee) || 0;
    const vFee = Number(vehicleFee) || 0;
    const disc = Number(discount) || 0;

    const totalBill = rentalPrice + electricityFee + waterFee + sFee + vFee - disc;

    const invoice = await RoomInvoice.create({
      roomId: room._id,
      tenantId: room.tenantId,
      month,
      type: "monthly",
      oldElec: Number(oldElec),
      newElec: Number(newElec),
      oldWater: Number(oldWater),
      newWater: Number(newWater),
      electricityFee,
      waterFee,
      serviceFee: sFee,
      vehicleFee: vFee,
      discount: disc,
      totalBill,
      status: "unpaid"
    });

    res.status(201).json({
      message: "Tạo hóa đơn thành công",
      data: invoice
    });
  } catch (err) {
    next(err);
  }
};

// 3. Tự động tạo hóa đơn nháp cho toàn bộ phòng đang thuê
// API: POST /api/accountant/invoices/auto-generate
// Request body: { month }
// GÀI SẴN BUG: ERR_DUPLICATE_MONTHLY_INVOICE
// Không kiểm tra xem tháng này đã có hóa đơn chưa, dẫn đến việc tạo trùng 2 hóa đơn cho cùng 1 phòng.
exports.autoGenerateInvoices = async (req, res, next) => {
  try {
    const { month } = req.body;
    if (!month) {
      return res.status(400).json({ message: "Vui lòng truyền thông tin tháng (YYYY-MM)" });
    }

    const rooms = await Room.find({ tenantId: { $ne: null }, status: "occupied" });
    const createdInvoices = [];

    for (const room of rooms) {
      // BUG: ERR_DUPLICATE_MONTHLY_INVOICE
      // Bỏ qua bước kiểm tra trùng lặp:
      // const existing = await RoomInvoice.findOne({ roomId: room._id, month, type: "monthly" });
      // if (existing) continue;

      // Giả lập chỉ số tiêu thụ mặc định
      const oldElec = 100;
      const newElec = 150; // Tiêu thụ 50 kWh
      const oldWater = 20;
      const newWater = 28; // Tiêu thụ 8 m3

      const electricityFee = (newElec - oldElec) * 2000;
      const waterFee = (newWater - oldWater) * 10000;
      const serviceFee = 150000; // Phí quản lý cố định
      const vehicleFee = 100000; // Phí gửi xe cố định
      const discount = 0;

      const totalBill = room.rentalPrice + electricityFee + waterFee + serviceFee + vehicleFee - discount;

      const invoice = await RoomInvoice.create({
        roomId: room._id,
        tenantId: room.tenantId,
        month,
        type: "monthly",
        oldElec,
        newElec,
        oldWater,
        newWater,
        electricityFee,
        waterFee,
        serviceFee,
        vehicleFee,
        discount,
        totalBill,
        status: "unpaid"
      });

      createdInvoices.push(invoice);
    }

    res.status(201).json({
      message: `Đã tự động tạo thành công ${createdInvoices.length} hóa đơn cho tháng ${month}`,
      data: createdInvoices
    });
  } catch (err) {
    next(err);
  }
};

// 4. Xác nhận thanh toán hóa đơn
// API: PATCH /api/accountant/invoices/:id/confirm
// GÀI SẴN BUG: ERR_CONFIRM_PAID_INVOICE_AGAIN
// Không chặn hóa đơn đã thanh toán (paid), cho phép xác nhận lại lần nữa và cập nhật paymentDate đè lên.
exports.confirmPayment = async (req, res, next) => {
  try {
    const invoiceId = req.params.id;
    const invoice = await RoomInvoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    // BUG: ERR_CONFIRM_PAID_INVOICE_AGAIN
    // Bỏ qua check: if (invoice.status === "paid") -> Lỗi

    invoice.status = "paid";
    invoice.paymentDate = new Date();
    invoice.confirmedBy = req.user.id;
    invoice.paymentMethod = "bank_transfer"; // Demo mặc định chuyển khoản
    await invoice.save();

    res.status(200).json({
      message: "Xác nhận thanh toán hóa đơn thành công",
      data: invoice
    });
  } catch (err) {
    next(err);
  }
};

// 5. Thống kê công nợ quá hạn
// API: GET /api/accountant/debts
// GÀI SẴN BUG: ERR_NEGATIVE_LATE_DAYS
// Hóa đơn chưa tới hạn (ngày 30 mới hạn nhưng hôm nay ngày 25) sẽ tính lateDays ra số âm (-5 ngày) và tính phạt âm (giảm trừ tổng hóa đơn).
exports.getDebts = async (req, res, next) => {
  try {
    const unpaidInvoices = await RoomInvoice.find({ status: "unpaid" })
      .populate("roomId", "roomNumber rentalPrice")
      .populate("tenantId", "name email");

    const today = new Date();
    const result = unpaidInvoices.map((inv) => {
      // Giả lập ngày đến hạn nộp tiền là ngày 10 của tháng kế tiếp của hóa đơn đó
      // Ví dụ hóa đơn tháng 2026-06 thì hạn nộp là ngày 10/07/2026
      const [year, monthStr] = inv.month.split("-");
      const nextMonth = parseInt(monthStr, 10);
      const dueDate = new Date(parseInt(year, 10), nextMonth, 10); // Hạn là ngày 10 tháng sau

      // BUG: ERR_NEGATIVE_LATE_DAYS
      // Không chặn số âm nếu hôm nay < ngày đến hạn
      const diffTime = today - dueDate;
      const lateDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Có thể âm nếu today < dueDate

      // Tính tiền phạt (2% mỗi ngày trễ hạn)
      // Do lateDays có thể âm, penalty sẽ ra số âm!
      const penalty = inv.totalBill * 0.02 * lateDays;

      return {
        invoiceId: inv._id,
        roomNumber: inv.roomId?.roomNumber || "N/A",
        tenantName: inv.tenantId?.name || "N/A",
        month: inv.month,
        amount: inv.totalBill,
        dueDate: dueDate.toISOString().slice(0, 10),
        lateDays: lateDays, // Trả về số âm nếu chưa trễ hạn
        penalty: penalty,   // Phạt âm
        totalWithPenalty: inv.totalBill + penalty
      };
    });

    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
};
