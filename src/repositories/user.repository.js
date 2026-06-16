const { User } = require('../models');

const findByEmail = async (email) => {
  const user = await User.findOne({ email }).lean();
  if (user) {
    user.id = user._id.toString();
  }
  return user;
};

const createUser = async ({ name, email, password, role = 'user' }) => {
  const user = await User.create({
    name,
    email,
    password,
    role,
    is_active: false
  });
  return user._id.toString();
};

const activateUser = async (email) => {
  await User.updateOne({ email }, { $set: { is_active: true } });
};

const findById = async (id) => {
  try {
    const user = await User.findById(id).select("-password").lean();
    if (user) {
      user.id = user._id.toString();
    }
    return user;
  } catch (error) {
    return null;
  }
};

const updatePassword = async (email, password) => {
  await User.updateOne({ email }, { $set: { password } });
};

module.exports = { findByEmail, createUser, activateUser, findById, updatePassword };
