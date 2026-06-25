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

    // Duplicate booking check could be added here
    
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
