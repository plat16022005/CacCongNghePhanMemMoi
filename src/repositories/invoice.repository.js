const RoomInvoice = require("../models/roomInvoice");

class InvoiceRepository {
  async findByTenantId(tenantId, filters = {}) {
    let query = { tenantId, ...filters };
    return await RoomInvoice.find(query).sort({ createdAt: -1 });
  }

  async findByIdAndTenantId(id, tenantId) {
    return await RoomInvoice.findOne({ _id: id, tenantId }).populate("room");
  }

  async updateStatus(id, status) {
    return await RoomInvoice.findByIdAndUpdate(id, { status }, { new: true });
  }
}

module.exports = new InvoiceRepository();
