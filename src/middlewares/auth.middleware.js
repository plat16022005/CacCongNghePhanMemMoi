const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");
require("dotenv").config();

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

// Hàm hỗ trợ tự động refresh token
const handleAutoRefresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new Error("No refresh token");

  const { newAccess, newRefresh } = await authService.refreshToken(refreshToken);
  
  res.cookie("accessToken", newAccess, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", newRefresh, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return jwt.verify(newAccess, process.env.ACCESS_TOKEN_SECRET);
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
      }
      req.user = user;
      next();
    });
  } else {
    console.log("Không tìm thấy token xác thực trong header");
    res.status(401).json({ message: "Không tìm thấy token xác thực" });
  }
};

exports.verifyTokenLogin = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;

    if (!token) {
      console.log("Không tìm thấy accessToken trong Cookie, đang thử auto-refresh...");
      const decoded = await handleAutoRefresh(req, res);
      req.user = decoded;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.log("AccessToken hết hạn, đang thử auto-refresh...");
        const decoded = await handleAutoRefresh(req, res);
        req.user = decoded;
        return next();
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error("JWT Verify Error:", err.message);
    return res.status(401).json({ message: "❌ Phiên đăng nhập hết hạn" });
  }
};

exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
  };

exports.verifyTokenLoginView = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;

    if (!token) {
      console.log("Không tìm thấy accessToken trong Cookie, đang thử auto-refresh...");
      const decoded = await handleAutoRefresh(req, res);
      req.user = decoded;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.log("AccessToken hết hạn, đang thử auto-refresh...");
        const decoded = await handleAutoRefresh(req, res);
        req.user = decoded;
        return next();
      } else {
        throw err;
      }
    }
  } catch (err) {
    console.error("JWT Verify Error in View:", err.message);
    return res.redirect("/login");
  }
};

exports.authorizeView =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.log("Quyền truy cập không hợp lệ, chuyển hướng về /login");
      return res.redirect("/login");
    }
    next();
  };
