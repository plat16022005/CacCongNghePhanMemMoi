const userService = require("../services/user.service");
const User = require("../models/user");
const Room = require("../models/room");
const RentalApplication = require("../models/rentalApplication");
const RoomInvoice = require("../models/roomInvoice");

exports.editProfile = async (req, res, next) => {
  try {
    // req.user được gán từ auth.middleware sau khi xác thực JWT
    const userId = req.user.id;
    const updateData = req.body;

    const result = await userService.updateProfile(userId, updateData);
    res.status(200).json(result);
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    console.log("Cookies nhận được từ Browser:", req.cookies);
    res.status(200).json({
      message: "User Profile",
      data: user,
      redirectUrl: "/user/profile",
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

exports.getManagerProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({
      message: "Manager Dashboard Profile",
      data: user,
      redirectUrl: "/manager/profile",
      managerFeatures: ["manage_users", "view_logs", "settings"],
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select("_id name email role roleId is_active is_blocked block_reason phoneNumber createdAt");

    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name || user.email,
      email: user.email,
      role: user.role || "user",
      roleId: user.roleId || "",
      phoneNumber: user.phoneNumber || "",
      isActive: Boolean(user.is_active),
      isBlocked: Boolean(user.is_blocked),
      blockReason: user.block_reason || "",
      createdAt: user.createdAt,
    }));

    res.status(200).json({ data: formattedUsers });
  } catch (err) {
    next(err);
  }
};

exports.createManagerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ tên, email và mật khẩu." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email đã tồn tại." });
    }

    const hashedPassword = await require("bcryptjs").hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "manager",
      roleId: "manager",
      is_active: true,
      is_blocked: false,
      block_reason: "",
    });

    res.status(201).json({
      message: "Tài khoản manager đã được tạo thành công.",
      data: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user", "manager", "admin"].includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    user.role = role;
    user.roleId = role;
    await user.save();

    res.status(200).json({
      message: "Cập nhật quyền thành công.",
      data: {
        id: user._id.toString(),
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    const { reason } = req.body;
    if (!user.is_blocked) {
      if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
        return res.status(400).json({ message: "Vui lòng nhập lý do khóa tài khoản." });
      }
      user.is_blocked = true;
      user.block_reason = reason.trim();
    } else {
      user.is_blocked = false;
      user.block_reason = "";
    }

    await user.save();

    res.status(200).json({
      message: user.is_blocked ? "Đã khóa tài khoản." : "Đã mở khóa tài khoản.",
      data: {
        id: user._id.toString(),
        isBlocked: Boolean(user.is_blocked),
        blockReason: user.block_reason || "",
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAdminDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalManagers, totalAdmins, totalRooms, pendingApplications, occupiedRooms, totalInvoices] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "manager" }),
      User.countDocuments({ role: "admin" }),
      Room.countDocuments(),
      RentalApplication.countDocuments({ status: "pending" }),
      Room.countDocuments({ status: "occupied" }),
      RoomInvoice.countDocuments(),
    ]);

    res.status(200).json({
      data: {
        totalUsers,
        totalManagers,
        totalAdmins,
        totalRooms,
        pendingApplications,
        occupiedRooms,
        totalInvoices,
      },
    });
  } catch (err) {
    next(err);
  }
};
