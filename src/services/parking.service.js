const parkingRepo = require("../repositories/parking.repository");

class ParkingService {
  async getParkings(residentId) {
    return await parkingRepo.findByResidentId(residentId);
  }

  async createParking(residentId, data) {
    // Business Rule: Số xe tối đa 2 xe/căn hộ
    const count = await parkingRepo.countByResidentId(residentId);
    if (count >= 2) {
      throw { status: 400, message: "Bạn đã đăng ký tối đa số lượng xe (2 xe/căn hộ)." };
    }

    return await parkingRepo.create({ ...data, residentId });
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
