const User = require('../models/user');

exports.updateProfile = async (userId, updateData) => {
  // Loại bỏ các trường không được phép cập nhật trực tiếp (như role, is_active, password...)
  const allowedFields = ['name', 'firstName', 'lastName', 'address', 'phoneNumber', 'gender'];
  const dataToUpdate = {};
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      dataToUpdate[field] = updateData[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, {
    new: true, // Trả về bản ghi sau khi cập nhật
    select: '-password' // Không trả về mật khẩu
  });

  if (!updatedUser) {
    throw { status: 404, message: 'Người dùng không tồn tại' };
  }

  return { message: 'Cập nhật hồ sơ thành công', user: updatedUser };
};
