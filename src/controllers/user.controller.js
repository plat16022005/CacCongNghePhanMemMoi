const userService = require("../services/user.service");

exports.editProfile = async (req, res, next) => {
  try {
    // req.user được gán từ auth.middleware sau khi xác thực JWT
    const userId = req.user.id;
    const updateData = req.body;

    const result = await userService.updateProfile(userId, updateData);
    res.status(200).json(result);
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({
      message: "User Profile",
      data: user,
      redirectUrl: "/user/profile",
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
};

exports.getAdminProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({
      message: "Admin Dashboard Profile",
      data: user,
      redirectUrl: "/admin/profile",
      adminFeatures: ["manage_users", "view_logs", "settings"],
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
};
