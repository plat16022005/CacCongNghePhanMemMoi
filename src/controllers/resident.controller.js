const userService = require("../services/user.service");
const Room = require("../models/room");

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({ data: user });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const result = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

exports.getApartment = async (req, res, next) => {
  try {
    // Tìm phòng mà cư dân này đang thuê (tenantId)
    const room = await Room.findOne({ tenantId: req.user.id }).populate('invoices');
    if (!room) {
      return res.status(404).json({ message: "Bạn hiện chưa thuê căn hộ nào." });
    }
    res.status(200).json({ data: room });
  } catch (err) {
    next(err);
  }
};

const RoomInvoice = require("../models/roomInvoice");

exports.getInvoices = async (req, res, next) => {
  try {
    const { status, month, type } = req.query;
    let query = { tenantId: req.user.id };
    if (status) query.status = status;
    if (month) query.month = month;
    if (type) query.type = type;

    const invoices = await RoomInvoice.find(query).sort({ createdAt: -1 });
    res.status(200).json({ data: invoices });
  } catch (err) {
    next(err);
  }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await RoomInvoice.findOne({ _id: req.params.id, tenantId: req.user.id }).populate('room');
    if (!invoice) return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    res.status(200).json({ data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.payInvoice = async (req, res, next) => {
  try {
    const invoice = await RoomInvoice.findOne({ _id: req.params.id, tenantId: req.user.id });
    if (!invoice) return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    if (invoice.status === 'paid') return res.status(400).json({ message: "Hóa đơn đã được thanh toán" });
    
    // Chuyển sang pending để demo
    invoice.status = 'pending';
    await invoice.save();
    
    res.status(200).json({ message: "Đã tạo phiên thanh toán demo", data: invoice });
  } catch (err) {
    next(err);
  }
};

exports.paymentCallback = async (req, res, next) => {
  try {
    const { invoiceId } = req.body; // Gửi kèm invoiceId trong request body cho demo callback
    const invoice = await RoomInvoice.findOne({ _id: invoiceId, tenantId: req.user.id });
    if (!invoice) return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    
    invoice.status = 'paid';
    await invoice.save();
    
    res.status(200).json({ message: "Thanh toán thành công" });
  } catch (err) {
    next(err);
  }
};

const Guest = require("../models/guest");
const ParkingRegistration = require("../models/parkingRegistration");
const Notification = require("../models/notification");

// --- GUESTS ---
exports.createGuest = async (req, res, next) => {
  try {
    const { guestName, cccd, phone, visitDate, leaveDate, reason } = req.body;
    const newGuest = await Guest.create({
      residentId: req.user.id,
      guestName, cccd, phone, visitDate, leaveDate, reason
    });
    res.status(201).json({ message: "Đăng ký khách thành công", data: newGuest });
  } catch (err) { next(err); }
};

exports.getGuests = async (req, res, next) => {
  try {
    const guests = await Guest.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ data: guests });
  } catch (err) { next(err); }
};

exports.deleteGuest = async (req, res, next) => {
  try {
    const guest = await Guest.findOne({ _id: req.params.id, residentId: req.user.id });
    if (!guest) return res.status(404).json({ message: "Không tìm thấy đăng ký" });
    if (guest.status !== "pending") return res.status(400).json({ message: "Chỉ có thể hủy đăng ký đang chờ duyệt" });
    await Guest.findByIdAndDelete(guest._id);
    res.status(200).json({ message: "Đã hủy đăng ký" });
  } catch (err) { next(err); }
};

// --- PARKING ---
exports.createParking = async (req, res, next) => {
  try {
    const { vehicleType, licensePlate, vehicleBrand, vehicleColor } = req.body;
    const newParking = await ParkingRegistration.create({
      residentId: req.user.id,
      vehicleType, licensePlate, vehicleBrand, vehicleColor
    });
    res.status(201).json({ message: "Đăng ký xe thành công", data: newParking });
  } catch (err) { next(err); }
};

exports.getParking = async (req, res, next) => {
  try {
    const parkings = await ParkingRegistration.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ data: parkings });
  } catch (err) { next(err); }
};

exports.deleteParking = async (req, res, next) => {
  try {
    const parking = await ParkingRegistration.findOne({ _id: req.params.id, residentId: req.user.id });
    if (!parking) return res.status(404).json({ message: "Không tìm thấy đăng ký" });
    if (parking.status !== "pending") return res.status(400).json({ message: "Chỉ có thể hủy đăng ký đang chờ duyệt" });
    await ParkingRegistration.findByIdAndDelete(parking._id);
    res.status(200).json({ message: "Đã hủy đăng ký" });
  } catch (err) { next(err); }
};

// --- NOTIFICATIONS ---
exports.getNotifications = async (req, res, next) => {
  try {
    const notifs = await Notification.find({
      $or: [{ residentId: req.user.id }, { residentId: null }]
    }).sort({ createdAt: -1 });
    res.status(200).json({ data: notifs });
  } catch (err) { next(err); }
};

exports.readNotification = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id },
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ data: notif });
  } catch (err) { next(err); }
};

exports.readAllNotifications = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { $or: [{ residentId: req.user.id }, { residentId: null }], isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: "Đã đánh dấu đọc tất cả" });
  } catch (err) { next(err); }
};

const Feedback = require("../models/feedback");
const MaintenanceRequest = require("../models/maintenanceRequest");

// --- FEEDBACKS ---
exports.createFeedback = async (req, res, next) => {
  try {
    const { rating, content } = req.body;
    const fb = await Feedback.create({ residentId: req.user.id, rating, content });
    res.status(201).json({ message: "Gửi đánh giá thành công", data: fb });
  } catch (err) { next(err); }
};

exports.getFeedbacks = async (req, res, next) => {
  try {
    const fbs = await Feedback.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ data: fbs });
  } catch (err) { next(err); }
};

// --- MAINTENANCE ---
exports.createMaintenance = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const mr = await MaintenanceRequest.create({ residentId: req.user.id, title, description });
    res.status(201).json({ message: "Gửi báo cáo sự cố thành công", data: mr });
  } catch (err) { next(err); }
};

exports.getMaintenance = async (req, res, next) => {
  try {
    const mrs = await MaintenanceRequest.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ data: mrs });
  } catch (err) { next(err); }
};
