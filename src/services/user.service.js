const { User } = require('../models');

exports.updateProfile = async (userId, updateData) => {
  const allowedFields = ['name', 'firstName', 'lastName', 'address', 'phoneNumber', 'gender'];
  const dataToUpdate = {};
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      dataToUpdate[field] = updateData[field];
    }
  }

  const [affectedRows] = await User.update(dataToUpdate, {
    where: { id: userId }
  });

  if (affectedRows === 0) {
    // Nếu affectedRows = 0 có thể do user không tồn tại hoặc không có data nào thay đổi
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      throw { status: 404, message: 'Người dùng không tồn tại' };
    }
  }

  const updatedUser = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
    raw: true
  });

  return { message: 'Cập nhật hồ sơ thành công', user: updatedUser };
};
