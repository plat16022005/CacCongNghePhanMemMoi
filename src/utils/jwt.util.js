const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    // Throw message rõ ràng để tránh lỗi cryptic từ jsonwebtoken
    throw new Error(
      `JWT config error: environment variable "${key}" is missing. Please set it in a .env file.`
    );
  }
  return value;
};

const generateAccessToken = (payload) => {
  const secret = requireEnv("ACCESS_TOKEN_SECRET");
  return jwt.sign(payload, secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (payload) => {
  const secret = requireEnv("REFRESH_TOKEN_SECRET");
  return jwt.sign(payload, secret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const verifyAccessToken = (token) => {
  const secret = requireEnv("ACCESS_TOKEN_SECRET");
  return jwt.verify(token, secret);
};

const verifyRefreshToken = (token) => {
  const secret = requireEnv("REFRESH_TOKEN_SECRET");
  return jwt.verify(token, secret);
};




module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

