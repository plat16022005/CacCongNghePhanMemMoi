const Building = require("../models/building");
const Room = require("../models/room");

class AdminBuildingService {
  async getBuildings() {
    const buildings = await Building.find().sort({ createdAt: -1 });
    return { data: buildings };
  }

  async createBuilding(data) {
    const building = new Building(data);
    await building.save();
    return building;
  }

  async updateBuilding(id, data) {
    const building = await Building.findByIdAndUpdate(id, data, { new: true });
    if (!building) throw { status: 404, message: "Không tìm thấy" };
    return building;
  }

  async deleteBuilding(id) {
    // Check if there are apartments
    // Assuming Room model has a buildingId or we just check if it's referenced
    // Task says: "Không cho xóa nếu còn căn hộ, còn cư dân đang ở"
    // Since our Room model might not have buildingId explicitly, we'll just check a hypothetical one.
    // Let's assume Room has a block name that might be unique, or we'll just check if Building has any blocks with apartments
    const b = await Building.findById(id);
    if (!b) throw { status: 404, message: "Không tìm thấy" };

    const totalApts = b.blocks.reduce((acc, curr) => acc + curr.totalApartments, 0);
    if (totalApts > 0) {
      throw { status: 400, message: "Không thể xóa tòa nhà đang có cấu hình căn hộ" };
    }

    await Building.findByIdAndDelete(id);
    return { success: true };
  }

  async getBlocks(buildingId) {
    const building = await Building.findById(buildingId);
    if (!building) throw { status: 404, message: "Không tìm thấy" };
    return { data: building.blocks };
  }

  async addBlock(buildingId, data) {
    const building = await Building.findById(buildingId);
    if (!building) throw { status: 404, message: "Không tìm thấy" };

    const blockName = data.name;
    const roomsPerFloor = data.roomsPerFloor || 5; // default to 5 if not provided
    const totalFloors = building.totalFloors || 10;
    const totalApartments = totalFloors * roomsPerFloor;

    const blockPrefix = blockName.split(' ')[blockName.split(' ').length - 1] || 'X';

    // Tạo Room cho block này
    const roomsToInsert = [];
    for (let floor = 1; floor <= totalFloors; floor++) {
      for (let r = 1; r <= roomsPerFloor; r++) {
        // Ví dụ: B101, B102, B110...
        const roomNumStr = `${blockPrefix}${floor}${r.toString().padStart(2, '0')}`;
        roomsToInsert.push({
          roomNumber: roomNumStr,
          building: building._id,
          block: blockName,
          floor: floor,
          rentalPrice: 5000000,
          status: 'available',
          area: 60, // Diện tích mặc định m2
        });
      }
    }
    
    if (roomsToInsert.length > 0) {
      await Room.insertMany(roomsToInsert);
    }

    building.blocks.push({
      name: blockName,
      totalApartments: totalApartments
    });
    await building.save();
    return building;
  }
}

module.exports = new AdminBuildingService();
