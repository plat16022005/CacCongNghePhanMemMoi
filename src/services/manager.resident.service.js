const User = require("../models/user");
const Room = require("../models/room");
const nodemailer = require("nodemailer");

class ManagerResidentService {
  async getResidents(query) {
    const { search, block, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let filter = { role: "resident" };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phoneNumber: new RegExp(search, "i") }
      ];
    }
    if (status) filter.status = status;

    const users = await User.find(filter).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);

    return {
      data: users,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async getResidentById(id) {
    const user = await User.findById(id);
    const apartment = await Room.findOne({ tenantId: id });
    return { user, apartment };
  }

  async createResident(data) {
    // Gen random password 8 chars
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create User
    const newUser = new User({
      name: data.fullName,
      email: data.email,
      phoneNumber: data.phone,
      password: tempPassword,
      role: "resident",
      status: "active"
    });
    
    // Need to hash password if there's a pre-save hook, assuming Mongoose model handles it or we do it.
    // If user model doesn't hook bcrypt, we need to hash it:
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(tempPassword, salt);
    
    await newUser.save();

    // Assign apartment
    if (data.apartmentId) {
      await Room.findByIdAndUpdate(data.apartmentId, {
        tenantId: newUser._id,
        status: "occupied",
        ownerSince: data.moveInDate || new Date()
      });
    }

    // Gửi email thông báo
    this.sendWelcomeEmail(newUser.email, tempPassword, newUser.name);

    return newUser;
  }

  async updateResident(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async toggleStatus(id) {
    const user = await User.findById(id);
    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();
    return user;
  }

  async sendWelcomeEmail(email, password, name) {
    const { sendMail } = require("../config/mailer");
    await sendMail({
      to: email,
      subject: "🏢 Thông tin tài khoản Cư dân - ApartmentHub",
      html: `
        <h2>Xin chào ${name || "bạn"}!</h2>
        <p>Ban quản lý chung cư đã tạo cho bạn một tài khoản để sử dụng hệ thống ApartmentHub.</p>
        <p><strong>Email đăng nhập:</strong> ${email}</p>
        <p><strong>Mật khẩu tạm thời:</strong> <span style="color:#2563eb; font-weight:bold; letter-spacing:2px">${password}</span></p>
        <p>Vui lòng đăng nhập và đổi mật khẩu trong lần truy cập đầu tiên để bảo mật tài khoản.</p>
        <p>Xin cảm ơn!</p>
      `,
    });
  }
}

module.exports = new ManagerResidentService();
