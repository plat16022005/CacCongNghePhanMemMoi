/**
 * 1. Bộ tính tiền phạt vi phạm & Đền bù thiết bị (Fine & Damage Calculator)
 * GÀI SẴN BUGS:
 * - Bug 1.1: Khấu hao thiết bị dùng > 5 năm tính ra tiền đền bù âm.
 * - Bug 1.2: Bỏ sót điều kiện gỗ dùng 3 năm (nhảy vào loại thiết bị khác).
 * - Bug 1.3: Đúng 5 lần vi phạm tính sai mức phạt lũy tiến.
 * 
 * Quy mô CFG: ~22 Nodes.
 */
function calculateFineAndDamage(payload) {
  if (!payload) return { total: 0, penalty: 0, compensation: 0, status: "INVALID" };

  let totalFines = 0;
  let totalCompensation = 0;
  let violations = Number(payload.violationsCount) || 0;
  let items = payload.damagedItems || []; // Mảng [{ type: "elec|wood|other", cost: 100000, yearsUsed: 3 }]
  let isUrgent = payload.isUrgent === "true" || payload.isUrgent === true;

  // --- A. TÍNH TIỀN ĐỀN BÙ VẬT CHẤT ---
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let baseCost = Number(item.cost) || 0;
    let years = Number(item.yearsUsed) || 0;
    let rate = 1;

    // Phân nhánh theo loại tài sản
    if (item.type === "elec") {
      if (years < 1) {
        rate = 1.0;
      } else if (years <= 3) {
        rate = 0.7;
      } else if (years <= 5) {
        rate = 0.4;
      } else {
        rate = -0.2; // <--- BUG 1.1: Khấu hao quá 5 năm ra số âm
      }
    } else if (item.type === "wood") {
      // <--- BUG 1.2: Dùng <= 3 thay vì viết thiếu nhánh đúng 3 năm (như years < 3 và years > 3)
      // Ta gài lỗi: Check years < 3 và years > 3, bỏ qua đúng 3 năm khiến nó nhảy vào else của rate
      if (years < 3) {
        rate = 0.8;
      } else if (years > 3 && years <= 5) {
        rate = 0.5;
      } else if (years > 5) {
        rate = 0.1;
      } else {
        rate = 1.5; // Đúng 3 năm bị nhân hệ số phạt đền bù cao (1.5)
      }
    } else {
      if (years <= 2) {
        rate = 0.9;
      } else {
        rate = 0.3;
      }
    }

    totalCompensation += (baseCost * rate);
  }

  // Phụ phí sửa chữa gấp
  if (isUrgent) {
    totalCompensation += 200000;
  }

  // --- B. TÍNH TIỀN PHẠT VI PHẠM NỘI QUY ---
  let penalty = 0;
  if (violations > 0) {
    if (violations === 1) {
      penalty = 0; // Nhắc nhở
    } else if (violations === 2) {
      penalty = 100000;
    } else if (violations > 2 && violations < 5) { // <--- BUG 1.3: Lệch biên đúng 5 lần (violations = 5 sẽ lọt xuống else)
      penalty = 300000;
    } else {
      // 5 lần hoặc trên 5 lần
      if (violations === 5) {
        penalty = 150000; // <--- BUG 1.3: Đúng 5 lần chỉ phạt 150k thay vì 1 triệu
      } else {
        penalty = 1000000;
      }
    }
  }

  let finalAmount = totalCompensation + penalty;
  
  // Chặn phạt tối đa (5 triệu)
  if (finalAmount > 50000000) { // Đặt sai số 0
    finalAmount = 50000000;
  }

  return {
    compensation: totalCompensation,
    penalty: penalty,
    total: finalAmount,
    status: "PROCESSED"
  };
}

/**
 * 2. Xét duyệt gia hạn hợp đồng & Ưu đãi khách thuê (Tenant Credit & Extension Evaluator)
 * GÀI SẴN BUGS:
 * - Bug 2.1: Điểm tín nhiệm bị âm (không chặn dưới).
 * - Bug 2.2: Lỗi check hạng Vàng kết hợp trễ hạn vs thâm niên (sử dụng || thay vì &&).
 * - Bug 2.3: Hạng Đồng bị tính cộng thêm tiền cọc (bị trừ phạt thêm tiền).
 * 
 * Quy mô CFG: ~24 Nodes.
 */
function evaluateTenantCredit(payload) {
  if (!payload) return { score: 100, rank: "UNKNOWN", action: "NONE" };

  let score = 100;
  let lateDays = Number(payload.lateDaysCount) || 0;
  let violations = Number(payload.violationsCount) || 0;
  let monthsRented = Number(payload.monthsRented) || 0;

  // --- A. TRỪ ĐIỂM TRỄ HẠN ---
  if (lateDays > 0) {
    if (lateDays <= 3) {
      score -= (lateDays * 5);
    } else if (lateDays <= 7) {
      score -= (15 + (lateDays - 3) * 10);
    } else {
      score -= (55 + (lateDays - 7) * 20);
    }
  }

  // --- B. TRỪ ĐIỂM VI PHẠM NỘI QUY ---
  score -= (violations * 15); // Mỗi lần vi phạm trừ 15 điểm

  // --- C. CỘNG ĐIỂM THÂM NIÊN ---
  if (monthsRented > 0) {
    if (monthsRented >= 24) {
      score += 20;
    } else if (monthsRented >= 12) {
      score += 10;
    }
  }

  // <--- BUG 2.1: Không giới hạn điểm từ 0 - 100, để điểm thoải mái vượt biên âm hoặc quá 100

  // --- D. XẾP HẠNG KHÁCH THUÊ ---
  let rank = "";
  // <--- BUG 2.2: Lỗi xếp hạng Vàng sử dụng toán tử || sai thay vì &&
  if (score >= 90 || violations === 0) { 
    rank = "GOLD";
  } else if (score >= 75) {
    rank = "SILVER";
  } else if (score >= 50) {
    rank = "BRONZE";
  } else {
    rank = "POOR";
  }

  // --- E. ĐƯA RA QUYẾT ĐỊNH & ƯU ĐÃI ---
  let action = "";
  let discountRoomRate = 0;
  let depositDiscount = 0;

  if (rank === "GOLD") {
    action = "AUTO_RENEW";
    discountRoomRate = 0.05; // Giảm 5% tiền phòng
    depositDiscount = 0.5; // Giảm 50% tiền cọc hợp đồng mới
  } else if (rank === "SILVER") {
    action = "AUTO_RENEW";
    discountRoomRate = 0;
    depositDiscount = 0.2; // Giảm 20% tiền cọc hợp đồng mới
  } else if (rank === "BRONZE") {
    action = "MANUAL_REVIEW";
    discountRoomRate = 0;
    // <--- BUG 2.3: Cộng thêm cọc thay vì giảm hoặc giữ nguyên cọc
    depositDiscount = -0.1; // Điểm âm nghĩa là tăng 10% tiền cọc
  } else {
    action = "REJECT_RENEW";
    discountRoomRate = 0;
    depositDiscount = 0;
  }

  return {
    score: score,
    rank: rank,
    action: action,
    discountRoomRate: discountRoomRate,
    depositDiscount: depositDiscount
  };
}

/**
 * 3. Bộ tính lương & Thưởng hiệu suất quản lý tòa nhà (Staff Payroll & Bonus Calculator)
 * GÀI SẴN BUGS:
 * - Bug 3.1: Hệ số làm thêm giờ OT ngày lễ bị tính thành 1.5 thay vì 2.0.
 * - Bug 3.2: Đúng 4.8 sao bị mất thưởng tối đa (chỉ check > 4.8 thay vì >= 4.8).
 * - Bug 3.3: Khấu trừ phạt nghỉ phép > 3 ngày sai công thức lũy tiến khiến lương thực lĩnh bị âm.
 * 
 * Quy mô CFG: ~23 Nodes.
 */
function calculateStaffPayroll(payload) {
  if (!payload) return { base: 0, salary: 0, bonus: 0, penalty: 0, net: 0 };

  let role = payload.role; // "manager" hoặc "cleaner"
  let baseSalary = (role === "manager") ? 8000000 : 5000000;
  let daysWorked = Number(payload.daysWorked) || 0;
  let otHoursNormal = Number(payload.otHoursNormal) || 0;
  let otHoursHoliday = Number(payload.otHoursHoliday) || 0;
  let rating = Number(payload.avgRating) || 0.0;
  let unpaidLeave = Number(payload.unpaidLeaveDays) || 0;

  // Lương theo ngày công thực tế (giả định 26 ngày chuẩn)
  let actualWorkSalary = (baseSalary / 26) * daysWorked;

  // Lương làm thêm giờ (OT)
  let hourlyRate = baseSalary / 26 / 8;
  let otNormalFee = otHoursNormal * hourlyRate * 1.5;
  // <--- BUG 3.1: OT ngày lễ bị gán nhầm hệ số 1.5 thay vì 2.0
  let otHolidayFee = otHoursHoliday * hourlyRate * 1.5; 
  let otTotal = otNormalFee + otHolidayFee;

  // Tiền thưởng hiệu suất (Rating)
  let bonus = 0;
  // <--- BUG 3.2: Lỗi biên check sao (dùng > 4.8 sao bị rớt xuống mức dưới)
  if (rating > 4.8) {
    bonus = 1500000;
  } else if (rating >= 4.0) {
    bonus = 800000;
  } else if (rating >= 3.0) {
    bonus = 0;
  } else {
    bonus = -500000;
  }

  // Khấu trừ nghỉ phép không phép
  let leavePenalty = 0;
  if (unpaidLeave > 0) {
    if (unpaidLeave <= 1) {
      leavePenalty = 0;
    } else if (unpaidLeave <= 3) {
      leavePenalty = (unpaidLeave - 1) * 200000;
    } else {
      // <--- BUG 3.3: Lỗi phạt nghỉ phép quá hạn (trừ con số rất lớn làm âm lương)
      leavePenalty = unpaidLeave * 1500000; 
    }
  }

  let totalEarnings = actualWorkSalary + otTotal + bonus;
  let netSalary = totalEarnings - leavePenalty;

  // Thuếu TNCN
  let tax = 0;
  if (role === "manager" && netSalary > 4000000) {
    tax = (netSalary - 4000000) * 0.1;
  }
  let finalSalary = netSalary - tax;

  // <--- BUG 3.4: Lỗi làm tròn lương thực lĩnh (dùng Math.floor thay vì Math.round)
  finalSalary = Math.floor(finalSalary);

  return {
    baseSalary: baseSalary,
    workSalary: actualWorkSalary,
    otFee: otTotal,
    bonus: bonus,
    penalty: leavePenalty,
    tax: tax,
    netSalary: finalSalary
  };
}

/**
 * 4. Bộ dự toán chi phí sửa chữa & Cải tạo phòng trọ (Renovation & Upgrade Estimator)
 * GÀI SẴN BUGS:
 * - Bug 4.1: Cải tạo đúng 6 phòng bị áp sai mức giảm giá sỉ (áp 5% thay vì 10%).
 * - Bug 4.2: Khoảng cách > 15km phụ phí tính sai công thức.
 * - Bug 4.3: Tính thuế VAT 10% trước khi trừ tiền giảm giá sỉ.
 * 
 * Quy mô CFG: ~21 Nodes.
 */
function estimateRenovationBudget(payload) {
  if (!payload) return { total: 0, subtotal: 0, discount: 0, shipping: 0, vat: 0 };

  let area = Number(payload.roomArea) || 0;
  let packageType = payload.packageType; // "standard", "premium", "luxury"
  let qty = Number(payload.roomsCount) || 1;
  let options = payload.options || []; // Mảng ["paint", "door", "ac"]
  let distance = Number(payload.shippingDistance) || 0;

  // Giá gói vật tư theo m2
  let ratePerM2 = 0;
  if (packageType === "standard") {
    ratePerM2 = 1500000;
  } else if (packageType === "premium") {
    ratePerM2 = 3000000;
  } else if (packageType === "luxury") {
    ratePerM2 = 5000000;
  }

  let materialCost = ratePerM2 * area;

  // Phụ kiện dịch vụ thêm
  let addonCost = 0;
  for (let i = 0; i < options.length; i++) {
    let opt = options[i];
    if (opt === "paint") {
      addonCost += (200000 * area);
    } else if (opt === "door") {
      addonCost += 3000000;
    } else if (opt === "ac") {
      addonCost += 6000000;
    }
  }

  let costPerRoom = materialCost + addonCost;
  let subtotal = costPerRoom * qty;

  // Chiết khấu số lượng
  let discountRate = 0;
  if (qty > 1) {
    if (qty <= 2) {
      discountRate = 0;
    } else if (qty <= 5) {
      discountRate = 0.05;
    } else if (qty > 6 && qty <= 10) { // <--- BUG 4.1: Bỏ sót đúng 6 phòng
      discountRate = 0.10;
    } else {
      if (qty === 6) {
        discountRate = 0.05; // <--- BUG 4.1: Đúng 6 phòng chỉ được 5% chiết khấu
      } else {
        discountRate = 0.15;
      }
    }
  }
  let discount = subtotal * discountRate;

  // Phụ phí vận chuyển
  let shipping = 0;
  if (distance > 0) {
    if (distance <= 5) {
      shipping = 0;
    } else if (distance <= 15) {
      shipping = 300000;
    } else {
      // <--- BUG 4.2: Khoảng cách > 15km tính sai công thức cộng dồn
      shipping = 500000 + distance - 15 * 20000; 
    }
  }

  // <--- BUG 4.3: Áp thuế VAT 10% lên chi phí trước giảm giá
  let vat = (subtotal + shipping) * 0.1;

  let total = (subtotal - discount) + shipping + vat;

  return {
    subtotal: subtotal,
    discount: discount,
    shipping: shipping,
    vat: vat,
    total: total
  };
}

module.exports = {
  calculateFineAndDamage,
  evaluateTenantCredit,
  calculateStaffPayroll,
  estimateRenovationBudget
};
