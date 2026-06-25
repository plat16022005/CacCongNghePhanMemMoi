const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const systemConfigSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemConfig", systemConfigSchema);
