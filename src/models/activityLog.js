const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activityLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: [
        "login",
        "logout",
        "role_change",
        "status_change",
        "config_update",
        "password_reset",
        "user_create",
        "user_delete",
        "building_create",
        "building_delete"
      ],
      required: true
    },
    target: { type: String }, // Can be JSON string of params or entity name
    detail: { type: String }, // JSON string of body or changes
    ipAddress: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
