const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Models
const User = require('./src/models/user');
const Building = require('./src/models/building');
const Room = require('./src/models/room');
const SystemConfig = require('./src/models/systemConfig');
const ServiceFee = require('./src/models/serviceFee');
const RoomInvoice = require('./src/models/roomInvoice');
const PaymentRecord = require('./src/models/paymentRecord');
const MaintenanceRequest = require('./src/models/maintenanceRequest');
const Feedback = require('./src/models/feedback');
const Amenity = require('./src/models/amenity');

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/node_fullstack");
    console.log('Connected to MongoDB.');

    // --- 1. XÓA DỮ LIỆU CŨ ---
    console.log('Clearing old data...');
    await Building.deleteMany({});
    await Room.deleteMany({});
    await SystemConfig.deleteMany({});
    await User.deleteMany({});
    await ServiceFee.deleteMany({});
    await RoomInvoice.deleteMany({});
    await PaymentRecord.deleteMany({});
    await MaintenanceRequest.deleteMany({});
    await Feedback.deleteMany({});
    await Amenity.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("123456", salt);

    // --- 2. TẠO TÀI KHOẢN NHÂN VIÊN ---
    console.log('Creating Staff Accounts...');
    const roles = ["manager", "security", "accountant", "maintenance", "admin"];
    const staff = {};
    for (const role of roles) {
      staff[role] = await User.create({
        email: `${role}@abc.com`,
        password,
        name: `Nhân viên ${role.toUpperCase()}`,
        firstName: role.toUpperCase(),
        lastName: "Nhân viên",
        role: role,
        status: "active",
        is_active: true,
        is_blocked: false,
        phoneNumber: "0901234567"
      });
    }

    // --- 3. TẠO TÒA NHÀ ---
    console.log('Creating Building data...');
    const building = await Building.create({
      name: "ApartmentHub Premium Tower",
      address: "123 Tôn Dật Tiên, Quận 7, TP.HCM",
      totalFloors: 20,
      yearBuilt: 2024,
      status: "active",
      blocks: [
        { name: "Block A", totalApartments: 100 },
        { name: "Block B", totalApartments: 100 }
      ]
    });

    // --- 4. TẠO BIỂU PHÍ DỊCH VỤ ---
    console.log('Creating Service Fees...');
    await ServiceFee.insertMany([
      { name: "Điện sinh hoạt", type: "electricity", unit: "per_unit", price: 3500, effectiveFrom: new Date('2024-01-01') },
      { name: "Nước sinh hoạt", type: "water", unit: "per_unit", price: 18000, effectiveFrom: new Date('2024-01-01') },
      { name: "Phí quản lý", type: "management", unit: "per_sqm", price: 15000, effectiveFrom: new Date('2024-01-01') },
      { name: "Gửi xe máy", type: "parking", unit: "per_vehicle", price: 120000, effectiveFrom: new Date('2024-01-01') },
      { name: "Gửi ô tô", type: "parking", unit: "per_vehicle", price: 1200000, effectiveFrom: new Date('2024-01-01') }
    ]);

    // --- 5. TẠO CƯ DÂN, CĂN HỘ VÀ HÓA ĐƠN ---
    console.log('Creating Residents & Rooms & Invoices...');
    const residentNames = [
      "Trần Thu Hà", "Lê Văn Bảy", "Phạm Khắc Hiếu", "Nguyễn Minh Tuấn", 
      "Đỗ Thị Lệ", "Vũ Hoàng Bảo", "Bùi Thanh Trúc", "Hồ Ngọc Lan", 
      "Dương Tấn Phong", "Ngô Phương Thảo"
    ];
    const blocks = ["A", "B"];
    
    let isFirstResident = true;

    for (let i = 0; i < 10; i++) {
      const email = isFirstResident ? "resident@abc.com" : `resident${i+1}@abc.com`;
      const nameParts = residentNames[i].split(" ");
      
      const user = await User.create({
        email,
        password,
        name: residentNames[i],
        firstName: nameParts[nameParts.length - 1],
        lastName: nameParts.slice(0, nameParts.length - 1).join(" "),
        role: "resident",
        status: "active",
        is_active: true,
        is_blocked: false,
        phoneNumber: `09${Math.floor(10000000 + Math.random() * 90000000)}`
      });

      if (isFirstResident) isFirstResident = false;

      const block = blocks[i % 2];
      const floor = Math.floor(Math.random() * 10) + 1;
      const rNum = (floor < 10 ? `0${floor}` : floor) + `0${(i%5)+1}`;
      const roomNumber = `${block}${rNum}`;
      const area = 60 + Math.floor(Math.random() * 40);

      const room = await Room.create({
        roomNumber: roomNumber,
        status: "occupied",
        rentalPrice: 10000000 + (Math.random() * 5000000),
        description: `Căn hộ cao cấp tầng ${floor}`,
        area: area,
        block: block,
        tenantId: user._id
      });

      // Tạo hóa đơn cho 3 tháng gần nhất
      const months = ["2026-04", "2026-05", "2026-06"];
      for (let j = 0; j < 3; j++) {
        const month = months[j];
        const elec = Math.floor(Math.random() * 200) + 100;
        const water = Math.floor(Math.random() * 15) + 5;
        const elecPrice = elec * 3500;
        const waterPrice = water * 18000;
        const mgmtPrice = area * 15000;
        const total = elecPrice + waterPrice + mgmtPrice;

        const isPaid = j < 2; // Tháng 4, 5 đã thanh toán, tháng 6 chưa
        const status = isPaid ? "paid" : "unpaid";

        const invoice = await RoomInvoice.create({
          roomId: room._id,
          tenantId: user._id,
          month: month,
          period: `${month}-01`,
          dueDate: new Date(`${month}-15`),
          type: "monthly",
          oldElec: 0,
          newElec: elec,
          electricityFee: elecPrice,
          oldWater: 0,
          newWater: water,
          waterFee: waterPrice,
          serviceFee: mgmtPrice,
          totalBill: total,
          amount: total,
          status: status
        });

        if (isPaid) {
          await PaymentRecord.create({
            invoiceId: invoice._id,
            amount: total,
            method: "bank_transfer",
            note: "CK qua tài khoản VCB",
            confirmedBy: staff.accountant.name,
            paidAt: new Date(`${month}-10`)
          });
        }
      }

      // Random 1 yêu cầu bảo trì
      if (Math.random() > 0.5) {
        await MaintenanceRequest.create({
          residentId: user._id,
          title: "Sửa vòi nước bị rỉ",
          description: "Vòi nước bồn rửa chén rỉ rỉ cả ngày, nhờ kĩ thuật lên xem giúp.",
          category: "plumbing",
          urgency: "normal",
          status: "pending"
        });
      }

      // Random 1 Góp ý
      if (Math.random() > 0.5) {
        await Feedback.create({
          residentId: user._id,
          title: "Vệ sinh hành lang chưa kỹ",
          content: "Tôi thấy hành lang tầng 5 block A còn khá nhiều rác chưa được dọn từ hôm qua.",
          category: "cleanliness",
          rating: 3,
          status: "pending"
        });
      }
    }

    // Các phòng trống
    await Room.create({ roomNumber: "A0105", status: "available", rentalPrice: 12000000, description: "Căn tiêu chuẩn", area: 65, block: "A" });
    await Room.create({ roomNumber: "B0206", status: "maintenance", rentalPrice: 18000000, description: "Đang sửa chữa", area: 105, block: "B" });

    // --- 6. TẠO TIỆN ÍCH ---
    console.log('Creating Amenities...');
    await Amenity.create({
      name: "Hồ bơi vô cực",
      type: "pool",
      location: "Tầng thượng Block A",
      capacity: 50,
      openTime: "06:00",
      closeTime: "22:00",
      status: "available"
    });
    
    await Amenity.create({
      name: "Phòng Gym Cao cấp",
      type: "gym",
      location: "Tầng 3 Block B",
      capacity: 30,
      openTime: "05:00",
      closeTime: "23:00",
      status: "available"
    });

    // --- 7. TẠO SYSTEM CONFIG ---
    console.log('Creating System Config...');
    await SystemConfig.insertMany([
      { key: "app.name", value: "ApartmentHub Premium" },
      { key: "invoice.dueDays", value: 15 },
      { key: "invoice.lateFeePercent", value: 2 },
      { key: "guest.requireApproval", value: "true" }
    ]);

    console.log('=============================================');
    console.log('✅ SEED SUCCESSFUL! Dữ liệu mẫu ĐÃ SẴN SÀNG.');
    console.log('Tài khoản: [role]@abc.com (VD: resident@abc.com, manager@abc.com)');
    console.log('Mật khẩu chung: 123456');
    console.log('=============================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ SEED FAILED:', err);
    process.exit(1);
  }
};

seedDB();
