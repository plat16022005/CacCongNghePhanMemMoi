import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/configdb";
require("dotenv").config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
viewEngine(app);
initWebRoutes(app);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler caught an error:", err);
  const status = err.status || 500;
  const message = err.message || "Có lỗi xảy ra trên máy chủ!";
  res.status(status).json({ message });
});

connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("Backend Nodejs is running on the port: " + port);
});
