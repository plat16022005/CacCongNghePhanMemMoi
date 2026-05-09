const User = require('../models/user');

const findByEmail = async (email) => {
  return await User.findOne({ email }).lean();
};

const createUser = async ({ name, email, password, role = 'user' }) => {
  const user = new User({
    name,
    email,
    password,
    role,
    is_active: false
  });
  await user.save();
  return user._id;
};

const activateUser = async (email) => {
  await User.updateOne({ email }, { is_active: true });
};

const findById = async (id) => {
  return await User.findById(id).select('-password').lean();
};

module.exports = { findByEmail, createUser, activateUser, findById };
