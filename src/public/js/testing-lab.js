async function handleCalculateCancellation(e) {
  e.preventDefault();

  const payload = {
    depositAmount: document.getElementById("cancelDepositAmount").value,
    daysBeforeCheckIn: document.getElementById("cancelDaysBeforeCheckIn").value,
    reason: document.getElementById("cancelReason").value,
    hasSurcharge: document.getElementById("cancelHasSurcharge").value,
    isHoliday: document.getElementById("cancelIsHoliday").value,
  };

  try {
    const res = await fetch("/api/rooms/cancel-refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Tính toán thất bại");

    const data = result.data;

    document.getElementById("resCancelDeposit").textContent = Number(
      payload.depositAmount
    ).toLocaleString();
    document.getElementById("resCancelRefund").textContent =
      isNaN(data.refund) || data.refund === null
        ? "NaN (Lỗi)"
        : Number(data.refund).toLocaleString();
    document.getElementById("resCancelPenalty").textContent =
      isNaN(data.penalty) || data.penalty === null
        ? "NaN (Lỗi)"
        : Number(data.penalty).toLocaleString();
    document.getElementById("resCancelStatus").textContent =
      data.status || "PROCESSED";

    document.getElementById("cancellationPlaceholder").style.display =
      "none";
    document.getElementById("cancellationResultSection").style.display =
      "block";
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

// --- SUBTAB SWITCHING IN TESTING LAB ---
function switchSubTab(subTab) {
  // Ẩn tất cả panes
  document.querySelectorAll(".testing-pane").forEach((p) => (p.style.display = "none"));
  // Bỏ active tất cả nút
  document.querySelectorAll(".subtab-btn").forEach((btn) => {
    btn.style.background = "transparent";
    btn.style.borderColor = "var(--border)";
    btn.style.color = "var(--text-muted)";
    btn.classList.remove("active");
  });

  // Hiển thị pane được chọn
  document.getElementById(`subtab-${subTab}`).style.display = "block";

  // Active nút được chọn
  const activeBtn = Array.from(document.querySelectorAll(".subtab-btn")).find((b) =>
    b.getAttribute("onclick").includes(subTab)
  );
  if (activeBtn) {
    activeBtn.style.background = "rgba(59,130,246,0.1)";
    activeBtn.style.borderColor = "var(--primary)";
    activeBtn.style.color = "var(--text-main)";
    activeBtn.classList.add("active");
  }
}

// --- DYNAMIC ROWS FOR DAMAGED ITEMS ---
function addDamagedItemRow() {
  const container = document.getElementById("damagedItemsContainer");
  const row = document.createElement("div");
  row.className = "damaged-item-row";
  row.style.display = "flex";
  row.style.gap = "8px";
  row.style.alignItems = "center";
  row.style.marginTop = "8px";

  row.innerHTML = `
    <select class="item-type" style="flex: 1; padding: 10px; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 8px; color: var(--text-main); outline: none;">
      <option value="elec">Điện tử (Tivi, Tủ lạnh...)</option>
      <option value="wood">Nội thất gỗ (Giường, Tủ...)</option>
      <option value="other">Thiết bị khác (Khóa, Khung...)</option>
    </select>
    <input type="number" class="item-cost" placeholder="Giá trị (VND)" value="500000" style="width: 110px; padding: 10px; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 8px; color: var(--text-main); outline: none;" />
    <input type="number" class="item-years" placeholder="Số năm dùng" value="3" style="width: 80px; padding: 10px; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 8px; color: var(--text-main); outline: none;" />
    <button type="button" class="logout-btn" style="width: auto; margin: 0; padding: 10px; border-color: var(--danger); background: rgba(239,68,68,0.1); color: var(--danger);" onclick="removeDamagedItemRow(this)">✕</button>
  `;
  container.appendChild(row);
}

function removeDamagedItemRow(btn) {
  const row = btn.parentElement;
  row.remove();
}

// --- AJAX REQUEST HANDLERS ---

async function handleCalculateFine(e) {
  e.preventDefault();
  const violationsCount = document.getElementById("fineViolations").value;
  const isUrgent = document.getElementById("fineIsUrgent").value;

  const rows = document.querySelectorAll(".damaged-item-row");
  const damagedItems = [];
  rows.forEach((row) => {
    damagedItems.push({
      type: row.querySelector(".item-type").value,
      cost: row.querySelector(".item-cost").value,
      yearsUsed: row.querySelector(".item-years").value,
    });
  });

  try {
    const res = await fetch("/api/rooms/test-fine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ violationsCount, isUrgent, damagedItems }),
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Tính toán thất bại");

    const data = result.data;
    document.getElementById("resFineCompensation").textContent = Number(data.compensation).toLocaleString();
    document.getElementById("resFinePenalty").textContent = Number(data.penalty).toLocaleString();
    
    document.getElementById("resFineTotal").textContent =
      isNaN(data.total) || data.total === null 
        ? "NaN (Lỗi)" 
        : Number(data.total).toLocaleString();

    document.getElementById("finePlaceholder").style.display = "none";
    document.getElementById("fineResult").style.display = "block";
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

async function handleCalculateCredit(e) {
  e.preventDefault();
  const payload = {
    lateDaysCount: document.getElementById("creditLateDays").value,
    violationsCount: document.getElementById("creditViolations").value,
    monthsRented: document.getElementById("creditMonthsRented").value,
  };

  try {
    const res = await fetch("/api/rooms/test-credit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Tính toán thất bại");

    const data = result.data;
    document.getElementById("resCreditScore").textContent = data.score;
    document.getElementById("resCreditRank").textContent = data.rank;
    document.getElementById("resCreditAction").textContent = data.action;
    document.getElementById("resCreditDiscountRate").textContent = (data.discountRoomRate * 100).toFixed(0);
    document.getElementById("resCreditDepositDiscount").textContent = (data.depositDiscount * 100).toFixed(0);

    document.getElementById("creditPlaceholder").style.display = "none";
    document.getElementById("creditResult").style.display = "block";
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

async function handleCalculateSalary(e) {
  e.preventDefault();
  const payload = {
    role: document.getElementById("salaryRole").value,
    daysWorked: document.getElementById("salaryDaysWorked").value,
    otHoursNormal: document.getElementById("salaryOtNormal").value,
    otHoursHoliday: document.getElementById("salaryOtHoliday").value,
    avgRating: document.getElementById("salaryRating").value,
    unpaidLeaveDays: document.getElementById("salaryUnpaidLeave").value,
  };

  try {
    const res = await fetch("/api/rooms/test-salary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Tính toán thất bại");

    const data = result.data;
    document.getElementById("resSalaryBase").textContent = Number(data.baseSalary).toLocaleString();
    document.getElementById("resSalaryDays").textContent = Number(data.workSalary).toLocaleString();
    document.getElementById("resSalaryOt").textContent = Number(data.otFee).toLocaleString();
    document.getElementById("resSalaryBonus").textContent = Number(data.bonus).toLocaleString();
    document.getElementById("resSalaryPenalty").textContent = Number(data.penalty).toLocaleString();
    document.getElementById("resSalaryTax").textContent = Number(data.tax).toLocaleString();
    
    document.getElementById("resSalaryNet").textContent =
      isNaN(data.netSalary) || data.netSalary === null 
        ? "NaN (Lỗi)" 
        : Number(data.netSalary).toLocaleString();

    document.getElementById("salaryPlaceholder").style.display = "none";
    document.getElementById("salaryResult").style.display = "block";
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

async function handleCalculateRenovation(e) {
  e.preventDefault();
  const options = [];
  document.querySelectorAll(".renovation-option:checked").forEach((cb) => {
    options.push(cb.value);
  });

  const payload = {
    roomArea: document.getElementById("renovationArea").value,
    packageType: document.getElementById("renovationPackage").value,
    roomsCount: document.getElementById("renovationQty").value,
    shippingDistance: document.getElementById("renovationDistance").value,
    options: options,
  };

  try {
    const res = await fetch("/api/rooms/test-renovation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Tính toán thất bại");

    const data = result.data;
    document.getElementById("resRenovationSubtotal").textContent = Number(data.subtotal).toLocaleString();
    document.getElementById("resRenovationDiscount").textContent = Number(data.discount).toLocaleString();
    document.getElementById("resRenovationShipping").textContent = Number(data.shipping).toLocaleString();
    document.getElementById("resRenovationVat").textContent = Number(data.vat).toLocaleString();
    
    document.getElementById("resRenovationTotal").textContent =
      isNaN(data.total) || data.total === null 
        ? "NaN (Lỗi)" 
        : Number(data.total).toLocaleString();

    document.getElementById("renovationPlaceholder").style.display = "none";
    document.getElementById("renovationResult").style.display = "block";
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}
