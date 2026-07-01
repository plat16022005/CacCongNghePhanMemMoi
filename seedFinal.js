const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/user');
const Room = require('./src/models/room');
const ParkingRegistration = require('./src/models/parkingRegistration');
const ViewingRequest = require('./src/models/viewingRequest');
const Notification = require('./src/models/notification');
const Incident = require('./src/models/incident');

const seedFinal = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/apartment_hub");
    console.log('Connected. Seeding final missing data...');

    await ParkingRegistration.deleteMany({});
    await ViewingRequest.deleteMany({});
    await Notification.deleteMany({});
    await Incident.deleteMany({});

    const residentUser = await User.findOne({ email: "resident@abc.com" });
    const managerUser = await User.findOne({ email: "manager@abc.com" });
    const availableRoom = await Room.findOne({ status: "available" });

    // 1. Parking Registration
    if (residentUser) {
      await ParkingRegistration.create({
        residentId: residentUser._id,
        vehicleType: "car",
        licensePlate: "51F-123.45",
        vehicleBrand: "VinFast VF8",
        vehicleColor: "Xanh lục",
        status: "approved",
        slotNumber: "A-012"
      });
      await ParkingRegistration.create({
        residentId: residentUser._id,
        vehicleType: "motorbike",
        licensePlate: "59K1-999.99",
        vehicleBrand: "Honda SH",
        vehicleColor: "Trắng",
        status: "pending"
      });
    }

    // 2. Viewing Requests
    if (availableRoom) {
      await ViewingRequest.create({
        roomId: availableRoom._id,
        fullName: "Khách Hàng A",
        phoneNumber: "0909090909",
        preferredDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        preferredTimeSlot: "morning",
        note: "Tôi muốn xem phòng vào cuối tuần nếu được.",
        status: "pending"
      });
      
      await ViewingRequest.create({
        roomId: availableRoom._id,
        fullName: "Khách Hàng B",
        phoneNumber: "0808080808",
        preferredDate: new Date(),
        preferredTimeSlot: "afternoon",
        note: "Liên hệ tôi qua zalo",
        status: "contacted",
        handledBy: managerUser ? managerUser._id : null
      });
    }

    // 3. Notifications
    await Notification.create({
      title: "Thông báo cắt nước định kỳ",
      content: "Ban quản lý xin thông báo sẽ tạm ngưng cấp nước vào 14h chiều chủ nhật tuần này để bảo trì bể ngầm.",
      type: "announcement",
      isRead: false
    });
    
    if (residentUser) {
      await Notification.create({
        residentId: residentUser._id,
        title: "Nhắc nhở thanh toán hóa đơn",
        content: "Hóa đơn tháng 06-2026 của quý khách đã quá hạn. Vui lòng thanh toán sớm để tránh bị phạt.",
        type: "invoice_reminder",
        isRead: false
      });
    }

    // 4. Incidents (Security)
    await Incident.create({
      title: "Cháy bóng đèn hành lang tầng 5",
      description: "Có mùi khét từ bảng điện nhỏ ở hành lang A-Tầng 5.",
      location: "Hành lang Block A, Tầng 5",
      severity: "medium",
      status: "open",
      reportedBy: "Nguyễn Bảo Vệ 1"
    });

    console.log('✅ FINAL SEED SUCCESSFUL! Dữ liệu đã tròn vành rõ chữ để demo.');
    process.exit(0);
  } catch (err) {
    console.error('❌ FINAL SEED FAILED:', err);
    process.exit(1);
  }
};

seedFinal();
