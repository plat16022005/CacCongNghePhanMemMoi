/**
 * Tính hóa đơn tiền phòng hàng tháng cho khách thuê trọ (Admin tool)
 * CHỨC NĂNG CÓ GÀI SẴN BUGS THEO YÊU CẦU CỦA FILE SKILL.MD PHỤC VỤ KIỂM THỬ
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
  let totalBill = 0;
  let detail = {};

  // ─── 1. TÍNH TIỀN PHÒNG & PHẠT TRỄ HẠN ──────────────────────────────────────
  let lateDays = Number(usage.lateDays) || 0;
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
  let roomPriceAfterPenalty = basePrice + penalty;
  detail.roomFee = basePrice;
  detail.penalty = penalty;

  // ─── 2. TÍNH TIỀN ĐIỆN BẬC THANG ───────────────────────────────────────────
  let oldElec = Number(usage.electricity.oldIndex) || 0;
  let newElec = Number(usage.electricity.newIndex) || 0;
  
  // <--- BUG 2: Không kiểm tra chỉ số mới nhỏ hơn chỉ số cũ (new < old)
  let elecKwh = newElec - oldElec;
  let elecPrice = 0;

  if (elecKwh > 0) {
    if (elecKwh < 50) { // <--- BUG 3: Lỗi biên bậc điện (lẽ ra phải là <= 50)
      elecPrice = elecKwh * 2000;
    } else if (elecKwh <= 100) {
      // Công thức tính bậc thang tương ứng bị lệch biên
      elecPrice = (49 * 2000) + ((elecKwh - 49) * 2500);
    } else if (elecKwh <= 200) {
      elecPrice = (49 * 2000) + (51 * 2500) + ((elecKwh - 100) * 3000);
    } else {
      elecPrice = (49 * 2000) + (51 * 2500) + (100 * 3000) + ((elecKwh - 200) * 4000);
    }
  }
  detail.electricityFee = elecPrice;

  // ─── 3. TÍNH TIỀN NƯỚC BẬC THANG ───────────────────────────────────────────
  let oldWater = Number(usage.water.oldIndex) || 0;
  let newWater = Number(usage.water.newIndex) || 0;
  let waterM3 = newWater - oldWater;
  let waterPrice = 0;

  if (waterM3 > 0) {
    if (waterM3 <= 10) {
      waterPrice = waterM3 * 10000;
    } else {
      waterPrice = (10 * 10000) + ((waterM3 - 10) * 15000);
    }
  }
  detail.waterFee = waterPrice;

  // ─── 4. PHỤ PHÍ DỊCH VỤ & PHÍ XE CỘ ────────────────────────────────────────
  let serviceFee = 0;
  if (room.services && room.services.length > 0) {
    let j = 0;
    while (j < room.services.length) {
      let svc = room.services[j];
      if (svc.type === "fixed") {
        serviceFee += Number(svc.price) || 0;
      } else if (svc.type === "per_person") {
        serviceFee += (Number(svc.price) || 0) * (Number(tenant.memberCount) || 1);
      }
      j++;
    }
  }
  
  // Tính phí xe máy
  let vehicleFee = 0;
  if (tenant.hasVehicle) {
    // <--- BUG 4: Thiếu kiểm tra kiểu dữ liệu hợp lệ (gây ra lỗi NaN nếu vehicleCount là undefined/null hoặc sai định dạng)
    vehicleFee = tenant.vehicleCount * 100000; 
  }
  detail.serviceFee = serviceFee;
  detail.vehicleFee = vehicleFee;

  // ─── 5. CHIẾT KHẤU HỢP ĐỒNG DÀI HẠN ────────────────────────────────────────
  let discount = 0;
  if (Number(tenant.contractMonths) >= 12) {
    discount = basePrice * 0.05; 
  }
  detail.discount = discount;

  // Tổng tiền hóa đơn
  totalBill = roomPriceAfterPenalty + elecPrice + waterPrice + serviceFee + vehicleFee - discount;
  detail.totalBill = totalBill;

  return detail;
}

module.exports = { calculateMonthlyInvoice };
