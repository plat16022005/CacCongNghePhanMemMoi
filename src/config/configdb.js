import mongoose from 'mongoose';

let connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/node_fulltask');
    console.log('Connection to MongoDB has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = connectDB;
