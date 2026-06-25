const residentService = require("../services/manager.resident.service");
const apartmentService = require("../services/manager.apartment.service");
const invoiceService = require("../services/manager.invoice.service");
const guestService = require("../services/manager.guest.service");
const parkingService = require("../services/manager.parking.service");
const notificationService = require("../services/manager.notification.service");
const feedbackService = require("../services/manager.feedback.service");
const amenityService = require("../services/manager.amenity.service");
const managerRepo = require("../repositories/manager.repository");

// --- DASHBOARD & REPORTS ---
exports.getDashboard = async (req, res, next) => {
  try {
    const stats = await managerRepo.getDashboardStats();
    res.status(200).json(stats);
  } catch (err) { next(err); }
};

exports.getRevenueReport = async (req, res, next) => {
  try {
    // default to last 6 months
    const to = req.query.to ? new Date(req.query.to) : new Date();
    const from = req.query.from ? new Date(req.query.from) : new Date(new Date().setMonth(to.getMonth() - 6));
    
    const report = await managerRepo.getRevenueReport(from, to);
    res.status(200).json({ data: report });
  } catch (err) { next(err); }
};

// --- RESIDENTS ---
exports.getResidents = async (req, res, next) => {
  try {
    const result = await residentService.getResidents(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.getResidentById = async (req, res, next) => {
  try {
    const result = await residentService.getResidentById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) { next(err); }
};

exports.createResident = async (req, res, next) => {
  try {
    const result = await residentService.createResident(req.body);
    res.status(201).json({ error: false, message: "Tạo cư dân thành công. Mật khẩu đã gửi qua email.", data: result });
  } catch (err) { next(err); }
};

exports.updateResident = async (req, res, next) => {
  try {
    const result = await residentService.updateResident(req.params.id, req.body);
    res.status(200).json({ data: result });
  } catch (err) { next(err); }
};

exports.toggleResidentStatus = async (req, res, next) => {
  try {
    const result = await residentService.toggleStatus(req.params.id);
    res.status(200).json({ message: "Cập nhật trạng thái thành công", data: result });
  } catch (err) { next(err); }
};

// --- APARTMENTS ---
exports.getApartments = async (req, res, next) => {
  try {
    const result = await apartmentService.getApartments(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.getApartmentById = async (req, res, next) => {
  try {
    const result = await apartmentService.getApartmentById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) { next(err); }
};

exports.updateApartment = async (req, res, next) => {
  try {
    const result = await apartmentService.updateApartment(req.params.id, req.body);
    res.status(200).json({ data: result });
  } catch (err) { next(err); }
};

exports.updateApartmentStatus = async (req, res, next) => {
  try {
    const result = await apartmentService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ data: result });
  } catch (err) { next(err); }
};

// --- GUESTS ---
exports.getGuests = async (req, res, next) => {
  try {
    const result = await guestService.getGuests(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.approveGuest = async (req, res, next) => {
  try {
    const note = req.body ? req.body.note : undefined;
    const result = await guestService.updateGuestStatus(req.params.id, "approved", note);
    res.status(200).json({ message: "Đã duyệt khách", data: result });
  } catch (err) { next(err); }
};

exports.rejectGuest = async (req, res, next) => {
  try {
    const note = req.body ? req.body.note : undefined;
    const result = await guestService.updateGuestStatus(req.params.id, "rejected", note);
    res.status(200).json({ message: "Đã từ chối khách", data: result });
  } catch (err) { next(err); }
};

// --- PARKING ---
exports.getParkings = async (req, res, next) => {
  try {
    const result = await parkingService.getParkings(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.approveParking = async (req, res, next) => {
  try {
    const result = await parkingService.updateParkingStatus(req.params.id, "approved");
    res.status(200).json({ message: "Đã duyệt thẻ xe", data: result });
  } catch (err) { next(err); }
};

exports.rejectParking = async (req, res, next) => {
  try {
    const result = await parkingService.updateParkingStatus(req.params.id, "rejected");
    res.status(200).json({ message: "Đã từ chối thẻ xe", data: result });
  } catch (err) { next(err); }
};

// --- INVOICES ---
exports.getInvoices = async (req, res, next) => {
  try {
    const result = await invoiceService.getInvoices(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.getOverdueInvoices = async (req, res, next) => {
  try {
    const result = await invoiceService.getOverdueInvoices();
    res.status(200).json({ data: result });
  } catch (err) { next(err); }
};

exports.remindInvoices = async (req, res, next) => {
  try {
    const count = await invoiceService.remindInvoices(req.body);
    res.status(200).json({ message: `Đã gửi nhắc nhở cho ${count} căn hộ.` });
  } catch (err) { next(err); }
};

// --- ANNOUNCEMENTS ---
exports.getAnnouncements = async (req, res, next) => {
  try {
    const result = await notificationService.getAnnouncements(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.sendAnnouncement = async (req, res, next) => {
  try {
    const result = await notificationService.sendAnnouncement(req.body);
    res.status(201).json({ message: "Đã gửi thông báo", data: result });
  } catch (err) { next(err); }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    await notificationService.deleteAnnouncement(req.params.id);
    res.status(200).json({ message: "Đã xóa thông báo" });
  } catch (err) { next(err); }
};

// --- FEEDBACKS ---
exports.getFeedbacks = async (req, res, next) => {
  try {
    const result = await feedbackService.getFeedbacks(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.getFeedbackById = async (req, res, next) => {
  try {
    const result = await feedbackService.getFeedbackById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) { next(err); }
};

exports.respondFeedback = async (req, res, next) => {
  try {
    const result = await feedbackService.respondFeedback(req.params.id, req.body);
    res.status(200).json({ message: "Đã phản hồi", data: result });
  } catch (err) { next(err); }
};

exports.closeFeedback = async (req, res, next) => {
  try {
    const result = await feedbackService.closeFeedback(req.params.id);
    res.status(200).json({ message: "Đã đóng góp ý", data: result });
  } catch (err) { next(err); }
};

// --- AMENITIES ---
exports.getAmenities = async (req, res, next) => {
  try {
    const result = await amenityService.getAmenities(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.createAmenity = async (req, res, next) => {
  try {
    const result = await amenityService.createAmenity(req.body);
    res.status(201).json({ message: "Đã tạo tiện ích", data: result });
  } catch (err) { next(err); }
};

exports.updateAmenity = async (req, res, next) => {
  try {
    const result = await amenityService.updateAmenity(req.params.id, req.body);
    res.status(200).json({ message: "Cập nhật thành công", data: result });
  } catch (err) { next(err); }
};

exports.updateAmenityStatus = async (req, res, next) => {
  try {
    const result = await amenityService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ message: "Cập nhật trạng thái thành công", data: result });
  } catch (err) { next(err); }
};

exports.getAmenityBookings = async (req, res, next) => {
  try {
    const result = await amenityService.getBookings(req.params.id, req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.approveAmenityBooking = async (req, res, next) => {
  try {
    const result = await amenityService.updateBookingStatus(req.params.id, "approved");
    res.status(200).json({ message: "Đã duyệt lịch đặt", data: result });
  } catch (err) { next(err); }
};

exports.rejectAmenityBooking = async (req, res, next) => {
  try {
    const result = await amenityService.updateBookingStatus(req.params.id, "rejected");
    res.status(200).json({ message: "Đã từ chối lịch đặt", data: result });
  } catch (err) { next(err); }
};
