const { User } = require("../models");
const userRepo = require("../repositories/user.repository");

exports.updateProfile = async (userId, updateData) => {
  const allowedFields = [
    "name",
    "firstName",
    "lastName",
    "address",
    "phoneNumber",
    "gender",
    "cccdNumber",
    "dob",
    "occupation"
  ];
  const dataToUpdate = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      dataToUpdate[field] = updateData[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: dataToUpdate },
    { new: true, runValidators: true }
  ).select("-password").lean();

  if (!updatedUser) {
    throw { status: 404, message: "Người dùng không tồn tại" };
  }

  updatedUser.id = updatedUser._id.toString();

  return { message: "Cập nhật hồ sơ thành công", user: updatedUser };
};

exports.getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };
  return user;
};
