const parkingRepo = require("../repositories/parking.repository");

class ParkingService {
  async getParkings(residentId) {
    return await parkingRepo.findByResidentId(residentId);
  }

  async createParking(residentId, data) {
    // 1. Check trùng lặp Biển số trên toàn hệ thống
    const existing = await parkingRepo.findByLicensePlate(data.licensePlate);
    if (existing) {
      throw { status: 400, message: "Biển số xe này đã được đăng ký trong hệ thống" };
    }

    // 2. Business Rule: Số xe tối đa 2 xe/căn hộ
    const count = await parkingRepo.countByResidentId(residentId);
    if (count >= 2) {
      throw { status: 400, message: "Bạn đã đăng ký tối đa số lượng xe (2 xe/căn hộ)." };
    }

    return await parkingRepo.create({ ...data, residentId });
  }

  async updateParking(id, residentId, data) {
    const parking = await parkingRepo.findByIdAndResidentId(id, residentId);
    if (!parking) throw { status: 404, message: "Không tìm thấy thẻ xe" };

    if (parking.status !== "pending") {
      throw { status: 400, message: "Chỉ có thể chỉnh sửa thông tin khi đang chờ duyệt" };
    }

    if (data.licensePlate && data.licensePlate !== parking.licensePlate) {
      const existing = await parkingRepo.findByLicensePlate(data.licensePlate);
      if (existing) {
        throw { status: 400, message: "Biển số xe này đã được đăng ký trong hệ thống" };
      }
    }

    return await parkingRepo.updateById(id, data);
  }

  async deleteParking(id, residentId) {
    const parking = await parkingRepo.findByIdAndResidentId(id, residentId);
    if (!parking) throw { status: 404, message: "Không tìm thấy thẻ xe" };
    
    if (parking.status !== "pending") {
      throw { status: 400, message: "Chỉ có thể hủy thẻ xe khi đang chờ duyệt" };
    }

    return await parkingRepo.deleteById(id);
  }
}

module.exports = new ParkingService();
