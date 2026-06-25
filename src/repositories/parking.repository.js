const ParkingRegistration = require("../models/parkingRegistration");

class ParkingRepository {
  async create(data) {
    return await ParkingRegistration.create(data);
  }

  async findByResidentId(residentId) {
    return await ParkingRegistration.find({ residentId }).sort({ createdAt: -1 });
  }

  async countByResidentId(residentId) {
    return await ParkingRegistration.countDocuments({ residentId });
  }

  async findByIdAndResidentId(id, residentId) {
    return await ParkingRegistration.findOne({ _id: id, residentId });
  }

  async deleteById(id) {
    return await ParkingRegistration.findByIdAndDelete(id);
  }
}

module.exports = new ParkingRepository();
