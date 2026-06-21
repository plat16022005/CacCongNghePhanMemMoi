const { RentalApplication, Room, User } = require("../models");

exports.getAllApplications = async (req, res, next) => {
  try {
    const applications = await RentalApplication.find()
      .populate("tenantId", "name email phoneNumber cccdNumber dob cccdFrontImage cccdBackImage")
      .populate("roomId", "roomNumber rentalPrice floor area")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ data: applications });
  } catch (err) {
    next(err);
  }
};

exports.approveApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const application = await RentalApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Đơn thuê không tồn tại" });
    }
    
    if (application.status !== "pending") {
      return res.status(400).json({ message: "Đơn thuê này đã được xử lý" });
    }

    const room = await Room.findById(application.roomId);
    if (!room) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }
    if (room.tenantId || room.status !== "available") {
      return res.status(400).json({ message: "Phòng này đã có người thuê hoặc không khả dụng" });
    }

    // Chuyển phòng sang trạng thái đã đặt cọc (reserved)
    room.status = "reserved";
    await room.save();

    // Duyệt đơn -> chuyển thành chờ cọc
    application.status = "approved";
    await application.save();

    // Tạo hóa đơn tiền cọc
    const { RoomInvoice } = require("../models");
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    await RoomInvoice.create({
      roomId: application.roomId,
      tenantId: application.tenantId,
      month: currentMonth,
      type: "deposit",
      totalBill: room.depositAmount || 0,
      status: "unpaid"
    });

    res.status(200).json({ message: "Duyệt đơn thành công. Đã tạo hóa đơn tiền cọc.", data: application });
  } catch (err) {
    next(err);
  }
};

exports.confirmDeposit = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const application = await RentalApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Đơn thuê không tồn tại" });
    }
    
    if (application.status !== "approved") {
      return res.status(400).json({ message: "Đơn thuê chưa được duyệt hoặc đã hoàn tất" });
    }

    const room = await Room.findById(application.roomId);
    if (!room) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }

    const { RoomInvoice } = require("../models");
    const depositInvoice = await RoomInvoice.findOne({
      roomId: application.roomId,
      tenantId: application.tenantId,
      type: "deposit",
      status: "unpaid"
    });

    if (depositInvoice) {
      depositInvoice.status = "paid";
      await depositInvoice.save();
    }

    // Gán phòng cho người thuê
    room.tenantId = application.tenantId;
    room.members = application.members || [];
    room.status = "occupied";
    await room.save();

    // Hoàn tất đơn
    application.status = "completed";
    await application.save();

    // Hủy các đơn pending khác cho cùng phòng này
    await RentalApplication.updateMany(
      { roomId: application.roomId, status: "pending", _id: { $ne: application._id } },
      { $set: { status: "rejected" } }
    );

    res.status(200).json({ message: "Đã xác nhận tiền cọc và gán phòng thành công", data: application });
  } catch (err) {
    next(err);
  }
};

exports.rejectApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const application = await RentalApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Đơn thuê không tồn tại" });
    }
    
    if (application.status !== "pending" && application.status !== "approved") {
      return res.status(400).json({ message: "Đơn thuê này đã được xử lý hoàn tất hoặc đã bị từ chối" });
    }

    if (application.status === "approved") {
      // Đơn đang chờ cọc -> Khôi phục lại phòng
      const room = await Room.findById(application.roomId);
      if (room && room.status === "reserved") {
        room.status = "available";
        await room.save();
      }

      // Hủy/xóa hóa đơn cọc
      const { RoomInvoice } = require("../models");
      await RoomInvoice.findOneAndDelete({
        roomId: application.roomId,
        tenantId: application.tenantId,
        type: "deposit",
        status: "unpaid"
      });
    }

    application.status = "rejected";
    await application.save();

    res.status(200).json({ message: "Đã hủy/từ chối đơn thuê", data: application });
  } catch (err) {
    next(err);
  }
};
