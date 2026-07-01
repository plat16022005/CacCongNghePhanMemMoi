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

  async checkDuplicateGuest(residentId, cccd, visitDate, visitTime) {
    return await Guest.findOne({
      residentId,
      cccd,
      visitDate,
      visitTime,
      status: { $in: ["pending", "approved"] }
    });
  }
}

module.exports = new GuestRepository();
