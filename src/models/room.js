const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true
    },
    basePrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "available"
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual relation to tenant
roomSchema.virtual("tenant", {
  ref: "User",
  localField: "tenantId",
  foreignField: "_id",
  justOne: true
});

// Virtual relation to invoices
roomSchema.virtual("invoices", {
  ref: "RoomInvoice",
  localField: "_id",
  foreignField: "roomId"
});

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

module.exports = Room;
