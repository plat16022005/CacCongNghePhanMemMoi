const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    capacity: { type: Number, default: 10 },
    openTime: { type: String, default: "06:00" }, // Format HH:mm
    closeTime: { type: String, default: "22:00" }, // Format HH:mm
    status: {
      type: String,
      enum: ["available", "maintenance", "closed"],
      default: "available"
    }
  },
  { timestamps: true }
);

const Amenity = mongoose.models.Amenity || mongoose.model("Amenity", amenitySchema);
module.exports = Amenity;
