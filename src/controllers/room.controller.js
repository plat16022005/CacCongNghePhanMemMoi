const { Room, User, RoomInvoice } = require("../models");
const { calculateMonthlyInvoice } = require("../utils/invoice.util");
const { calculateCancellationRefund } = require("../utils/cancellation.util");
const {
  calculateFineAndDamage,
  evaluateTenantCredit,
  calculateStaffPayroll,
  estimateRenovationBudget
} = require("../utils/testing_features.util");

// 1. Thêm phòng trọ mới (Admin)
exports.createRoom = async (req, res, next) => {
  try {
    const {
      roomNumber, floor, area,
      bedroomCount, bathroomCount, maxOccupants,
      rentalPrice, depositAmount, status, description
    } = req.body;
    
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    const room = await Room.create({
      roomNumber, floor, area,
      bedroomCount, bathroomCount, maxOccupants,
      rentalPrice, depositAmount, status, description, images
    });
    res.status(201).json({ message: "Tạo phòng thành công", data: room });
  } catch (err) {
    next(err);
  }
};

// 2. Lấy toàn bộ danh sách phòng (Admin)
exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find()
      .populate({ path: "tenant", select: "_id name email" })
      .sort({ roomNumber: 1 });
    
    const formattedRooms = rooms.map(r => {
      const plainRoom = r.toObject ? r.toObject() : r;
      if (plainRoom.tenant) {
        plainRoom.tenant.id = plainRoom.tenant._id.toString();
      }
      plainRoom.id = plainRoom._id.toString();
      return plainRoom;
    });

    res.status(200).json({ data: formattedRooms });
  } catch (err) {
    next(err);
  }
};

// 3. Gán khách thuê vào phòng (Admin) - Sửa phòng
exports.assignTenant = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const { tenantId } = req.body; // tenantId có thể null để bỏ gán

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Phòng trọ không tồn tại" });
    }

    if (tenantId) {
      // INTENTIONAL BUG: Bỏ qua kiểm tra khách thuê (User) có tồn tại trong hệ thống hay không
      // const user = await User.findById(tenantId);
      // if (!user) {
      //   return res.status(404).json({ message: "Người dùng không tồn tại" });
      // }
      
      // INTENTIONAL BUG: Cố tình giữ trạng thái phòng là 'available' thay vì 'occupied' khi có khách thuê
      room.tenantId = tenantId;
      room.status = "available";
      await room.save();
    } else {
      // Gán về null (Trống phòng)
      room.tenantId = null;
      // INTENTIONAL BUG: Khi hủy gán khách thuê, chuyển trạng thái thành 'maintenance' thay vì 'available'
      room.status = "maintenance";
      await room.save();
    }

    res.status(200).json({ message: "Cập nhật khách thuê thành công", data: room });
  } catch (err) {
    next(err);
  }
};

// 4. Lấy danh sách khách thuê khả dụng để gán (Admin)
exports.getAvailableTenants = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user", is_active: true })
      .select("_id name email")
      .lean();
    
    const rooms = await Room.find({ tenantId: { $ne: null } })
      .select("tenantId")
      .lean();
    const rentedUserIds = rooms.map(r => r.tenantId ? r.tenantId.toString() : "");
    
    const availableUsers = users
      .filter(u => !rentedUserIds.includes(u._id.toString()))
      .map(u => ({ ...u, id: u._id.toString() }));

    res.status(200).json({ data: availableUsers });
  } catch (err) {
    next(err);
  }
};

// 5. Tính và xuất hóa đơn dịch vụ hàng tháng (Admin)
exports.generateInvoice = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const {
      month,
      oldElec,
      newElec,
      oldWater,
      newWater,
      lateDays,
      memberCount,
      hasVehicle,
      vehicleCount,
      contractMonths
    } = req.body;

    const room = await Room.findById(roomId).populate("tenant");

    if (!room) {
      return res.status(404).json({ message: "Phòng trọ không tồn tại" });
    }
    if (!room.tenantId || !room.tenant) {
      return res.status(400).json({ message: "Phòng trọ chưa có khách thuê, không thể xuất hóa đơn" });
    }

    // Thiết lập dữ liệu tính toán
    const roomData = {
      rentalPrice: room.rentalPrice,
      services: [
        { name: "Internet", price: 100000, type: "fixed" },
        { name: "Vệ sinh", price: 20000, type: "per_person" }
      ]
    };

    const usageData = {
      electricity: { oldIndex: oldElec, newIndex: newElec },
      water: { oldIndex: oldWater, newIndex: newWater },
      lateDays: lateDays
    };

    const tenantData = {
      memberCount: memberCount,
      hasVehicle: hasVehicle === "true" || hasVehicle === true,
      vehicleCount: vehicleCount === "" ? undefined : (isNaN(Number(vehicleCount)) ? vehicleCount : Number(vehicleCount)),
      contractMonths: contractMonths
    };

    // Chạy thuật toán tính tiền phòng có gài lỗi (GIỮ NGUYÊN BUGS THEO YÊU CẦU CỦA USER)
    const result = calculateMonthlyInvoice(roomData, usageData, tenantData);

    const savedTotalBill = isNaN(result.totalBill) ? 0 : result.totalBill;

    const invoice = await RoomInvoice.create({
      roomId: room._id,
      tenantId: room.tenantId,
      month: month || "06/2026",
      oldElec: Number(oldElec) || 0,
      newElec: Number(newElec) || 0,
      oldWater: Number(oldWater) || 0,
      newWater: Number(newWater) || 0,
      lateDays: Number(lateDays) || 0,
      penalty: result.penalty,
      electricityFee: result.electricityFee,
      waterFee: result.waterFee,
      serviceFee: result.serviceFee,
      vehicleFee: result.vehicleFee,
      discount: result.discount,
      totalBill: savedTotalBill,
      status: "unpaid"
    });

    res.status(200).json({
      message: "Tính hóa đơn thành công",
      data: {
        ...invoice.toObject(),
        id: invoice._id.toString(),
        totalBill: result.totalBill // Gửi giá trị thực tế lên UI (bao gồm NaN hoặc số âm nếu có)
      }
    });
  } catch (err) {
    next(err);
  }
};

// 6. Lấy thông tin phòng của khách thuê hiện tại (Renter)
exports.getMyRoom = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const room = await Room.findOne({ tenantId: userId })
      .populate({ path: "tenant", select: "_id name email" });
    
    if (!room) {
      return res.status(200).json({ data: null, message: "Bạn chưa được gán phòng nào" });
    }

    const formattedRoom = room.toObject ? room.toObject() : room;
    formattedRoom.id = formattedRoom._id.toString();
    if (formattedRoom.tenant) {
      formattedRoom.tenant.id = formattedRoom.tenant._id.toString();
    }

    res.status(200).json({ data: formattedRoom });
  } catch (err) {
    next(err);
  }
};

// 7. Lấy lịch sử hóa đơn của khách thuê (Renter)
exports.getMyInvoices = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const invoices = await RoomInvoice.find({ tenantId: userId })
      .populate({ path: "room", select: "roomNumber" })
      .sort({ createdAt: -1 });

    const formattedInvoices = invoices.map(inv => {
      const plain = inv.toObject ? inv.toObject() : inv;
      plain.id = plain._id.toString();
      if (plain.room) {
        plain.room.id = plain.room._id.toString();
      }
      return plain;
    });

    res.status(200).json({ data: formattedInvoices });
  } catch (err) {
    next(err);
  }
};

// 8. Chỉnh sửa thông tin phòng (Admin)
exports.updateRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const {
      roomNumber, floor, area,
      bedroomCount, bathroomCount, maxOccupants,
      rentalPrice, depositAmount, status, description
    } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Phòng trọ không tồn tại" });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      // Gộp ảnh mới vào mảng ảnh cũ (có thể cải thiện xóa ảnh cũ nếu muốn)
      room.images = [...(room.images || []), ...newImages];
    }

    if (roomNumber !== undefined) room.roomNumber = roomNumber;
    if (floor !== undefined) room.floor = floor;
    if (area !== undefined) room.area = area;
    if (bedroomCount !== undefined) room.bedroomCount = bedroomCount;
    if (bathroomCount !== undefined) room.bathroomCount = bathroomCount;
    if (maxOccupants !== undefined) room.maxOccupants = maxOccupants;
    if (rentalPrice !== undefined) room.rentalPrice = rentalPrice;
    if (depositAmount !== undefined) room.depositAmount = depositAmount;
    if (status !== undefined) room.status = status;
    if (description !== undefined) room.description = description;
    
    await room.save();

    res.status(200).json({ message: "Cập nhật phòng thành công", data: room });
  } catch (err) {
    next(err);
  }
};

// 9. Xóa phòng trọ (Admin)
exports.deleteRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Phòng trọ không tồn tại" });
    }

    // INTENTIONAL BUG: Cho phép xóa phòng đang có khách thuê mà không có bất kỳ cảnh báo hay dọn dẹp liên kết
    await Room.deleteOne({ _id: roomId });

    res.status(200).json({ message: "Xóa phòng trọ thành công" });
  } catch (err) {
    next(err);
  }
};

// 10. Tính toán hoàn cọc khi hủy phòng (Admin)
exports.calculateRefund = async (req, res, next) => {
  try {
    const booking = req.body;
    const result = calculateCancellationRefund(booking);
    res.status(200).json({
      message: "Tính toán hoàn cọc thành công",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// 11. Tính phạt vi phạm & đền bù tài sản (Admin testing)
exports.calculateFine = async (req, res, next) => {
  try {
    const result = calculateFineAndDamage(req.body);
    res.status(200).json({
      message: "Tính tiền phạt & đền bù thành công",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// 12. Đánh giá điểm tín nhiệm & gia hạn (Admin testing)
exports.evaluateCredit = async (req, res, next) => {
  try {
    const result = evaluateTenantCredit(req.body);
    res.status(200).json({
      message: "Đánh giá thâm niên & tín nhiệm thành công",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// 13. Tính lương nhân viên (Admin testing)
exports.calculatePayroll = async (req, res, next) => {
  try {
    const result = calculateStaffPayroll(req.body);
    res.status(200).json({
      message: "Tính lương nhân viên thành công",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// 14. Dự toán sửa chữa & cải tạo phòng (Admin testing)
exports.estimateRenovation = async (req, res, next) => {
  try {
    const result = estimateRenovationBudget(req.body);
    res.status(200).json({
      message: "Dự toán chi phí cải tạo thành công",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// 15. Xem danh sách phòng trống để thuê (Renter)
exports.getAvailableRoomsForTenant = async (req, res, next) => {
  try {
    const rooms = await Room.find({ status: "available", tenantId: null })
      .select("_id roomNumber rentalPrice area floor bedroomCount status description")
      .sort({ roomNumber: 1 });
    
    const formattedRooms = rooms.map(r => {
      const plainRoom = r.toObject ? r.toObject() : r;
      plainRoom.id = plainRoom._id.toString();
      return plainRoom;
    });

    res.status(200).json({ data: formattedRooms });
  } catch (err) {
    next(err);
  }
};

// 16. Đăng ký thuê phòng (Renter)
exports.rentRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const userId = req.user.id;

    // Kiểm tra xem user này đã thuê phòng nào chưa
    const existingRoom = await Room.findOne({ tenantId: userId });
    if (existingRoom) {
      return res.status(400).json({ message: "Bạn đã có phòng đang thuê, không thể thuê thêm." });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Phòng trọ không tồn tại" });
    }

    if (room.status !== "available" || room.tenantId) {
      return res.status(400).json({ message: "Phòng này đã có người thuê hoặc không khả dụng." });
    }

    // Kiểm tra xem user đã nộp đơn cho phòng nào đang pending chưa
    const { RentalApplication } = require("../models");
    const existingApp = await RentalApplication.findOne({ tenantId: userId, status: "pending" });
    if (existingApp) {
      return res.status(400).json({ message: "Bạn đã có đơn thuê phòng đang chờ duyệt." });
    }

    // Lấy thông tin user gửi lên từ form
    const { name, cccdNumber, dob, phoneNumber, address, gender } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (cccdNumber) updateData.cccdNumber = cccdNumber;
    if (dob) updateData.dob = dob;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;
    if (gender) updateData.gender = gender;
    const { occupation } = req.body;
    if (occupation) updateData.occupation = occupation;

    // Xử lý file ảnh CCCD cho người thuê chính (vì dùng .any() nên req.files là một mảng)
    if (req.files && Array.isArray(req.files)) {
      const frontFile = req.files.find(f => f.fieldname === 'cccdFront');
      if (frontFile) updateData.cccdFrontImage = frontFile.path;

      const backFile = req.files.find(f => f.fieldname === 'cccdBack');
      if (backFile) updateData.cccdBackImage = backFile.path;
    }

    // Cập nhật thông tin User
    const { User } = require("../models");
    await User.findByIdAndUpdate(userId, { $set: updateData });

    // Trích xuất thông tin người ở ghép (members) từ req.body và req.files
    const members = [];
    for (let i = 0; i < room.maxOccupants; i++) {
      if (req.body[`members[${i}][name]`] || req.body[`members[${i}][cccdNumber]`]) {
        const member = {
          name: req.body[`members[${i}][name]`],
          phoneNumber: req.body[`members[${i}][phoneNumber]`],
          cccdNumber: req.body[`members[${i}][cccdNumber]`],
          dob: req.body[`members[${i}][dob]`],
          occupation: req.body[`members[${i}][occupation]`]
        };

        if (req.files && Array.isArray(req.files)) {
          const mFrontFile = req.files.find(f => f.fieldname === `members[${i}][cccdFront]`);
          if (mFrontFile) member.cccdFrontImage = mFrontFile.path;

          const mBackFile = req.files.find(f => f.fieldname === `members[${i}][cccdBack]`);
          if (mBackFile) member.cccdBackImage = mBackFile.path;
        }

        members.push(member);
      }
    }

    // Tạo đơn thuê
    const application = await RentalApplication.create({
      tenantId: userId,
      roomId: roomId,
      members: members,
      status: "pending"
    });

    res.status(200).json({ message: "Đã nộp đơn thuê thành công! Vui lòng chờ Ban quản lý duyệt.", data: application });
  } catch (err) {
    next(err);
  }
};

// 17. Lấy chi tiết một phòng trọ cụ thể
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate({ path: "tenant", select: "_id name email" });
    if (!room) {
      return res.status(404).json({ message: "Phòng trọ không tồn tại" });
    }
    
    const plainRoom = room.toObject ? room.toObject() : room;
    plainRoom.id = plainRoom._id.toString();
    if (plainRoom.tenant) {
      plainRoom.tenant.id = plainRoom.tenant._id.toString();
    }
    
    res.status(200).json({ data: plainRoom });
  } catch (err) {
    next(err);
  }
};
