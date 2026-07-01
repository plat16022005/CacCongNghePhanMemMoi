const mongoose = require("mongoose");

const viewingRequestSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    preferredTimeSlot: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true
    },
    note: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "scheduled", "cancelled"],
      default: "pending"
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

const ViewingRequest = mongoose.models.ViewingRequest || mongoose.model("ViewingRequest", viewingRequestSchema);
module.exports = ViewingRequest;
