const mongoose = require("mongoose");
require("dotenv").config();

let connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/node_fullstack";
    await mongoose.connect(mongoURI);
    console.log("Connection to MongoDB has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the MongoDB database:", error);
  }
};

module.exports = connectDB;
