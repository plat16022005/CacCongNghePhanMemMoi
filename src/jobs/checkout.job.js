const cron = require("node-cron");
const Guest = require("../models/guest");

const autoCheckoutGuests = async () => {
  try {
    const now = new Date();
    // Auto-checkout any guest still checked in
    const result = await Guest.updateMany(
      { checkinStatus: "checked_in" },
      { 
        $set: { 
          checkinStatus: "checked_out", 
          checkoutTime: now 
        } 
      }
    );
    if (result.modifiedCount > 0) {
      console.log(`[JOB] Đã auto-checkout ${result.modifiedCount} khách vãng lai lúc nửa đêm.`);
    }
  } catch (error) {
    console.error("[JOB] Lỗi auto-checkout guests:", error.message);
  }
};

// Chạy vào 23:59 mỗi đêm
const initCheckoutJob = () => {
  cron.schedule("59 23 * * *", () => {
    console.log("[JOB] Chạy tác vụ tự động checkout khách vãng lai cuối ngày...");
    autoCheckoutGuests();
  });
};

module.exports = { initCheckoutJob };
