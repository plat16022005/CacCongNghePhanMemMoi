const User = require("../models/user");
const bcrypt = require("bcryptjs");
// Removed nodemail for local testing as per user request to mock

class AdminUserService {
  async getUsers(query) {
    const { role, status, search, page = 1, limit = 20 } = query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    return {
      data: users.map(u => ({
        id: u._id,
        fullName: u.name || `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role,
        status: u.status,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt
      })),
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async getUserById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) throw { status: 404, message: "Không tìm thấy User" };
    return user;
  }

  async createUser(data) {
    const { email, password, role, ...rest } = data;
    
    // Check if email exists
    const exists = await User.findOne({ email });
    if (exists) throw { status: 400, message: "Email đã tồn tại" };

    const pwd = password || Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    const user = new User({
      email,
      password: hashedPassword,
      role: role || "resident",
      status: "active",
      requirePasswordChange: !password, // if auto generated, require change
      ...rest
    });

    await user.save();
    
    console.log(`[EMAIL MOCK] Gửi thông tin tài khoản: Email: ${email}, Password: ${pwd}`);

    const uObj = user.toObject();
    delete uObj.password;
    return uObj;
  }

  async updateUser(id, data) {
    // Cannot update role/status here, use specific endpoint
    delete data.role;
    delete data.status;
    delete data.password;

    const user = await User.findByIdAndUpdate(id, data, { new: true }).select("-password");
    if (!user) throw { status: 404, message: "Không tìm thấy" };
    return user;
  }

  async changeRole(id, newRole, adminUser) {
    if (id === adminUser.userId) throw { status: 403, message: "Không thể tự đổi role của chính mình" };
    
    const user = await User.findById(id);
    if (!user) throw { status: 404, message: "Không tìm thấy" };

    user.role = newRole;
    await user.save();
    return { success: true };
  }

  async changeStatus(id, newStatus, adminUser) {
    if (id === adminUser.userId) throw { status: 403, message: "Không thể khóa/xóa tài khoản của chính mình" };

    const user = await User.findById(id);
    if (!user) throw { status: 404, message: "Không tìm thấy" };

    if (newStatus === "deleted" && user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin", status: { $ne: "deleted" } });
      if (adminCount <= 1) throw { status: 400, message: "Không thể xóa admin cuối cùng" };
    }

    user.status = newStatus;
    if (newStatus === "inactive") user.is_blocked = true;
    if (newStatus === "active") {
        user.is_active = true;
        user.is_blocked = false;
    }
    
    await user.save();
    return { success: true };
  }

  async resetPassword(id) {
    const user = await User.findById(id);
    if (!user) throw { status: 404, message: "Không tìm thấy" };

    const newPwd = Math.random().toString(36).slice(-8) + "A1!";
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPwd, salt);
    user.requirePasswordChange = true;
    await user.save();

    console.log(`[EMAIL MOCK] Đã Reset Password cho ${user.email}. Password mới: ${newPwd}`);

    return { message: "Đã reset mật khẩu thành công. Thông tin được gửi qua email (console log)." };
  }
}

module.exports = new AdminUserService();
