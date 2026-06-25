const ParkingRegistration = require("../models/parkingRegistration");
const Notification = require("../models/notification");

class ManagerParkingService {
  async getParkings(query) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;

    const parkings = await ParkingRegistration.find(filter)
      .populate("residentId", "name phoneNumber")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
      
    const total = await ParkingRegistration.countDocuments(filter);

    return {
      data: parkings,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async updateParkingStatus(id, status) {
    const parking = await ParkingRegistration.findByIdAndUpdate(id, { status }, { new: true });
    if (!parking) throw { status: 404, message: "Không tìm thấy thẻ xe" };

    await Notification.create({
      residentId: parking.residentId,
      title: `Đăng ký thẻ xe: ${status === "approved" ? "Đã duyệt" : "Từ chối"}`,
      content: `Đăng ký thẻ xe biển số ${parking.licensePlate} đã ${status === "approved" ? "được duyệt" : "bị từ chối"}.`,
      type: "general"
    });

    return parking;
  }
}

module.exports = new ManagerParkingService();
