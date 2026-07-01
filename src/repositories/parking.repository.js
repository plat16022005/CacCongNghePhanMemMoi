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

  async findByLicensePlate(licensePlate) {
    return await ParkingRegistration.findOne({ licensePlate, status: { $ne: "rejected" } });
  }

  async updateById(id, data) {
    return await ParkingRegistration.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new ParkingRepository();
