const Amenity = require("../models/amenity");
const AmenityBooking = require("../models/amenityBooking");

class ManagerAmenityService {
  async getAmenities(query) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const amenities = await Amenity.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
      
    const total = await Amenity.countDocuments();

    return {
      data: amenities,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async createAmenity(data) {
    return await Amenity.create(data);
  }

  async updateAmenity(id, data) {
    return await Amenity.findByIdAndUpdate(id, data, { new: true });
  }

  async updateStatus(id, status) {
    return await Amenity.findByIdAndUpdate(id, { status }, { new: true });
  }

  async getBookings(id, query) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const bookings = await AmenityBooking.find({ amenityId: id })
      .populate("residentId", "name phoneNumber")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1, startTime: -1 });
      
    const total = await AmenityBooking.countDocuments({ amenityId: id });

    return {
      data: bookings,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async updateBookingStatus(bookingId, status) {
    const booking = await AmenityBooking.findByIdAndUpdate(bookingId, { status }, { new: true });
    if (!booking) throw { status: 404, message: "Không tìm thấy lượt đặt" };
    return booking;
  }
}

module.exports = new ManagerAmenityService();
