const Guest = require("../models/guest");
const Notification = require("../models/notification");

class ManagerGuestService {
  async getGuests(query) {
    const { status, date, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);
      filter.visitDate = { $gte: d, $lt: nextD };
    }

    const guests = await Guest.find(filter)
      .populate("residentId", "name phoneNumber")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
      
    const total = await Guest.countDocuments(filter);

    return {
      data: guests,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    };
  }

  async updateGuestStatus(id, status, note) {
    const guest = await Guest.findByIdAndUpdate(id, { status, note }, { new: true });
    if (!guest) throw { status: 404, message: "Không tìm thấy khách" };

    // Create Notification
    await Notification.create({
      residentId: guest.residentId,
      title: `Đăng ký khách: ${status === "approved" ? "Đã duyệt" : "Từ chối"}`,
      content: status === "approved" 
        ? `Đăng ký khách "${guest.guestName}" đã được duyệt. Khách có thể quét QR để vào.` 
        : `Đăng ký khách "${guest.guestName}" bị từ chối. Lý do: ${note || 'Không có'}`,
      type: "general"
    });

    return guest;
  }
}

module.exports = new ManagerGuestService();
