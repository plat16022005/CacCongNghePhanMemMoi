const adminRepo = require("../repositories/admin.repository");
const userService = require("../services/admin.user.service");
const buildingService = require("../services/admin.building.service");
const configService = require("../services/admin.config.service");
const logService = require("../services/admin.log.service");

// Dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const stats = await adminRepo.getDashboardStats();
    res.status(200).json(stats);
  } catch (err) { next(err); }
};

// Users
exports.getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.getUserById = async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.params.id);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.createUser = async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json({ message: "Tạo tài khoản thành công", data: result });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ message: "Cập nhật thành công", data: result });
  } catch (err) { next(err); }
};

exports.changeRole = async (req, res, next) => {
  try {
    await userService.changeRole(req.params.id, req.body.role, req.user);
    res.status(200).json({ message: "Thay đổi phân quyền thành công" });
  } catch (err) { next(err); }
};

exports.changeStatus = async (req, res, next) => {
  try {
    await userService.changeStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ message: "Thay đổi trạng thái thành công" });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const result = await userService.resetPassword(req.params.id);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

// Buildings
exports.getBuildings = async (req, res, next) => {
  try {
    const result = await buildingService.getBuildings();
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.createBuilding = async (req, res, next) => {
  try {
    const result = await buildingService.createBuilding(req.body);
    res.status(201).json({ message: "Tạo tòa nhà thành công", data: result });
  } catch (err) { next(err); }
};

exports.updateBuilding = async (req, res, next) => {
  try {
    const result = await buildingService.updateBuilding(req.params.id, req.body);
    res.status(200).json({ message: "Cập nhật tòa nhà thành công", data: result });
  } catch (err) { next(err); }
};

exports.deleteBuilding = async (req, res, next) => {
  try {
    await buildingService.deleteBuilding(req.params.id);
    res.status(200).json({ message: "Xóa tòa nhà thành công" });
  } catch (err) { next(err); }
};

exports.getBlocks = async (req, res, next) => {
  try {
    const result = await buildingService.getBlocks(req.params.id);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.addBlock = async (req, res, next) => {
  try {
    const result = await buildingService.addBlock(req.params.id, req.body);
    res.status(201).json({ message: "Thêm block thành công", data: result });
  } catch (err) { next(err); }
};

// Config
exports.getConfig = async (req, res, next) => {
  try {
    const result = await configService.getAllConfig();
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.updateConfig = async (req, res, next) => {
  try {
    await configService.updateConfig(req.body, req.user);
    res.status(200).json({ message: "Cập nhật cấu hình thành công" });
  } catch (err) { next(err); }
};

// Logs
exports.getLogs = async (req, res, next) => {
  try {
    const result = await logService.getLogs(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

exports.getLogsByUser = async (req, res, next) => {
  try {
    const result = await logService.getLogsByUser(req.params.userId, req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};
