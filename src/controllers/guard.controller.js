const { Guest, GuestAccessLog, ParkingRegistration, SecurityIncident, User } = require("../models");

// 1. Xem danh sách khách đăng ký
// API: GET /api/guard/guests
exports.getGuests = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) {
      query.status = status;
    }

    const guests = await Guest.find(query)
      .populate({
        path: "residentId",
        select: "name phoneNumber room",
        populate: {
          path: "room",
          select: "roomNumber floor"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ data: guests });
  } catch (err) {
    next(err);
  }
};

// 2. Quét mã QR khách thăm
// API: POST /api/guard/guests/scan-qr
// Request body: { qrCodeToken }
exports.scanQr = async (req, res, next) => {
  try {
    const { qrCodeToken } = req.body;
    if (!qrCodeToken) {
      return res.status(400).json({ message: "Thiếu mã QR token" });
    }

    // Tìm kiếm log dựa trên QR Code Token
    const log = await GuestAccessLog.findOne({ qrCodeToken }).populate({
      path: "guestId",
      populate: {
        path: "residentId",
        select: "name phoneNumber"
      }
    });

    if (!log) {
      return res.status(404).json({ message: "Mã QR không hợp lệ hoặc không tồn tại trong hệ thống" });
    }

    res.status(200).json({
      message: "Quét QR thành công",
      data: {
        logId: log._id,
        guestId: log.guestId._id,
        guestName: log.guestId.guestName,
        phone: log.guestId.phone,
        cccd: log.guestId.cccd,
        visitDate: log.guestId.visitDate,
        leaveDate: log.guestId.leaveDate,
        reason: log.guestId.reason,
        status: log.guestId.status,
        actualCheckIn: log.actualCheckIn,
        actualCheckOut: log.actualCheckOut,
        residentName: log.guestId.residentId?.name || "N/A"
      }
    });
  } catch (err) {
    next(err);
  }
};

// 3. Xác nhận khách vào cổng (Check-in)
// API: POST /api/guard/guests/:id/checkin
// GÀI SẴN BUG: Nếu click đúp (hoặc bấm liên tục), hệ thống KHÔNG kiểm tra xem trạng thái đã là arrived chưa,
// mà sẽ ghi đè và tạo thêm bản ghi mới trong GuestAccessLog hoặc cho phép lưu trùng lặp.
exports.checkinGuest = async (req, res, next) => {
  try {
    const guestId = req.params.id;
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ message: "Không tìm thấy khách đăng ký" });
    }

    // BUG: Không kiểm tra if (guest.status === 'arrived') mà trực tiếp chuyển tiếp và tạo log mới
    // Việc này gây ra trùng lặp GuestAccessLog nếu bấm đúp.
    
    guest.status = "arrived";
    await guest.save();

    // Tạo bản ghi log mới (nếu bấm đúp sẽ sinh ra 2 bản ghi cho cùng 1 guestId)
    const qrToken = `QR_${guestId}_${Date.now()}`;
    const newLog = await GuestAccessLog.create({
      guestId: guest._id,
      qrCodeToken: qrToken,
      actualCheckIn: new Date(),
      verifiedBy: req.user.id,
      notes: "Check-in bởi bảo vệ"
    });

    res.status(200).json({
      message: "Xác nhận khách vào thành công",
      data: {
        guest,
        log: newLog
      }
    });
  } catch (err) {
    next(err);
  }
};

// 4. Xác nhận khách ra cổng (Check-out)
// API: POST /api/guard/guests/:id/checkout
// GÀI SẴN BUG: ERR_CHECKOUT_WITHOUT_CHECKIN
// Cho phép bấm checkout trực tiếp khi khách ở trạng thái 'approved' (chưa quét vào).
// Cập nhật thẳng sang 'left' mà không báo lỗi.
exports.checkoutGuest = async (req, res, next) => {
  try {
    const guestId = req.params.id;
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ message: "Không tìm thấy khách đăng ký" });
    }

    // BUG: ERR_CHECKOUT_WITHOUT_CHECKIN
    // Đáng lẽ phải chặn: if (guest.status !== "arrived") -> Lỗi
    // Nhưng hệ thống cho phép checkout từ bất kỳ trạng thái nào (kể cả pending, approved)
    guest.status = "left";
    await guest.save();

    // Tìm access log để cập nhật checkout, nếu không thấy thì tạo bừa
    let log = await GuestAccessLog.findOne({ guestId: guest._id }).sort({ createdAt: -1 });
    if (log) {
      log.actualCheckOut = new Date();
      await log.save();
    } else {
      // Trường hợp chưa check-in mà vẫn checkout -> tạo bừa một log checkout
      log = await GuestAccessLog.create({
        guestId: guest._id,
        qrCodeToken: `QR_OUT_${guestId}_${Date.now()}`,
        actualCheckOut: new Date(),
        verifiedBy: req.user.id,
        notes: "Checkout khẩn cấp (chưa check-in)"
      });
    }

    res.status(200).json({
      message: "Xác nhận khách ra thành công",
      data: {
        guest,
        log
      }
    });
  } catch (err) {
    next(err);
  }
};

// 5. Tìm kiếm kiểm tra xe gửi
// API: GET /api/guard/vehicles
// Query params: ?licensePlate=59U1-12345
// GÀI SẴN BUG: ERR_CASE_SENSITIVE_LICENSE_PLATE
// Khi tìm kiếm bằng chữ thường (59u1-12345), hệ thống không chuẩn hóa mà tìm trực tiếp, dẫn đến không tìm thấy dữ liệu.
exports.checkVehicle = async (req, res, next) => {
  try {
    const { licensePlate } = req.query;
    if (!licensePlate) {
      return res.status(400).json({ message: "Vui lòng nhập biển số xe" });
    }

    // BUG: ERR_CASE_SENSITIVE_LICENSE_PLATE
    // Thay vì dùng regex không phân biệt chữ hoa thường (i) hoặc chuyển toUpperCase(),
    // hệ thống tìm kiếm chính xác chuỗi nhập vào:
    const vehicle = await ParkingRegistration.findOne({
      licensePlate: licensePlate, // Không có case-insensitive
      status: "approved"
    }).populate("residentId", "name phoneNumber");

    if (!vehicle) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin đăng ký xe hợp lệ cho biển số này. Lưu ý: Cần nhập đúng chữ in hoa/thường."
      });
    }

    res.status(200).json({
      message: "Xe đã đăng ký hợp lệ",
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

// 6. Ghi nhận sự cố an ninh
// API: POST /api/guard/incidents
// Request body: { title, description, location, images }
exports.reportIncident = async (req, res, next) => {
  try {
    const { title, description, location, images } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ tiêu đề, mô tả và vị trí sự cố" });
    }

    const incident = await SecurityIncident.create({
      reportedBy: req.user.id,
      title,
      description,
      location,
      images: images || [],
      status: "reported"
    });

    res.status(201).json({
      message: "Ghi nhận sự cố an ninh thành công",
      data: incident
    });
  } catch (err) {
    next(err);
  }
};
