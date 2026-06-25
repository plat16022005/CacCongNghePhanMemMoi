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

    // Lôgic 2: Kiểm tra trùng lịch và quá tải (Collision & Capacity Check)
    const existingBookings = await amenityRepo.findBookingsByAmenityIdAndDate(amenityId, data.date);
    const overlappingBookings = existingBookings.filter(b => {
      // Check if time ranges overlap
      return (data.startTime < b.endTime && data.endTime > b.startTime);
    });

    const currentPeopleCount = overlappingBookings.reduce((sum, b) => sum + b.numberOfPeople, 0);
    const capacityLimit = amenity.capacity || 10; // Default if not specified

    if (currentPeopleCount + data.numberOfPeople > capacityLimit) {
      throw { status: 400, message: `Tiện ích đã đạt giới hạn sức chứa trong khung giờ này. Sức chứa còn lại: ${Math.max(0, capacityLimit - currentPeopleCount)} người.` };
    }
    
    return await amenityRepo.createBooking({
      residentId,
      amenityId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      numberOfPeople: data.numberOfPeople
    });
  }

  async cancelBooking(id, residentId) {
    const deleted = await amenityRepo.deleteBookingByIdAndResidentId(id, residentId);
    if (!deleted) throw { status: 404, message: "Không tìm thấy lịch đặt" };
    return true;
  }
}

module.exports = new AmenityService();
