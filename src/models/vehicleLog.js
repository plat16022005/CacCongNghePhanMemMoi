const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vehicleLogSchema = new Schema(
  {
    licensePlate: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["entry", "exit"],
      required: true,
    },
    note: {
      type: String,
    },
    securityId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleLog", vehicleLogSchema);
