const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceFeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["electricity", "water", "management", "parking", "amenity", "other"],
      required: true,
    },
    unit: {
      type: String,
      enum: ["per_sqm", "per_unit", "fixed", "per_vehicle"],
      required: true,
    },
    price: {
      type: Number,
      required: true, // VNĐ dạng integer
    },
    effectiveFrom: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceFee", serviceFeeSchema);
