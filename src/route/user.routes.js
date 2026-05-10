const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { editProfileRules } = require('../validations/user.validation');
const { validate } = require('../middlewares/validate.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');

// PUT /api/user/profile
router.put('/profile',
  verifyToken, // Lớp bảo mật: Authentication
  editProfileRules, // Lớp bảo mật: Input Validation
  validate,
  userCtrl.editProfile
);

module.exports = router;
