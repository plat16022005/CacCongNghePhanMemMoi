const residentService = require("../services/resident.service");
const invoiceService = require("../services/invoice.service");
const guestService = require("../services/guest.service");
const parkingService = require("../services/parking.service");
const maintenanceService = require("../services/maintenance.service");
const notificationService = require("../services/notification.service");
const feedbackService = require("../services/feedback.service");
const amenityService = require("../services/amenity.service");
const surveyService = require("../services/survey.service");

// --- RESIDENT PROFILE & APARTMENT ---
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await residentService.getProfile(req.user.id);
    res.status(200).json({ error: false, data: profile });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await residentService.updateProfile(req.user.id, req.body);
    res.status(200).json({ error: false, data: profile });
  } catch (err) { next(err); }
};

exports.getApartment = async (req, res, next) => {
  try {
    const apartmentRepo = require("../repositories/apartment.repository");
    const apartment = await apartmentRepo.findByTenantId(req.user.id);
    if (!apartment) throw { status: 404, message: "Bạn chưa thuê căn hộ nào" };
    res.status(200).json({ error: false, data: apartment });
  } catch (err) { next(err); }
};

// --- INVOICES ---
exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getInvoices(req.user.id, req.query);
    res.status(200).json({ error: false, data: invoices, total: invoices.length });
  } catch (err) { next(err); }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id, req.user.id);
    res.status(200).json({ error: false, data: invoice });
  } catch (err) { next(err); }
};

exports.payInvoice = async (req, res, next) => {
  try {
    const result = await invoiceService.payInvoice(req.params.id, req.user.id);
    res.status(200).json({ error: false, ...result });
  } catch (err) { next(err); }
};

exports.paymentCallback = async (req, res, next) => {
  try {
    const { invoiceId } = req.body;
    await invoiceService.paymentCallback(invoiceId, req.user.id);
    res.status(200).json({ error: false, message: "Thanh toán thành công" });
  } catch (err) { next(err); }
};

// --- GUESTS ---
exports.createGuest = async (req, res, next) => {
  try {
    const guest = await guestService.createGuest(req.user.id, req.body);
    res.status(201).json({ error: false, message: "Đăng ký thành công, chờ bảo vệ xác nhận", data: guest });
  } catch (err) { next(err); }
};

exports.getGuests = async (req, res, next) => {
  try {
    const guests = await guestService.getGuests(req.user.id);
    res.status(200).json({ error: false, data: guests });
  } catch (err) { next(err); }
};

exports.deleteGuest = async (req, res, next) => {
  try {
    await guestService.deleteGuest(req.params.id, req.user.id);
    res.status(200).json({ error: false, message: "Đã hủy đăng ký" });
  } catch (err) { next(err); }
};

// --- PARKING ---
exports.createParking = async (req, res, next) => {
  try {
    const parking = await parkingService.createParking(req.user.id, req.body);
    res.status(201).json({ error: false, data: parking });
  } catch (err) { next(err); }
};

exports.getParking = async (req, res, next) => {
  try {
    const parkings = await parkingService.getParkings(req.user.id);
    res.status(200).json({ error: false, data: parkings });
  } catch (err) { next(err); }
};

exports.deleteParking = async (req, res, next) => {
  try {
    await parkingService.deleteParking(req.params.id, req.user.id);
    res.status(200).json({ error: false, message: "Đã hủy đăng ký thẻ xe" });
  } catch (err) { next(err); }
};

// --- MAINTENANCE ---
exports.createMaintenance = async (req, res, next) => {
  try {
    const request = await maintenanceService.createMaintenance(req.user.id, req.body);
    res.status(201).json({ error: false, data: request });
  } catch (err) { next(err); }
};

exports.getMaintenance = async (req, res, next) => {
  try {
    const requests = await maintenanceService.getMaintenanceRequests(req.user.id);
    res.status(200).json({ error: false, data: requests });
  } catch (err) { next(err); }
};

// --- NOTIFICATIONS ---
exports.getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getNotifications(req.user.id);
    res.status(200).json({ error: false, ...result });
  } catch (err) { next(err); }
};

exports.readNotification = async (req, res, next) => {
  try {
    const notif = await notificationService.readNotification(req.params.id, req.user.id);
    res.status(200).json({ error: false, data: notif });
  } catch (err) { next(err); }
};

exports.readAllNotifications = async (req, res, next) => {
  try {
    await notificationService.readAllNotifications(req.user.id);
    res.status(200).json({ error: false, message: "Đã đánh dấu đọc tất cả" });
  } catch (err) { next(err); }
};

// --- FEEDBACKS ---
exports.createFeedback = async (req, res, next) => {
  try {
    const fb = await feedbackService.createFeedback(req.user.id, req.body);
    res.status(201).json({ error: false, data: fb });
  } catch (err) { next(err); }
};

exports.getFeedbacks = async (req, res, next) => {
  try {
    const fbs = await feedbackService.getFeedbacks(req.user.id);
    res.status(200).json({ error: false, data: fbs });
  } catch (err) { next(err); }
};

// --- AMENITIES ---
exports.getAmenities = async (req, res, next) => {
  try {
    const amenities = await amenityService.getAmenities();
    res.status(200).json({ error: false, data: amenities });
  } catch (err) { next(err); }
};

exports.getAmenitySlots = async (req, res, next) => {
  try {
    const date = req.query.date || new Date();
    const result = await amenityService.getAvailableSlots(req.params.id, date);
    res.status(200).json({ error: false, ...result });
  } catch (err) { next(err); }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await amenityService.getMyBookings(req.user.id);
    res.status(200).json({ error: false, data: bookings });
  } catch (err) { next(err); }
};

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await amenityService.createBooking(req.user.id, req.params.id, req.body);
    res.status(201).json({ error: false, data: booking });
  } catch (err) { next(err); }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    await amenityService.cancelBooking(req.params.id, req.user.id);
    res.status(200).json({ error: false, message: "Đã hủy lịch đặt" });
  } catch (err) { next(err); }
};

// --- SURVEYS ---
exports.getSurveys = async (req, res, next) => {
  try {
    const surveys = await surveyService.getSurveys();
    res.status(200).json({ error: false, data: surveys });
  } catch (err) { next(err); }
};

exports.getSurveyById = async (req, res, next) => {
  try {
    const survey = await surveyService.getSurveyById(req.params.id);
    res.status(200).json({ error: false, data: survey });
  } catch (err) { next(err); }
};

exports.submitSurvey = async (req, res, next) => {
  try {
    const response = await surveyService.submitSurvey(req.params.id, req.user.id, req.body.answers);
    res.status(201).json({ error: false, message: "Gửi khảo sát thành công", data: response });
  } catch (err) { next(err); }
};
