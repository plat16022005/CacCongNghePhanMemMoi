const mongoose = require("mongoose");

const amenitySlotSchema = new mongoose.Schema(
  {
    amenityId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Amenity', 
      required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    startTime: { 
      type: String, 
      required: true 
    }, // format "HH:mm"
    endTime: { 
      type: String, 
      required: true 
    },
    capacity: { 
      type: Number, 
      required: true 
    },
    bookedCount: { 
      type: Number, 
      default: 0, 
      min: 0 
    }
  }, 
  { timestamps: true }
);

// Đảm bảo mỗi khung giờ của 1 tiện ích chỉ có 1 slot document duy nhất
amenitySlotSchema.index({ amenityId: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

const AmenitySlot = mongoose.models.AmenitySlot || mongoose.model('AmenitySlot', amenitySlotSchema);
module.exports = AmenitySlot;
