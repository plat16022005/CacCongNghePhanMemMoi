const securityRepo = require("../repositories/security.repository");
const checkinService = require("../services/security.checkin.service");
const vehicleService = require("../services/security.vehicle.service");
const incidentService = require("../services/security.incident.service");

// --- DASHBOARD ---
exports.getDashboard = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const stats = await securityRepo.getDashboardStats(date);
    res.status(200).json(stats);
  } catch (err) { next(err); }
};

// --- GUESTS / CHECKIN ---
exports.qrCheckin = async (req, res, next) => {
  try {
    const result = await checkinService.processQR(req.body.qrData);
    if (!result.valid) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.manualCheckin = async (req, res, next) => {
  try {
    const guest = await checkinService.manualCheckin(req.body);
    res.status(201).json({ message: "Ghi nhận vào thành công", data: guest });
  } catch (err) { next(err); }
};

exports.checkout = async (req, res, next) => {
  try {
    const guest = await checkinService.checkout(req.params.guestId);
    res.status(200).json({ message: "Ghi nhận ra thành công", data: guest });
  } catch (err) { next(err); }
};

exports.getGuestsToday = async (req, res, next) => {
  try {
    const result = await checkinService.getGuestsToday(req.query.status);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.lookupGuests = async (req, res, next) => {
  try {
    const result = await checkinService.lookupGuests(req.query.q, req.query.date);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// --- VEHICLES ---
exports.lookupVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.lookupVehicle(req.query.licensePlate);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.logVehicleAction = async (req, res, next) => {
  try {
    // Add securityId from req.user if auth middleware sets it
    const payload = { ...req.body, securityId: req.user ? req.user.id : null };
    const log = await vehicleService.logVehicleAction(payload);
    res.status(201).json({ message: "Ghi nhận xe thành công", data: log });
  } catch (err) { next(err); }
};

exports.getPendingVehicles = async (req, res, next) => {
  try {
    // Basic implementation since Security shouldn't approve, just view
    const ParkingRegistration = require("../models/parkingRegistration");
    const pending = await ParkingRegistration.find({ status: "pending" }).populate("residentId", "name");
    res.status(200).json({ data: pending });
  } catch (err) { next(err); }
};

// --- INCIDENTS ---
exports.getIncidents = async (req, res, next) => {
  try {
    const result = await incidentService.getIncidents(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.createIncident = async (req, res, next) => {
  try {
    // Default reportedBy to logged in security name
    const reportedBy = req.user ? req.user.name : req.body.reportedBy || "Security Agent";
    const payload = { ...req.body, reportedBy };
    const result = await incidentService.createIncident(payload);
    res.status(201).json({ message: "Đã ghi nhận sự cố", data: result });
  } catch (err) { next(err); }
};

exports.closeIncident = async (req, res, next) => {
  try {
    const result = await incidentService.closeIncident(req.params.id);
    res.status(200).json({ message: "Đã đóng sự cố", data: result });
  } catch (err) { next(err); }
};
