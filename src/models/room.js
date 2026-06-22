const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    floor: { type: Number, default: 1 },
    area: { type: Number, default: 0 },
    bedroomCount: { type: Number, default: 1 },
    bathroomCount: { type: Number, default: 1 },
    maxOccupants: { type: Number, default: 2 },
    rentalPrice: { type: Number, required: true },
    depositAmount: { type: Number, default: 0 },
    description: { type: String, default: "" },
    status: { type: String, enum: ['available', 'reserved', 'occupied', 'maintenance'], default: "available" },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    members: [{
      name: String,
      phoneNumber: String,
      cccdNumber: String,
      dob: String,
      occupation: String,
      gender: String,
      address: String,
      cccdFrontImage: String,
      cccdBackImage: String
    }],
    images: { type: [String], default: [] }
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
