/**
 * Tính số tiền cọc được hoàn trả và tiền phạt khi khách hủy phòng.
 * CHỨC NĂNG CÓ GÀI SẴN BUGS ĐỂ KIỂM THỬ HỘP TRẮNG / HỘP ĐEN
 * @param {Object} booking - Thông tin đặt phòng
 * @returns {Object} Kết quả hoàn cọc
 */
function calculateCancellationRefund(booking) {
  if (!booking || booking.depositAmount <= 0 || booking.daysBeforeCheckIn < 0) {
    return { refund: 0, penalty: 0, status: "REJECTED_INVALID_DATA" };
  }

  let refund = 0;
  let deposit = Number(booking.depositAmount) || 0;
  let days = Number(booking.daysBeforeCheckIn) || 0;

  if (booking.reason === "force_majeure") {
    if (deposit > 50000) {
      refund = deposit - 50000;
    } else {
      refund = 0;
    }
  } else {
    if (days >= 30) {
      refund = deposit * 0.9;
    } else if (days > 15) {
      // <--- BUG 1: Lỗi biên ngày (lẽ ra phải là >= 15)
      refund = deposit * 0.7;
    } else if (days >= 7) {
      refund = deposit * 0.5;
    } else {
      refund = 0;
    }
  }

  // <--- BUG 2: Lỗi đặt sai thứ tự logic chặn âm (chạy trước khi trừ phụ phí/ngày lễ)
  if (refund < 0) {
    refund = 0;
  }

  // Trừ phí chuẩn bị phòng phát sinh
  if (booking.hasSurcharge === "true" || booking.hasSurcharge === true) {
    refund = refund - 150000; // <--- BUG 3: Gây ra kết quả hoàn tiền âm nếu refund ban đầu nhỏ hơn 150000
  }

  // Phạt thêm khi hủy vào ngày Lễ
  if (booking.isHoliday === "true" || booking.isHoliday === true) {
    refund = refund - deposit * 0.1; // <--- BUG 4: Gây ra kết quả hoàn tiền âm
  }

  // Tính tiền phạt giữ lại và trả về kết quả
  let penalty = deposit - refund; // <--- BUG 5: Tiền phạt bị tính sai lệch (vượt quá cọc ban đầu) nếu refund âm

  return {
    refund: refund,
    penalty: penalty,
    status: "PROCESSED",
  };
}

module.exports = { calculateCancellationRefund };
