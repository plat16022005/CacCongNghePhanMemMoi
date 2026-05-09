const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  gender: { type: Boolean },
  image: { type: String },
  role: { type: String, default: 'user' },
  roleId: { type: String },
  positionId: { type: String },
  is_active: { type: Boolean, default: false }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
