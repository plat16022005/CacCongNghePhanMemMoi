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

const startServer = async () => {
  try {
    // Chờ kết nối MongoDB trước khi nhận request
    await connectDB();

    let port = process.env.PORT || 6969;
    app.listen(port, () => {
      console.log("Backend Nodejs is running on the port: " + port);
    });
  } catch (error) {
    console.error("❌ Không thể kết nối MongoDB. Server dừng lại:", error.message);
    process.exit(1); // ✅ Dừng server nếu không kết nối được DB
  }
};

startServer();
