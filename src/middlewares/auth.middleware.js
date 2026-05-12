const jwt = require("jsonwebtoken");
require("dotenv").config();

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

exports.verifyTokenLogin = (req, res, next) => {
  try {
    // 1. Kiểm tra xem cookie-parser có hoạt động không
    const token = req.cookies.accessToken;

    if (!token) {
      console.log("Không tìm thấy accessToken trong Cookie");
      return res.status(401).json({ message: "❌ Phiên đăng nhập hết hạn" });
    }

    // 2. Dùng thư viện jwt để verify
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Gán user vào request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verify Error:", err.message);
    return res.status(401).json({ message: "❌ Token không hợp lệ" }); // Trả về 401 để khớp với logic Frontend
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
