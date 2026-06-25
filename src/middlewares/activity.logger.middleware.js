const ActivityLog = require("../models/activityLog");

exports.logActivity = (action) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode < 400 && req.user) {
      try {
        await ActivityLog.create({
          userId: req.user.id || req.user.userId || req.user._id, // Updated to use req.user.id
          action,
          target: JSON.stringify(req.params),
          detail: JSON.stringify(req.body),
          ipAddress: req.ip || req.connection.remoteAddress,
        });
      } catch (err) {
        console.error("Lỗi ghi log:", err);
      }
    }
  });
  next();
};
