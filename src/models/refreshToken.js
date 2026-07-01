const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tokenHash: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // 7 ngày TTL index
  }
});

const RefreshToken = mongoose.models.RefreshToken || mongoose.model("RefreshToken", refreshTokenSchema);
module.exports = RefreshToken;
