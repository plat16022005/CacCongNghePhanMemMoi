// Load manager profile khi trang load
window.addEventListener("DOMContentLoaded", loadManagerProfile);

async function loadManagerProfile() {
  try {
    const response = await fetch("/api/manager/profile", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = "/login";
        return;
      }
      throw new Error("Failed to load profile");
    }

    const result = await response.json();
    const user = result.data;

    // Cập nhật thông tin manager
    document.getElementById("adminName").textContent =
      user.name || "Manager User";
    document.getElementById("adminEmail").textContent =
      user.email || "manager@example.com";
    document.getElementById("adminAvatar").textContent = (
      user.name || "M"
    )
      .charAt(0)
      .toUpperCase();

    document.getElementById("profileName").textContent =
      user.name || "Manager User";
    document.getElementById("profileEmail").textContent =
      user.email || "manager@example.com";
    document.getElementById("profilePhone").textContent =
      user.phoneNumber || "Chưa cập nhật";
    document.getElementById("profileAddress").textContent =
      user.address || "Chưa cập nhật";
  } catch (error) {
    console.error("Load manager profile error:", error);
  }
}

function switchTab(tab) {
  // Ẩn tất cả tab có thể tồn tại
  const tabIds = [
    "dashboardTab",
    "profileTab",
    "usersTab",
    "settingsTab",
    "roomsTab",
    "cancellationTab",
    "testingLabTab",
    "applicationsTab",
    "residentsTab",
    "invoicesTab",
    "noticesTab",
    "feedbackTab",
    "revenueTab",
    "utilitiesTab",
    "parkingTab"
  ];

  tabIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.style.display = "none";
  });

  // Cập nhật nút active
  document.querySelectorAll(".sidebar-menu button").forEach((btn) => {
    btn.classList.remove("active");
  });

  const clickedButton = window.event?.currentTarget;
  if (clickedButton && clickedButton.tagName === "BUTTON") {
    clickedButton.classList.add("active");
  } else {
    const btn = Array.from(document.querySelectorAll(".sidebar-menu button")).find((b) =>
      b.getAttribute("onclick")?.includes(`'${tab}'`)
    );
    if (btn) btn.classList.add("active");
  }

  // Hiển thị tab được chọn
  const titles = {
    dashboard: "📊 Dashboard",
    residents: "👥 Quản lý cư dân",
    rooms: "🏢 Quản lý căn hộ",
    applications: "📝 Duyệt đăng ký khách",
    invoices: "🧾 Quản lý hóa đơn",
    notices: "📣 Gửi thông báo",
    feedback: "⚠️ Xử lý phản ánh",
    revenue: "💰 Thống kê doanh thu",
    utilities: "🔧 Quản lý tiện ích",
    parking: "🅿️ Xét duyệt đơn gửi xe",
    profile: "👤 Hồ sơ của tôi",
  };

  document.getElementById("pageTitle").textContent =
    titles[tab] || "Dashboard";

  if (tab === "dashboard") {
    const dash = document.getElementById("dashboardTab");
    if (dash) dash.style.display = "block";
  } else if (tab === "profile") {
    const prof = document.getElementById("profileTab");
    if (prof) prof.style.display = "block";
  } else if (tab === "residents") {
    const residents = document.getElementById("residentsTab");
    if (residents) residents.style.display = "block";
  } else if (tab === "rooms") {
    const roomsTab = document.getElementById("roomsTab");
    if (roomsTab) {
      roomsTab.style.display = "block";
      loadRooms();
    }
  } else if (tab === "applications") {
    const appTab = document.getElementById("applicationsTab");
    if (appTab) {
      appTab.style.display = "block";
      if (typeof loadApplications === "function") loadApplications();
    }
  } else if (tab === "invoices") {
    const invoices = document.getElementById("invoicesTab");
    if (invoices) invoices.style.display = "block";
  } else if (tab === "notices") {
    const notices = document.getElementById("noticesTab");
    if (notices) notices.style.display = "block";
  } else if (tab === "feedback") {
    const feedback = document.getElementById("feedbackTab");
    if (feedback) feedback.style.display = "block";
  } else if (tab === "revenue") {
    const revenue = document.getElementById("revenueTab");
    if (revenue) revenue.style.display = "block";
  } else if (tab === "utilities") {
    const utilities = document.getElementById("utilitiesTab");
    if (utilities) utilities.style.display = "block";
  } else if (tab === "parking") {
    const parking = document.getElementById("parkingTab");
    if (parking) parking.style.display = "block";
  }
}

// --- ROOM MANAGEMENT FUNCTIONS ---
async function loadRooms() {
  try {
    const res = await fetch("/api/rooms", { credentials: "include" });
    if (!res.ok) throw new Error("Không thể tải danh sách phòng");
    const result = await res.json();
    const rooms = result.data;

    const tbody = document.getElementById("roomsTableBody");
    tbody.innerHTML = "";

    if (!rooms || rooms.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="padding: 24px; text-align: center; color: var(--text-muted);">Không có phòng trọ nào. Hãy thêm phòng mới.</td></tr>`;
      return;
    }

    rooms.forEach((room) => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid var(--border)";

      const tenantInfo = room.tenant
        ? `${room.tenant.name} (${room.tenant.email})`
        : `<span style="color: var(--text-muted);">Trống</span>`;

      let statusBadge = "";
      if (room.status === "available") {
        statusBadge = `<span style="color: var(--success); background: rgba(16,185,129,0.1); padding: 4px 8px; border-radius: 4px; font-size: 13px;">Trống</span>`;
      } else if (room.status === "occupied") {
        statusBadge = `<span style="color: var(--primary); background: rgba(59,130,246,0.1); padding: 4px 8px; border-radius: 4px; font-size: 13px;">Đã thuê</span>`;
      } else {
        statusBadge = `<span style="color: var(--warning); background: rgba(245,158,11,0.1); padding: 4px 8px; border-radius: 4px; font-size: 13px;">Bảo trì</span>`;
      }

      let actions = "";
      if (room.status === "available") {
        actions = `<button onclick="showAssignTenant('${room.id}', '${room.roomNumber}')" style="padding: 6px 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid var(--primary); color: var(--primary); border-radius: 6px; cursor: pointer; margin-right: 8px;">Gán khách</button>`;
      } else if (room.status === "occupied") {
        actions = `
          <button onclick="showCalculateInvoice('${room.id}', '${room.roomNumber}')" style="padding: 6px 12px; background: rgba(245,158,11,0.1); border: 1px solid var(--warning); color: var(--warning); border-radius: 6px; cursor: pointer; margin-right: 8px;">Tính hóa đơn</button>
          <button onclick="unassignTenant('${room.id}')" style="padding: 6px 12px; background: rgba(239,68,68,0.1); border: 1px solid var(--danger); color: var(--danger); border-radius: 6px; cursor: pointer; margin-right: 8px;">Bỏ gán</button>
        `;
      } else {
        actions = `<button onclick="unassignTenant('${room.id}')" style="padding: 6px 12px; background: rgba(239,68,68,0.1); border: 1px solid var(--danger); color: var(--danger); border-radius: 6px; cursor: pointer; margin-right: 8px;">Giải phóng</button>`;
      }

      // Thêm nút Sửa và Xóa cho mọi phòng
      // Lấy toàn bộ thông tin phòng để truyền vào hàm sửa
      const roomJson = encodeURIComponent(JSON.stringify(room));
      actions += `
        <button onclick="showViewRoom('${roomJson}')" style="padding: 6px 12px; background: rgba(59, 130, 246, 0.1); border: 1px solid var(--primary); color: var(--primary); border-radius: 6px; cursor: pointer; margin-right: 8px;">Chi tiết</button>
        <button onclick="showEditRoom('${roomJson}')" style="padding: 6px 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); color: var(--success); border-radius: 6px; cursor: pointer; margin-right: 8px;">Sửa</button>
        <button onclick="deleteRoom('${room.id}')" style="padding: 6px 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); color: var(--danger); border-radius: 6px; cursor: pointer;">Xóa</button>
      `;

      tr.innerHTML = `
        <td style="padding: 12px; font-weight: 600;">Phòng ${room.roomNumber}</td>
        <td style="padding: 12px;">${Number(room.rentalPrice).toLocaleString()} VND</td>
        <td style="padding: 12px;">${statusBadge}</td>
        <td style="padding: 12px;">${tenantInfo}</td>
        <td style="padding: 12px;">${actions}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Load rooms error:", error);
    alert("❌ Không thể tải danh sách phòng trọ!");
  }
}

async function handleCreateRoom(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("roomNumber", document.getElementById("newRoomNumber").value);
  formData.append("floor", document.getElementById("newFloor").value);
  formData.append("area", document.getElementById("newArea").value);
  formData.append("bedroomCount", document.getElementById("newBedroomCount").value);
  formData.append("bathroomCount", document.getElementById("newBathroomCount").value);
  formData.append("maxOccupants", document.getElementById("newMaxOccupants").value);
  formData.append("rentalPrice", document.getElementById("newRentalPrice").value);
  formData.append("depositAmount", document.getElementById("newDepositAmount").value);
  formData.append("status", document.getElementById("newRoomStatus").value);
  formData.append("description", document.getElementById("newDescription").value);

  const imageInput = document.getElementById("newImages");
  if (imageInput && imageInput.files) {
    for (const file of imageInput.files) {
      formData.append("images", file);
    }
  }

  try {
    const res = await fetch("/api/rooms", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Tạo phòng thất bại");

    alert("✅ Tạo phòng mới thành công!");
    document.getElementById("createRoomForm").reset();
    loadRooms();
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

async function showAssignTenant(roomId, roomNumber) {
  document.getElementById("assignRoomId").value = roomId;
  document.getElementById("assignRoomNumber").textContent = roomNumber;
  document.getElementById("assignTenantSection").style.display = "block";
  document.getElementById("invoiceSection").style.display = "none";
  if (document.getElementById("editRoomSection")) document.getElementById("editRoomSection").style.display = "none";
  if (document.getElementById("viewRoomSection")) document.getElementById("viewRoomSection").style.display = "none";

  try {
    const res = await fetch("/api/rooms/available-tenants", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Không thể tải danh sách khách");
    const result = await res.json();
    const tenants = result.data;

    const select = document.getElementById("tenantSelect");
    select.innerHTML = '<option value="">-- Chọn khách thuê --</option>';
    tenants.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.name} (${t.email})`;
      select.appendChild(opt);
    });
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

async function submitAssignTenant() {
  const roomId = document.getElementById("assignRoomId").value;
  const tenantId = document.getElementById("tenantSelect").value;

  if (!tenantId) {
    alert("⚠️ Vui lòng chọn khách thuê!");
    return;
  }

  try {
    const res = await fetch(`/api/rooms/${roomId}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Gán khách thuê thất bại");

    alert("✅ Gán khách thuê thành công!");
    cancelAssign();
    loadRooms();
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

async function unassignTenant(roomId) {
  if (
    !confirm(
      "⚠️ Bạn có chắc chắn muốn giải phóng phòng này (bỏ gán khách thuê)?",
    )
  )
    return;

  try {
    const res = await fetch(`/api/rooms/${roomId}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId: null }),
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Bỏ gán khách thuê thất bại");

    alert("✅ Giải phóng phòng trọ thành công!");
    loadRooms();
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

function cancelAssign() {
  document.getElementById("assignTenantSection").style.display = "none";
}

function showEditRoom(roomJson) {
  const room = JSON.parse(decodeURIComponent(roomJson));
  document.getElementById("editRoomObjId").value = room.id;
  document.getElementById("editRoomNumberHeader").textContent = room.roomNumber;
  document.getElementById("editRoomNumber").value = room.roomNumber || "";
  document.getElementById("editFloor").value = room.floor || "";
  document.getElementById("editArea").value = room.area || "";
  document.getElementById("editBedroomCount").value = room.bedroomCount || "";
  document.getElementById("editBathroomCount").value = room.bathroomCount || "";
  document.getElementById("editMaxOccupants").value = room.maxOccupants || "";
  document.getElementById("editRentalPrice").value = room.rentalPrice || "";
  document.getElementById("editDepositAmount").value = room.depositAmount || "";
  document.getElementById("editRoomStatus").value = room.status || "available";
  document.getElementById("editDescription").value = room.description || "";

  document.getElementById("editRoomSection").style.display = "block";
  document.getElementById("assignTenantSection").style.display = "none";
  document.getElementById("invoiceSection").style.display = "none";
  if (document.getElementById("viewRoomSection")) document.getElementById("viewRoomSection").style.display = "none";
}

function showViewRoom(roomJson) {
  const room = JSON.parse(decodeURIComponent(roomJson));
  document.getElementById("viewRoomNumberHeader").textContent = room.roomNumber || "";
  document.getElementById("viewFloor").textContent = room.floor || "Chưa cập nhật";
  document.getElementById("viewArea").textContent = room.area || "Chưa cập nhật";
  document.getElementById("viewBedroomCount").textContent = room.bedroomCount || "Chưa cập nhật";
  document.getElementById("viewBathroomCount").textContent = room.bathroomCount || "Chưa cập nhật";
  document.getElementById("viewMaxOccupants").textContent = room.maxOccupants || "Chưa cập nhật";
  document.getElementById("viewDepositAmount").textContent = room.depositAmount ? Number(room.depositAmount).toLocaleString() : "Chưa cập nhật";
  document.getElementById("viewDescription").textContent = room.description || "Không có mô tả";

  document.getElementById("viewRoomSection").style.display = "block";
  document.getElementById("editRoomSection").style.display = "none";
  document.getElementById("assignTenantSection").style.display = "none";
  document.getElementById("invoiceSection").style.display = "none";
}

function closeViewRoom() {
  document.getElementById("viewRoomSection").style.display = "none";
}

function cancelEditRoom() {
  document.getElementById("editRoomSection").style.display = "none";
}

async function submitEditRoom(e) {
  e.preventDefault();

  const objId = document.getElementById("editRoomObjId").value;
  const formData = new FormData();
  formData.append("roomNumber", document.getElementById("editRoomNumber").value);
  formData.append("floor", document.getElementById("editFloor").value);
  formData.append("area", document.getElementById("editArea").value);
  formData.append("bedroomCount", document.getElementById("editBedroomCount").value);
  formData.append("bathroomCount", document.getElementById("editBathroomCount").value);
  formData.append("maxOccupants", document.getElementById("editMaxOccupants").value);
  formData.append("rentalPrice", document.getElementById("editRentalPrice").value);
  formData.append("depositAmount", document.getElementById("editDepositAmount").value);
  formData.append("status", document.getElementById("editRoomStatus").value);
  formData.append("description", document.getElementById("editDescription").value);

  const editImageInput = document.getElementById("editImages");
  if (editImageInput && editImageInput.files) {
    for (const file of editImageInput.files) {
      formData.append("images", file);
    }
  }

  try {
    const res = await fetch(`/api/rooms/${objId}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Cập nhật phòng thất bại");

    alert("✅ Cập nhật thông tin phòng thành công!");
    cancelEditRoom();
    loadRooms();
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

async function deleteRoom(roomId) {
  if (
    !confirm(
      "⚠️ Bạn có chắc chắn muốn xóa phòng trọ này? Hành động này không thể hoàn tác!",
    )
  )
    return;

  try {
    const res = await fetch(`/api/rooms/${roomId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Xóa phòng thất bại");

    alert("✅ Xóa phòng trọ thành công!");
    loadRooms();
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

function showCalculateInvoice(roomId, roomNumber) {
  document.getElementById("invoiceRoomId").value = roomId;
  document.getElementById("invoiceRoomNumber").textContent = roomNumber;
  document.getElementById("invoiceSection").style.display = "block";
  document.getElementById("assignTenantSection").style.display = "none";
  document.getElementById("invoiceResultSection").style.display = "none";
  if (document.getElementById("editRoomSection")) document.getElementById("editRoomSection").style.display = "none";
  if (document.getElementById("viewRoomSection")) document.getElementById("viewRoomSection").style.display = "none";
}

function toggleVehicleInput() {
  const hasVehicle =
    document.getElementById("hasVehicle").value === "true";
  document.getElementById("vehicleCountGroup").style.display = hasVehicle
    ? "block"
    : "none";
}

async function submitInvoice(e) {
  e.preventDefault();
  const roomId = document.getElementById("invoiceRoomId").value;

  const payload = {
    month: document.getElementById("invoiceMonth").value,
    oldElec: document.getElementById("oldElec").value,
    newElec: document.getElementById("newElec").value,
    oldWater: document.getElementById("oldWater").value,
    newWater: document.getElementById("newWater").value,
    lateDays: document.getElementById("lateDays").value,
    memberCount: document.getElementById("memberCount").value,
    hasVehicle: document.getElementById("hasVehicle").value,
    vehicleCount: document.getElementById("vehicleCount").value,
    contractMonths: document.getElementById("contractMonths").value,
  };

  try {
    const res = await fetch(`/api/rooms/${roomId}/invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Xuất hóa đơn thất bại");

    alert("✅ Tính toán hóa đơn thành công!");
    const data = result.data;

    document.getElementById("resRoomFee").textContent = Number(
      data.roomFee
    ).toLocaleString();
    document.getElementById("resPenalty").textContent = Number(
      data.penalty
    ).toLocaleString();
    document.getElementById("resElecFee").textContent = Number(
      data.electricityFee
    ).toLocaleString();
    document.getElementById("resWaterFee").textContent = Number(
      data.waterFee
    ).toLocaleString();
    document.getElementById("resServiceFee").textContent = Number(
      data.serviceFee
    ).toLocaleString();

    document.getElementById("resVehicleFee").textContent =
      isNaN(data.vehicleFee) || data.vehicleFee === null
        ? "NaN (Lỗi)"
        : Number(data.vehicleFee).toLocaleString();
    document.getElementById("resDiscount").textContent = Number(
      data.discount
    ).toLocaleString();

    document.getElementById("resTotalBill").textContent =
      isNaN(data.totalBill) || data.totalBill === null
        ? "NaN (Lỗi)"
        : Number(data.totalBill).toLocaleString();

    document.getElementById("invoiceResultSection").style.display =
      "block";
  } catch (error) {
    alert("❌ Lỗi: " + error.message);
  }
}

function cancelInvoice() {
  document.getElementById("invoiceSection").style.display = "none";
}

async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      alert("✅ Đã đăng xuất thành công!");
      window.location.href = "/login";
    } else {
      alert("❌ Lỗi khi đăng xuất!");
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("❌ Lỗi kết nối!");
  }
}
