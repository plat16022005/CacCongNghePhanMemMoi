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

  router.get("/home", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getFindAllCrud);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  // Thêm giao diện Đăng ký / Đăng nhập
  router.get("/login", (req, res) => res.render("auth/login.ejs"));
  router.get("/register", (req, res) => res.render("auth/register.ejs"));

  // Trang hồ sơ người dùng
  router.get(
    "/user/profile",
    verifyTokenLoginView,
    authorizeView("user"),
    (req, res) => {
      res.render("users/profile", { user: req.user });
    }
  );

  router.get(
    "/dashboard",
    verifyTokenLoginView,
    authorizeView("user", "manager", "admin"),
    (req, res) => {
      if (req.user && req.user.role === "manager") {
        console.log("Manager truy cập /dashboard, tự động chuyển hướng sang /manager/dashboard");
        return res.redirect("/manager/dashboard");
      }
      if (req.user && req.user.role === "admin") {
        console.log("Admin truy cập /dashboard, tự động chuyển hướng sang /admin/dashboard");
        return res.redirect("/admin/dashboard");
      }
      res.render("users/dashboard", { user: req.user });
    },
  );

  router.get(
    "/admin/dashboard",
    verifyTokenLoginView,
    authorizeView("admin"),
    (req, res) => {
      res.render("admin/dashboard", { user: req.user });
    },
  );

  router.get(
    "/dashboard/room/:id",
    verifyTokenLoginView,
    authorizeView("user"),
    (req, res) => {
      res.render("users/roomDetail", { user: req.user, roomId: req.params.id });
    }
  );

  router.get(
    "/dashboard/room/:id/rent",
    verifyTokenLoginView,
    authorizeView("user"),
    (req, res) => {
      res.render("users/rentConfirm", { user: req.user, roomId: req.params.id });
    }
  );

  // GET /manager/dashboard - Dashboard manager
  router.get(
    "/manager/dashboard",
    verifyTokenLoginView,
    authorizeView("manager"),
    (req, res) => {
      if (req.user && req.user.role !== "manager") {
        console.log("Người dùng không phải manager truy cập /manager/dashboard, tự động chuyển hướng sang /dashboard");
        return res.redirect("/dashboard");
      }
      res.render("manager/dashboard", { user: req.user });
    },
  );

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/rooms", require("./room.routes"));
  app.use("/api/applications", require("./application.routes"));
  return app.use("/", router);
};

module.exports = initWebRoutes;
