const Guest = require("../models/guest");

class GuestRepository {
  async create(data) {
    return await Guest.create(data);
  }

  async findByResidentId(residentId) {
    return await Guest.find({ residentId }).sort({ createdAt: -1 });
  }

  async findByIdAndResidentId(id, residentId) {
    return await Guest.findOne({ _id: id, residentId });
  }

  async deleteById(id) {
    return await Guest.findByIdAndDelete(id);
  }
}

module.exports = new GuestRepository();
