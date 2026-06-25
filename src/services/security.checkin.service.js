const Guest = require("../models/guest");
const Room = require("../models/room");
const User = require("../models/user"); // Admin/Resident fallback

class SecurityCheckinService {
  async processQR(qrData) {
    // qrData is expected to be guestId in this mock implementation
    // In real-world, it would be decoded and verified (e.g. JWT)
    const guestId = qrData;
    const guest = await Guest.findById(guestId).populate("residentId", "name");
    
    if (!guest) {
      return { valid: false, reason: "QR_NOT_FOUND", message: "Không tìm thấy thông tin đăng ký cho mã QR này." };
    }

    if (guest.qrUsed || guest.status === "checked_in" || guest.status === "checked_out") {
      return { valid: false, reason: "QR_ALREADY_USED", message: "Mã QR này đã được sử dụng." };
    }

    if (guest.status === "rejected") {
      return { valid: false, reason: "GUEST_REJECTED", message: "Đăng ký này đã bị từ chối bởi BQL." };
    }

    const today = new Date();
    const visitDate = new Date(guest.visitDate);
    if (visitDate.toDateString() !== today.toDateString()) {
      return { valid: false, reason: "DATE_MISMATCH", message: "Mã QR không có hiệu lực trong ngày hôm nay." };
    }

    // Mark as checked in
    guest.status = "checked_in";
    guest.qrUsed = true;
    guest.checkinTime = new Date();
    await guest.save();

    // Resident might not be properly populated if it's mock
    const residentName = guest.residentId ? guest.residentId.name : "N/A";
    
    return {
      valid: true,
      guestName: guest.guestName,
      guestPhone: guest.phone,
      visitApartment: "Liên hệ Cư dân", // Mock, ideally fetch Room
      residentName: residentName,
      purpose: guest.purpose || "Thăm gia đình",
      checkinTime: guest.checkinTime,
      message: "Khách hợp lệ, đã ghi nhận vào"
    };
  }

  async manualCheckin(data) {
    // Find if the apartment exists to link
    const room = await Room.findOne({ roomNumber: data.visitApartmentCode }).populate("tenantId");
    const residentId = room && room.tenantId ? room.tenantId._id : null;

    // Create a new Guest record directly checked in
    const guest = new Guest({
      residentId: residentId || null, // Allow null if not found (requires schema tweak or mock data)
      guestName: data.guestName,
      phone: data.guestPhone,
      cccd: data.guestIdCard || "N/A",
      visitDate: new Date(),
      purpose: data.purpose,
      note: data.note,
      type: "manual",
      status: "checked_in",
      checkinTime: new Date(),
      apartmentNumber: data.visitApartmentCode
    });

    // If residentId is required in Schema, and room is not found, we fetch an admin ID to bypass
    if (!residentId) {
       const fallbackUser = await User.findOne({ role: "admin" });
       if(fallbackUser) guest.residentId = fallbackUser._id;
    }

    await guest.save();
    return guest;
  }

  async checkout(guestId) {
    const guest = await Guest.findById(guestId);
    if (!guest) throw { status: 404, message: "Không tìm thấy khách" };

    if (guest.status !== "checked_in") {
      throw { status: 400, message: "Khách chưa check-in hoặc đã check-out" };
    }

    guest.status = "checked_out";
    guest.checkoutTime = new Date();
    await guest.save();

    return guest;
  }

  async getGuestsToday(statusParam) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let filter = { visitDate: { $gte: startOfDay, $lte: endOfDay } };
    
    if (statusParam && statusParam !== "all") {
      filter.status = statusParam;
    }

    const guests = await Guest.find(filter).populate("residentId", "name").lean();
    
    for (let guest of guests) {
      if (!guest.apartmentNumber && guest.residentId) {
        const room = await Room.findOne({ tenantId: guest.residentId._id }).select("roomNumber");
        guest.apartmentNumber = room ? room.roomNumber : "Không rõ";
      }
    }
    return { data: guests };
  }

  async lookupGuests(q, date) {
    let filter = {};
    if (q) {
      filter.$or = [
        { guestName: new RegExp(q, "i") },
        { phone: new RegExp(q, "i") }
      ];
    }
    if (date) {
      const d = new Date(date);
      d.setHours(0,0,0,0);
      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);
      filter.visitDate = { $gte: d, $lt: nextD };
    }

    const guests = await Guest.find(filter).populate("residentId", "name").sort({ visitDate: -1 }).limit(50).lean();
    for (let guest of guests) {
      if (!guest.apartmentNumber && guest.residentId) {
        const room = await Room.findOne({ tenantId: guest.residentId._id }).select("roomNumber");
        guest.apartmentNumber = room ? room.roomNumber : "Không rõ";
      }
    }
    return { data: guests };
  }
}

module.exports = new SecurityCheckinService();
