const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentRecordSchema = new Schema(
  {
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "RoomInvoice",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["cash", "bank_transfer", "online"],
      required: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    confirmedBy: {
      type: String, // Có thể là "auto" hoặc ObjectId của kế toán
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentRecord", paymentRecordSchema);
