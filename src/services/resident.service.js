const residentRepo = require("../repositories/resident.repository");
const apartmentRepo = require("../repositories/apartment.repository");

class ResidentService {
  async getProfile(residentId) {
    const user = await residentRepo.findById(residentId);
    if (!user) throw { status: 404, message: "Resident not found" };
    
    // get apartment code
    const apartment = await apartmentRepo.findByTenantId(residentId);
    return {
      ...user.toObject(),
      apartmentCode: apartment ? apartment.roomNumber : null
    };
  }

  async updateProfile(residentId, data) {
    return await residentRepo.updateById(residentId, data);
  }
}

module.exports = new ResidentService();
