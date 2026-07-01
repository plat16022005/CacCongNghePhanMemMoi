const guestRepo = require("../repositories/guest.repository");

class GuestService {
  async getGuests(residentId) {
    return await guestRepo.findByResidentId(residentId);
  }

  async createGuest(residentId, data) {
    const today = new Date();
    
    // 1. Kiểm tra ngày/giờ trong quá khứ theo múi giờ Việt Nam
    const visitDate = new Date(data.visitDate);
    // Tính toán đầu ngày hôm nay để so sánh
    today.setHours(0, 0, 0, 0);
    visitDate.setHours(0, 0, 0, 0);
    
    if (visitDate.getTime() === today.getTime()) {
      if (data.visitTime) {
        const [hours, minutes] = data.visitTime.split(':').map(Number);
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        if (hours < currentHours || (hours === currentHours && minutes < currentMinutes)) {
          throw { status: 400, message: "Không thể chọn giờ đến trong quá khứ của ngày hôm nay" };
        }
      }
    } else if (visitDate.getTime() < today.getTime()) {
       throw { status: 400, message: "Không thể chọn ngày trong quá khứ" };
    }

    // 2. Chặn đăng ký trùng lặp (cùng CCCD, cùng ngày, cùng khung giờ)
    const existingGuest = await guestRepo.checkDuplicateGuest(
      residentId,
      data.cccd,
      data.visitDate,
      data.visitTime
    );
    if (existingGuest) {
      throw { status: 400, message: "Khách này đã được đăng ký trong cùng khung giờ" };
    }

    // 3. Quyền duyệt tự động/thủ công và Giới hạn duyệt
    let status = "pending";
    let approvedBy = null;
    
    // Tự động duyệt nếu là người thân (Family)
    if (data.purpose && data.purpose.toLowerCase().includes("gia đình")) {
      const SystemConfig = require("../models/systemConfig");
      const Guest = require("../models/guest");
      
      const configLimit = await SystemConfig.findOne({ key: "GUEST_AUTO_APPROVE_DAILY_LIMIT" });
      const AUTO_APPROVE_DAILY_LIMIT = configLimit ? parseInt(configLimit.value) : 2;
      
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);
      
      const autoApprovedTodayCount = await Guest.countDocuments({
        residentId: residentId,
        purpose: data.purpose,
        status: "approved",
        createdAt: { $gte: todayStart, $lte: todayEnd }
      });
      
      if (autoApprovedTodayCount < AUTO_APPROVE_DAILY_LIMIT) {
        status = "approved";
        // Có thể lưu thêm field approvedBy nếu schema hỗ trợ, hoặc ngầm hiểu
      }
    }

    // 4. Giới hạn số lượng (bảo vệ 2 lớp, lớp 1 ở Validation)
    const numberOfGuests = data.numberOfGuests ? parseInt(data.numberOfGuests) : 1;
    if (numberOfGuests > 10) {
      throw { status: 400, message: "Giới hạn đăng ký tối đa 10 khách mỗi lần" };
    }

    return await guestRepo.create({ ...data, residentId, status, numberOfGuests });
  }

  async deleteGuest(id, residentId) {
    const guest = await guestRepo.findByIdAndResidentId(id, residentId);
    if (!guest) throw { status: 404, message: "Không tìm thấy đăng ký khách" };
    
    // Chỉ hủy khi status = pending và visitDate chưa qua
    if (guest.status !== "pending") {
      throw { status: 400, message: "Chỉ có thể hủy đăng ký khi đang chờ duyệt" };
    }
    
    const visitDate = new Date(guest.visitDate);
    visitDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (visitDate.getTime() < today.getTime()) {
      throw { status: 400, message: "Không thể hủy lịch của ngày đã qua" };
    }

    return await guestRepo.deleteById(id);
  }
}

module.exports = new GuestService();
