const User = require("../models/user");

class ResidentRepository {
  async findById(id) {
    return await User.findById(id).select("-password");
  }

  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
  }

  async updatePassword(id, newPassword) {
    return await User.findByIdAndUpdate(id, { password: newPassword }, { new: true });
  }
}

module.exports = new ResidentRepository();
