import express from "express";
import homeController from "../controller/homeController";
import { verifyTokenLogin, verifyToken } from "../middlewares/auth.middleware";
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const authorize = require("../middlewares/auth.middleware").authorize;
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", (req, res) => {
    return res.send("Chung cư Neet Paradise - Trang chủ");
  });

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

  router.get(
    "/dashboard",
    verifyTokenLogin,
    authorize("user", "admin"),
    (req, res) => {
      res.render("users/profile", { user: req.user });
    },
  );

  // GET /admin/dashboard - Dashboard admin
  router.get(
    "/admin/dashboard",
    verifyTokenLogin,
    authorize("admin"),
    (req, res) => {
      res.render("admin/dashboard", { user: req.user });
    },
  );

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  return app.use("/", router);
};

module.exports = initWebRoutes;
