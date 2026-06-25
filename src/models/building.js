const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buildingSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    totalFloors: { type: Number, required: true },
    yearBuilt: { type: Number },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active"
    },
    blocks: [
      {
        name: { type: String, required: true },
        totalApartments: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Building", buildingSchema);
