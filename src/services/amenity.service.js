const amenityRepo = require("../repositories/amenity.repository");

class AmenityService {
  async getAmenities() {
    return await amenityRepo.findAllAmenities();
  }

  async getAvailableSlots(amenityId, date) {
    // A simplified slot calculation
    const amenity = await amenityRepo.findAmenityById(amenityId);
    if (!amenity) throw { status: 404, message: "Không tìm thấy tiện ích" };

    const bookings = await amenityRepo.findBookingsByAmenityIdAndDate(amenityId, date);
    
    // In a real scenario, we would calculate overlapping times and capacities
    return {
      amenity,
      bookings
    };
  }

  async getMyBookings(residentId) {
    return await amenityRepo.findBookingsByResidentId(residentId);
  }

  async createBooking(residentId, amenityId, data) {
    const amenity = await amenityRepo.findAmenityById(amenityId);
    if (!amenity) throw { status: 404, message: "Không tìm thấy tiện ích" };

    // Validate time format and order
    if (data.startTime >= data.endTime) {
      throw { status: 400, message: "Thời gian bắt đầu phải trước thời gian kết thúc" };
    }

    // Lôgic: Chặn đặt trước giờ mở cửa hoặc sau giờ đóng cửa
    if (data.startTime < amenity.openTime || data.endTime > amenity.closeTime) {
      throw { status: 400, message: `Tiện ích chỉ mở cửa từ ${amenity.openTime} đến ${amenity.closeTime}` };
    }

    // Lôgic: Chặn đặt quá 4 tiếng
    const startParts = data.startTime.split(':').map(Number);
    const endParts = data.endTime.split(':').map(Number);
    const durationMinutes = (endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1]);
    if (durationMinutes > 240) {
      throw { status: 400, message: "Không được đặt tiện ích quá 4 tiếng" };
    }

    // Lôgic 1: Chặn đặt lịch nếu có nợ xấu (hóa đơn chưa thanh toán quá hạn)
    const Room = require("../models/room");
    const RoomInvoice = require("../models/roomInvoice");
    const room = await Room.findOne({ tenantId: residentId });
    if (room) {
      const overdueInvoices = await RoomInvoice.find({ 
          roomId: room._id, 
          status: "unpaid",
          dueDate: { $lt: new Date() } 
      });
      if (overdueInvoices.length > 0) {
          throw { status: 403, message: "Yêu cầu bị từ chối: Căn hộ của bạn đang có hóa đơn nợ quá hạn. Vui lòng thanh toán để sử dụng tiện ích!" };
      }
    }

    // Lôgic 2: Kiểm tra trùng lịch và quá tải (Collision & Capacity Check) bằng Atomic Update (AmenitySlot)
    const AmenitySlot = require("../models/amenitySlot");
    const capacityLimit = amenity.capacity || 10;

    // Khởi tạo slot nếu chưa có (chỉ set giá trị khởi tạo khi insert)
    await AmenitySlot.updateOne(
      { amenityId, date: data.date, startTime: data.startTime, endTime: data.endTime },
      { $setOnInsert: { capacity: capacityLimit, bookedCount: 0 } },
      { upsert: true }
    );

    // Atomic update: chỉ tăng số lượng nếu tổng số người không vượt quá capacity
    const numberOfPeople = data.numberOfPeople || 1;
    const updatedSlot = await AmenitySlot.findOneAndUpdate(
      {
        amenityId, 
        date: data.date, 
        startTime: data.startTime, 
        endTime: data.endTime,
        $expr: { $lte: [{ $add: ["$bookedCount", numberOfPeople] }, "$capacity"] }
      },
      { $inc: { bookedCount: numberOfPeople } },
      { new: true }
    );

    if (!updatedSlot) {
      throw { status: 409, message: "Tiện ích đã đạt giới hạn sức chứa trong khung giờ này. Vui lòng chọn giờ khác hoặc giảm số lượng người." };
    }
    
    return await amenityRepo.createBooking({
      residentId,
      amenityId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      numberOfPeople: numberOfPeople,
      amenitySlotId: updatedSlot._id
    });
  }

  async cancelBooking(id, residentId) {
    const booking = await amenityRepo.findBookingByIdAndResidentId(id, residentId);
    if (!booking) throw { status: 404, message: "Không tìm thấy lịch đặt" };

    const bookingDate = new Date(booking.date);
    const today = new Date();
    bookingDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    if (bookingDate.getTime() === today.getTime()) {
      const [startHour, startMin] = booking.startTime.split(':').map(Number);
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMin = currentTime.getMinutes();
      
      const diffMinutes = (startHour * 60 + startMin) - (currentHour * 60 + currentMin);
      if (diffMinutes >= 0 && diffMinutes <= 60) {
        throw { status: 400, message: "Không thể hủy lịch đặt sát giờ (trước 1 tiếng)" };
      } else if (diffMinutes < 0) {
        throw { status: 400, message: "Lịch đặt đã qua, không thể hủy" };
      }
    } else if (bookingDate < today) {
       throw { status: 400, message: "Lịch đặt đã qua, không thể hủy" };
    }

    const deleted = await amenityRepo.deleteBookingByIdAndResidentId(id, residentId);
    
    // Giảm bookedCount trong AmenitySlot
    const AmenitySlot = require("../models/amenitySlot");
    await AmenitySlot.findOneAndUpdate(
      { 
        amenityId: booking.amenityId, 
        date: booking.date, 
        startTime: booking.startTime, 
        endTime: booking.endTime 
      },
      { $inc: { bookedCount: -(booking.numberOfPeople || 1) } }
    );

    return true;
  }
}

module.exports = new AmenityService();
