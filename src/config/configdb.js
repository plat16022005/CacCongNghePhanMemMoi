const db = require('../models');

let connectDB = async () => {
  try {
    await db.sequelize.authenticate();
    // Tự động tạo bảng nếu chưa có (không đồng bộ dữ liệu)
    await db.sequelize.sync({ alter: true });
    console.log('Connection to MySQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = connectDB;
