const guestRepo = require("../repositories/guest.repository");

class GuestService {
  async getGuests(residentId) {
    return await guestRepo.findByResidentId(residentId);
  }

  async createGuest(residentId, data) {
    return await guestRepo.create({ ...data, residentId });
  }

  async deleteGuest(id, residentId) {
    const guest = await guestRepo.findByIdAndResidentId(id, residentId);
    if (!guest) throw { status: 404, message: "Không tìm thấy đăng ký khách" };
    
    // Chỉ hủy khi status = pending và visitDate chưa qua
    if (guest.status !== "pending") {
      throw { status: 400, message: "Chỉ có thể hủy đăng ký khi đang chờ duyệt" };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(guest.visitDate) < today) {
      throw { status: 400, message: "Không thể hủy lịch của ngày đã qua" };
    }

    return await guestRepo.deleteById(id);
  }
}

module.exports = new GuestService();
