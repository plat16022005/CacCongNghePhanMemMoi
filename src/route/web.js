import express from "express";
import homeController from "../controller/homeController";
import { 
  verifyTokenLogin, 
  verifyToken, 
  verifyTokenLoginView, 
  authorizeView 
} from "../middlewares/auth.middleware";
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const authorize = require("../middlewares/auth.middleware").authorize;
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);

  // Các trang Landing/Marketing (Render React SPA)
  const publicPages = ["/home", "/about", "/features", "/financials", "/amenities", "/rentals"];
  publicPages.forEach(path => {
    router.get(path, (req, res) => res.render("homepage.ejs", { user: null }));
  });

  router.get("/api/public/apartments", async (req, res) => {
    try {
      const Room = require("../models/room");
      const rooms = await Room.find({ status: { $in: ["available", "vacant"] } });
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ error: true, message: err.message });
    }
  });
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getFindAllCrud);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  // Thêm giao diện Đăng ký / Đăng nhập (Dùng React frontend)
  router.get("/login", (req, res) => res.render("homepage.ejs", { user: null }));
  router.get("/register", (req, res) => res.render("homepage.ejs", { user: null }));

  // Trang hồ sơ người dùng
  router.get(
    "/user/profile",
    verifyTokenLoginView,
    authorizeView("user"),
    (req, res) => {
      res.render("users/profile", { user: req.user });
    }
  );

  // Trang hồ sơ cư dân (Resident)
  router.get(
    "/resident/profile",
    verifyTokenLoginView,
    authorizeView("user", "admin", "manager"),
    (req, res) => {
      res.render("resident/profile", { user: req.user });
    }
  );

  // Trang thông tin căn hộ (Resident)
  router.get(
    "/resident/apartment",
    verifyTokenLoginView,
    authorizeView("user", "admin", "manager"),
    (req, res) => {
      res.render("resident/apartment", { user: req.user });
    }
  );

  // Trang quản lý hóa đơn (Resident)
  router.get(
    "/resident/invoices",
    verifyTokenLoginView,
    authorizeView("user", "admin", "manager"),
    (req, res) => {
      res.render("resident/invoices", { user: req.user });
    }
  );

  // Trang thanh toán (Resident)
  router.get(
    "/resident/payment",
    verifyTokenLoginView,
    authorizeView("user", "admin", "manager"),
    (req, res) => {
      res.render("resident/payment", { user: req.user });
    }
  );

  // Khách đến thăm
  router.get("/resident/guests", verifyTokenLoginView, authorizeView("user", "admin", "manager"), (req, res) => res.render("resident/guests", { user: req.user }));

  // Đăng ký xe
  router.get("/resident/parking", verifyTokenLoginView, authorizeView("user", "admin", "manager"), (req, res) => res.render("resident/parking", { user: req.user }));

  // Thông báo
  router.get("/resident/notifications", verifyTokenLoginView, authorizeView("user", "admin", "manager"), (req, res) => res.render("resident/notifications", { user: req.user }));

  // Đánh giá dịch vụ
  router.get("/resident/feedbacks", verifyTokenLoginView, authorizeView("user", "admin", "manager"), (req, res) => res.render("resident/feedbacks", { user: req.user }));

  // Báo cáo sự cố
  router.get("/resident/maintenance", verifyTokenLoginView, authorizeView("user", "admin", "manager"), (req, res) => res.render("resident/maintenance", { user: req.user }));

  // SPA Catch-all Routes
  const spaRoutes = [
    /^\/dashboard(?:\/.*)?$/,
    /^\/manager(?:\/.*)?$/,
    /^\/admin(?:\/.*)?$/,
    /^\/security(?:\/.*)?$/,
    /^\/accountant(?:\/.*)?$/,
    /^\/maintenance(?:\/.*)?$/
  ];

  spaRoutes.forEach(route => {
    router.get(route, verifyTokenLoginView, (req, res) => {
      // Role checks are handled in the React frontend
      res.render("homepage.ejs", { user: req.user });
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/resident", require("./resident.routes"));
  app.use("/api/manager", require("./manager.routes"));
  app.use("/api/accountant", require("./accountant.routes"));
  app.use("/api/security", require("./security.routes"));
  app.use("/api/maintenance", require("./maintenance.routes"));
  app.use("/api/admin", require("./admin.routes"));
  app.use("/api/rooms", require("./room.routes"));
  app.use("/api/applications", require("./application.routes"));
  return app.use("/", router);
};

module.exports = initWebRoutes;
