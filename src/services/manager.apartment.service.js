const Room = require("../models/room");
const User = require("../models/user");

class ManagerApartmentService {
  async getApartments(query) {
    const { block, floor, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (block) filter.block = block;
    if (floor) filter.floor = floor;
    if (status) filter.status = status;

    const apartments = await Room.find(filter)
      .populate("tenantId", "name email phoneNumber")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ roomNumber: 1 });
      
    const total = await Room.countDocuments(filter);

    return {
      data: apartments,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async getApartmentById(id) {
    return await Room.findById(id).populate("tenantId");
  }

  async updateApartment(id, data) {
    // Khi chuyển sang trống, xóa tenantId
    if (data.status === "available" || data.status === "vacant") {
      data.tenantId = null;
      data.status = "available"; // Normalize
    }
    return await Room.findByIdAndUpdate(id, data, { new: true });
  }

  async updateStatus(id, status) {
    return await Room.findByIdAndUpdate(id, { status }, { new: true });
  }
}

module.exports = new ManagerApartmentService();
