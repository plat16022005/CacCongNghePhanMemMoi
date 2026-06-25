const maintenanceRepo = require("../repositories/maintenance.repository");
const taskService = require("../services/maintenance.task.service");
const scheduleService = require("../services/maintenance.schedule.service");

// --- DASHBOARD & STATS ---
exports.getDashboard = async (req, res, next) => {
  try {
    const stats = await maintenanceRepo.getDashboardStats(req.user.id || req.user.userId);
    res.status(200).json(stats);
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await maintenanceRepo.getStats(req.user.id || req.user.userId);
    res.status(200).json(stats);
  } catch (err) { next(err); }
};

// --- TASKS ---
exports.getMyTasks = async (req, res, next) => {
  try {
    const result = await taskService.getMyTasks(req.user.id || req.user.userId, req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const result = await taskService.getAllTasks(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const result = await taskService.getTaskById(req.params.id);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.acceptTask = async (req, res, next) => {
  try {
    const result = await taskService.acceptTask(req.params.id, req.user);
    res.status(200).json({ message: "Nhận việc thành công", data: result });
  } catch (err) { next(err); }
};

exports.updateTaskProgress = async (req, res, next) => {
  try {
    const result = await taskService.updateProgress(req.params.id, req.body, req.user);
    res.status(200).json({ message: "Cập nhật tiến độ thành công", data: result });
  } catch (err) { next(err); }
};

exports.completeTask = async (req, res, next) => {
  try {
    const result = await taskService.completeTask(req.params.id, req.body, req.user);
    res.status(200).json({ message: "Hoàn thành công việc thành công", data: result });
  } catch (err) { next(err); }
};

exports.assignTask = async (req, res, next) => {
  try {
    // Note: In real app, ensure req.user has "manager" role for this
    const result = await taskService.assignTask(req.params.id, req.body.assignedTo, req.user);
    res.status(200).json({ message: "Phân công công việc thành công", data: result });
  } catch (err) { next(err); }
};

exports.getTaskHistory = async (req, res, next) => {
  try {
    const result = await taskService.getTaskHistory(req.params.id);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// --- SCHEDULES ---
exports.getSchedules = async (req, res, next) => {
  try {
    const result = await scheduleService.getSchedules(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.createSchedule = async (req, res, next) => {
  try {
    const result = await scheduleService.createSchedule(req.body);
    res.status(201).json({ message: "Tạo lịch thành công", data: result });
  } catch (err) { next(err); }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const result = await scheduleService.updateSchedule(req.params.id, req.body);
    res.status(200).json({ message: "Cập nhật lịch thành công", data: result });
  } catch (err) { next(err); }
};

exports.markScheduleDone = async (req, res, next) => {
  try {
    const result = await scheduleService.markDone(req.params.id);
    res.status(200).json({ message: "Đã đánh dấu hoàn thành", data: result });
  } catch (err) { next(err); }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    await scheduleService.deleteSchedule(req.params.id);
    res.status(200).json({ message: "Xóa lịch thành công" });
  } catch (err) { next(err); }
};
