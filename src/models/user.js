const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    name: String,
    firstName: String,
    lastName: String,
    address: String,
    phoneNumber: String,
    gender: String,
    cccdNumber: String,
    dob: String,
    occupation: String,
    cccdFrontImage: String,
    cccdBackImage: String,
    image: String,
    role: {
      type: String,
      default: "user"
    },
    roleId: String,
    positionId: String,
    is_active: {
      type: Boolean,
      default: false
    },
    is_blocked: {
      type: Boolean,
      default: false
    },
    block_reason: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active"
    },
    lastLogin: {
      type: Date
    },
    requirePasswordChange: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual relation to Room
userSchema.virtual("room", {
  ref: "Room",
  localField: "_id",
  foreignField: "tenantId",
  justOne: true
});

// Virtual relation to RoomInvoices
userSchema.virtual("invoices", {
  ref: "RoomInvoice",
  localField: "_id",
  foreignField: "tenantId"
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
