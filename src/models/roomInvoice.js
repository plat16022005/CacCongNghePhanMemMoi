const mongoose = require("mongoose");

const roomInvoiceSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    month: {
      type: String,
      required: true
    },
    oldElec: {
      type: Number,
      default: 0
    },
    newElec: {
      type: Number,
      default: 0
    },
    oldWater: {
      type: Number,
      default: 0
    },
    newWater: {
      type: Number,
      default: 0
    },
    lateDays: {
      type: Number,
      default: 0
    },
    penalty: {
      type: Number,
      default: 0
    },
    electricityFee: {
      type: Number,
      default: 0
    },
    waterFee: {
      type: Number,
      default: 0
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    vehicleFee: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalBill: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "unpaid"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual relations
roomInvoiceSchema.virtual("room", {
  ref: "Room",
  localField: "roomId",
  foreignField: "_id",
  justOne: true
});

roomInvoiceSchema.virtual("tenant", {
  ref: "User",
  localField: "tenantId",
  foreignField: "_id",
  justOne: true
});

const RoomInvoice = mongoose.models.RoomInvoice || mongoose.model("RoomInvoice", roomInvoiceSchema);

module.exports = RoomInvoice;
