const ParkingRegistration = require("../models/parkingRegistration");
const VehicleLog = require("../models/vehicleLog");
const Room = require("../models/room");

class SecurityVehicleService {
  async lookupVehicle(licensePlate) {
    // Xóa các ký tự không phải chữ/số
    const cleanPlate = licensePlate.replace(/[^a-zA-Z0-9]/g, '');
    // Tạo regex cho phép các ký tự đặc biệt (khoảng trắng, dấu gạch) xen giữa
    const regexStr = cleanPlate.split('').join('[^a-zA-Z0-9]*');
    
    const reg = await ParkingRegistration.findOne({ licensePlate: new RegExp(`^[^a-zA-Z0-9]*${regexStr}[^a-zA-Z0-9]*$`, 'i') })
      .populate("residentId", "name");
    
    if (!reg) return { found: false };

    // Tìm phòng của cư dân
    const room = await Room.findOne({ tenantId: reg.residentId._id });

    return {
      found: true,
      licensePlate: reg.licensePlate,
      vehicleType: reg.vehicleType,
      owner: reg.residentId ? reg.residentId.name : "N/A",
      apartment: room ? room.roomNumber : "N/A",
      registrationStatus: reg.status,
      brand: reg.vehicleBrand || reg.brand || "---",
      color: reg.vehicleColor || reg.color || "---"
    };
  }

  async logVehicleAction(data) {
    const { licensePlate, action, note, securityId } = data;
    
    const log = new VehicleLog({
      licensePlate,
      action,
      note,
      securityId
    });

    await log.save();
    return log;
  }
}

module.exports = new SecurityVehicleService();
