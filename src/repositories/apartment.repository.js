const Room = require("../models/room");

class ApartmentRepository {
  async findByTenantId(tenantId) {
    return await Room.findOne({ tenantId }).populate("invoices");
  }

  async findById(id) {
    return await Room.findById(id);
  }
}

module.exports = new ApartmentRepository();
