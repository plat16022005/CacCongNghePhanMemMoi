import bcrypt from 'bcryptjs';
import User from '../models/user';

const salt = bcrypt.genSaltSync(10);

// Tạo user mới
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === '1' ? true : false,
        roleId: data.roleId
      });
      resolve('OK create a new user successfull');
    } catch (e) {
      reject(e);
    }
  });
};

// Hash password
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy tất cả user (findAll)
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await User.find().lean();
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

// Lấy 1 user theo id (findOne)
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ _id: userId }).lean();
      if (user) resolve(user);
      else resolve([]);
    } catch (e) {
      reject(e);
    }
  });
};

// Cập nhật user (update)
let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ _id: data.id });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        let allusers = await User.find().lean();
        resolve(allusers);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

// Xóa user
let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ _id: userId });
      if (user) {
        await User.deleteOne({ _id: userId });
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUser,
  deleteUserById
};
