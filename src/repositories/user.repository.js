const { User } = require('../models');

const findByEmail = async (email) => {
  return await User.findOne({ 
    where: { email },
    raw: true 
  });
};

const createUser = async ({ name, email, password, role = 'user' }) => {
  const user = await User.create({
    name,
    email,
    password,
    role,
    is_active: false
  });
  return user.id;
};

const activateUser = async (email) => {
  await User.update({ is_active: true }, { 
    where: { email } 
  });
};

const findById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    raw: true
  });
};

const updatePassword = async (email, password) => {
  await User.update({ password }, {
    where: { email }
  });
};

module.exports = { findByEmail, createUser, activateUser, findById, updatePassword };
