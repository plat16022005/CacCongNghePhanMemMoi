/**
 * Tính số tiền phạt chậm nộp tiền phòng (BUG 1 gài sẵn ở đây)
 * @param {number} basePrice 
 * @param {number} lateDays 
 * @returns {Object} { roomFee, penalty }
 */
function calculateRoomPriceAndPenalty(basePrice, lateDays) {
  let penalty = 0;
  if (lateDays > 0) {
    if (lateDays <= 5) {
      penalty = basePrice * 0.02 * lateDays;
    } else if (lateDays > 5 && lateDays < 15) { // <--- BUG 1: Lỗi biên ngày 15 (lẽ ra phải là <= 15)
      penalty = basePrice * 0.05 * lateDays;
    } else {
      penalty = basePrice * 0.10 * lateDays;
    }
  }
  return { roomFee: basePrice, penalty: penalty };
}

/**
 * Tính tổng phí dịch vụ điện và nước tiêu thụ bậc thang (16-20 Nodes phục vụ kiểm thử)
 * CHỨC NĂNG CÓ GÀI BUGS 2 & 3
 * @param {Object} electricity - { oldIndex, newIndex }
 * @param {Object} water - { oldIndex, newIndex }
 * @returns {Object} { electricityFee, waterFee }
 */
function calculateElectricityAndWaterFee(electricity, water) {
  if (!electricity || !water) {
    return { electricityFee: 0, waterFee: 0 };
  }

  // --- 1. TÍNH TIỀN ĐIỆN BẬC THANG ---
  let oldElec = Number(electricity.oldIndex) || 0;
  let newElec = Number(electricity.newIndex) || 0;
  
  // <--- BUG 2: Không kiểm tra chỉ số mới nhỏ hơn chỉ số cũ (new < old)
  let elecKwh = newElec - oldElec;
  let elecPrice = 0;

  if (elecKwh > 0) {
    if (elecKwh < 50) { // <--- BUG 3: Lỗi biên bậc điện (lẽ ra phải là <= 50)
      elecPrice = elecKwh * 2000;
    } else if (elecKwh <= 100) {
      elecPrice = (49 * 2000) + ((elecKwh - 49) * 2500);
    } else if (elecKwh <= 200) {
      elecPrice = (49 * 2000) + (51 * 2500) + ((elecKwh - 100) * 3000);
    } else {
      elecPrice = (49 * 2000) + (51 * 2500) + (100 * 3000) + ((elecKwh - 200) * 4000);
    }
  }

  // --- 2. TÍNH TIỀN NƯỚC BẬC THANG ---
  let oldWater = Number(water.oldIndex) || 0;
  let newWater = Number(water.newIndex) || 0;
  let waterM3 = newWater - oldWater;
  let waterPrice = 0;

  if (waterM3 > 0) {
    if (waterM3 <= 10) {
      waterPrice = waterM3 * 10000;
    } else {
      waterPrice = (10 * 10000) + ((waterM3 - 10) * 15000);
    }
  }

  return {
    electricityFee: elecPrice,
    waterFee: waterPrice
  };
}

/**
 * Tính phụ phí dịch vụ cố định/theo người và phí gửi xe máy (BUG 4 gài sẵn ở đây)
 * @param {Array} services 
 * @param {number} memberCount 
 * @param {boolean} hasVehicle 
 * @param {any} vehicleCount 
 * @returns {Object} { serviceFee, vehicleFee }
 */
function calculateServiceAndVehicleFee(services, memberCount, hasVehicle, vehicleCount) {
  let serviceFee = 0;
  if (services && services.length > 0) {
    let j = 0;
    while (j < services.length) {
      let svc = services[j];
      if (svc.type === "fixed") {
        serviceFee += Number(svc.price) || 0;
      } else if (svc.type === "per_person") {
        serviceFee += (Number(svc.price) || 0) * (Number(memberCount) || 1);
      }
      j++;
    }
  }
  
  let vehicleFee = 0;
  if (hasVehicle) {
    // <--- BUG 4: Thiếu kiểm tra kiểu dữ liệu hợp lệ (gây ra lỗi NaN nếu vehicleCount sai định dạng)
    vehicleFee = vehicleCount * 100000; 
  }
  return { serviceFee, vehicleFee };
}

/**
 * Tính chiết khấu hợp đồng dài hạn
 * @param {number} basePrice 
 * @param {number} contractMonths 
 * @returns {number} discount
 */
function calculateContractDiscount(basePrice, contractMonths) {
  let discount = 0;
  if (Number(contractMonths) >= 12) {
    discount = basePrice * 0.05; 
  }
  return discount;
}

/**
 * Tính hóa đơn tiền phòng hàng tháng cho khách thuê trọ (Admin tool)
 * CHỨC NĂNG CÓ GÀI SẴN BUGS PHỤC VỤ KIỂM THỬ
 * @param {Object} room - Thông tin phòng trọ
 * @param {Object} usage - Chỉ số điện nước tiêu thụ trong tháng
 * @param {Object} tenant - Thông tin khách thuê
 * @returns {Object} Hóa đơn chi tiết và tổng tiền
 */
function calculateMonthlyInvoice(room, usage, tenant) {
  // Kiểm tra đầu vào hợp lệ
  if (!room || !usage || !tenant) {
    throw new Error("Dữ liệu đầu vào không hợp lệ");
  }

  let basePrice = Number(room.basePrice) || 0;
  let lateDays = Number(usage.lateDays) || 0;

  // 1. Tiền phòng & phạt trễ hạn (Nhánh tính phạt có BUG 1)
  let roomPenalty = calculateRoomPriceAndPenalty(basePrice, lateDays);

  // 2 & 3. Tiền điện & nước bậc thang (Gộp chung hàm tính tiện ích có BUG 2 & BUG 3)
  let utilFees = calculateElectricityAndWaterFee(usage.electricity, usage.water);
  let electricityFee = utilFees.electricityFee;
  let waterFee = utilFees.waterFee;

  // 4. Phụ phí dịch vụ & phí xe cộ (Nhánh tính xe máy có BUG 4)
  let services = room.services || [];
  let memberCount = tenant.memberCount;
  let hasVehicle = tenant.hasVehicle;
  let vehicleCount = tenant.vehicleCount;
  let serviceVehicle = calculateServiceAndVehicleFee(services, memberCount, hasVehicle, vehicleCount);

  // 5. Chiết khấu hợp đồng dài hạn
  let contractMonths = tenant.contractMonths;
  let discount = calculateContractDiscount(basePrice, contractMonths);

  // Tổng tiền hóa đơn
  let totalBill = (basePrice + roomPenalty.penalty) + electricityFee + waterFee + serviceVehicle.serviceFee + serviceVehicle.vehicleFee - discount;

  return {
    roomFee: basePrice,
    penalty: roomPenalty.penalty,
    electricityFee: electricityFee,
    waterFee: waterFee,
    serviceFee: serviceVehicle.serviceFee,
    vehicleFee: serviceVehicle.vehicleFee,
    discount: discount,
    totalBill: totalBill
  };
}

module.exports = {
  calculateRoomPriceAndPenalty,
  calculateElectricityAndWaterFee,
  calculateServiceAndVehicleFee,
  calculateContractDiscount,
  calculateMonthlyInvoice
};
