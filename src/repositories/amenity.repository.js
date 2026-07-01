const Amenity = require("../models/amenity");
const AmenityBooking = require("../models/amenityBooking");

class AmenityRepository {
  async findAllAmenities() {
    return await Amenity.find({ status: { $ne: "closed" } });
  }

  async findAmenityById(id) {
    return await Amenity.findById(id);
  }

  async findBookingsByAmenityIdAndDate(amenityId, date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return await AmenityBooking.find({
      amenityId,
      date: { $gte: start, $lte: end },
      status: { $in: ["pending", "approved"] }
    });
  }

  async findBookingsByResidentId(residentId) {
    return await AmenityBooking.find({ residentId }).populate("amenityId").sort({ date: 1, startTime: 1 });
  }

  async createBooking(data) {
    return await AmenityBooking.create(data);
  }

  async deleteBookingByIdAndResidentId(id, residentId) {
    return await AmenityBooking.findOneAndDelete({ _id: id, residentId });
  }

  async findBookingByIdAndResidentId(id, residentId) {
    return await AmenityBooking.findOne({ _id: id, residentId });
  }
}

module.exports = new AmenityRepository();
