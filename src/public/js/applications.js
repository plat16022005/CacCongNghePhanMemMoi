async function loadApplications() {
  try {
    const res = await fetch('/api/applications', { credentials: 'include' });
    const result = await res.json();
    if(res.ok && result.data) {
      renderApplications(result.data);
    }
  } catch(err) {
    console.error('Error load applications', err);
  }
}

let currentApplications = [];

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

function renderApplications(apps) {
  currentApplications = apps;
  const tbody = document.getElementById('applicationsTableBody');
  if(!tbody) return;
  tbody.innerHTML = '';
  
  if(apps.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center">Không có đơn nào</td></tr>';
    return;
  }
  
  apps.forEach(app => {
    const tr = document.createElement('tr');
    
    let statusText = app.status;
    let badgeClass = 'status-badge ';
    if(app.status === 'pending') { statusText = 'Chờ duyệt'; badgeClass += 'status-maintenance'; }
    if(app.status === 'approved') { statusText = 'Chờ nộp cọc'; badgeClass += 'status-maintenance'; }
    if(app.status === 'completed') { statusText = 'Đã gán phòng'; badgeClass += 'status-available'; }
    if(app.status === 'rejected') { statusText = 'Từ chối'; badgeClass += 'status-occupied'; }
    
    const tenant = app.tenantInfo || app.tenantId || {};
    const room = app.roomId || {};
    tr.innerHTML = `
      <td><strong>${tenant.name || 'N/A'}</strong><br><small>${tenant.phoneNumber || ''}</small></td>
      <td><strong>${room.roomNumber || 'N/A'}</strong></td>
      <td>${new Date(app.createdAt).toLocaleDateString('vi-VN')}</td>
      <td><span class="${badgeClass}">${statusText}</span></td>
      <td>
        <button onclick="viewApplication('${app._id}')" class="btn-action btn-edit">Xem chi tiết</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function viewApplication(appId) {
  const app = currentApplications.find(a => a._id === appId);
  if(!app) return;

  const tenant = (app.tenantInfo && Object.keys(app.tenantInfo).length > 0)
    ? app.tenantInfo
    : (app.tenantId || {});
  const room = (app.roomId && typeof app.roomId === 'object')
    ? app.roomId
    : {};
  const members = Array.isArray(app.members) ? app.members : [];

  const safeSetText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const safeSetSrc = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.src = value;
  };
  
  safeSetText('appUserName', tenant.name || app.tenantId?.name || 'N/A');
  safeSetText('appUserPhone', tenant.phoneNumber || app.tenantId?.phoneNumber || 'N/A');
  safeSetText('appUserDob', tenant.dob || app.tenantId?.dob || 'N/A');
  safeSetText('appUserGender', tenant.gender === 'male' ? 'Nam' : tenant.gender === 'female' ? 'Nữ' : (tenant.gender || app.tenantId?.gender || 'N/A'));
  safeSetText('appUserAddress', tenant.address || app.tenantId?.address || 'N/A');
  
  safeSetText('appRoomNumber', room.roomNumber || app.roomId?.roomNumber || 'N/A');
  safeSetText('appRoomPrice', room.rentalPrice ? Number(room.rentalPrice).toLocaleString() : (app.roomId?.rentalPrice ? Number(app.roomId.rentalPrice).toLocaleString() : 'N/A'));
  safeSetText('appRoomInfo', `Tầng ${room.floor || app.roomId?.floor || '?'} / ${room.area || app.roomId?.area || '?'} m2`);
  
  safeSetSrc('appCccdFront', tenant.cccdFrontImage || 'https://via.placeholder.com/400x200?text=Khong+co+anh');
  safeSetSrc('appCccdBack', tenant.cccdBackImage || 'https://via.placeholder.com/400x200?text=Khong+co+anh');

  const membersContainer = document.getElementById('appMembersContainer');
  if (membersContainer) {
    if (members.length === 0) {
      membersContainer.innerHTML = '<div class="empty-state">Không có thông tin người ở ghép</div>';
    } else {
      membersContainer.innerHTML = members.map((member, index) => `
        <div class="member-card">
          <div class="member-card-header">
            <div class="member-title-wrap">
              <span>${index + 1}</span>
              <strong>${member.name || 'N/A'}</strong>
            </div>
            <span class="badge badge-primary">Người ở ghép</span>
          </div>
          <div class="member-meta">
            <p><label>SĐT</label><span>${member.phoneNumber || 'N/A'}</span></p>
            <p><label>Ngày sinh</label><span>${member.dob || 'N/A'}</span></p>
            <p><label>Giới tính</label><span>${member.gender === 'male' ? 'Nam' : member.gender === 'female' ? 'Nữ' : (member.gender || 'N/A')}</span></p>
            <p><label>Địa chỉ</label><span>${member.address || 'N/A'}</span></p>
          </div>
          <div class="member-docs">
            <div class="document-preview">
              <p>CCCD mặt trước</p>
              <img src="${member.cccdFrontImage || 'https://via.placeholder.com/400x200?text=Khong+co+anh'}" alt="CCCD mặt trước người ở ghép">
            </div>
            <div class="document-preview">
              <p>CCCD mặt sau</p>
              <img src="${member.cccdBackImage || 'https://via.placeholder.com/400x200?text=Khong+co+anh'}" alt="CCCD mặt sau người ở ghép">
            </div>
          </div>
        </div>
      `).join('');
    }
  }
  
  const btnApprove = document.getElementById('btnApproveApp');
  const btnReject = document.getElementById('btnRejectApp');
  const btnConfirmDeposit = document.getElementById('btnConfirmDeposit');
  
  if(app.status === 'pending') {
    btnApprove.style.display = 'inline-block';
    btnReject.style.display = 'inline-block';
    btnReject.innerHTML = '❌ Từ chối';
    if (btnConfirmDeposit) btnConfirmDeposit.style.display = 'none';
    btnApprove.onclick = () => updateApplicationStatus(app._id, 'approve');
    btnReject.onclick = () => updateApplicationStatus(app._id, 'reject');
  } else if (app.status === 'approved') {
    btnApprove.style.display = 'none';
    btnReject.style.display = 'inline-block';
    btnReject.innerHTML = '❌ Hủy đơn (Quá hạn cọc)';
    btnReject.onclick = () => updateApplicationStatus(app._id, 'reject');
    if (btnConfirmDeposit) {
      btnConfirmDeposit.style.display = 'inline-block';
      btnConfirmDeposit.onclick = () => updateApplicationStatus(app._id, 'confirm-deposit');
    }
  } else {
    btnApprove.style.display = 'none';
    btnReject.style.display = 'none';
    if (btnConfirmDeposit) btnConfirmDeposit.style.display = 'none';
  }
  
  document.getElementById('applicationModal').style.display = 'block';
}

async function updateApplicationStatus(appId, action) {
  let actionText = '';
  if (action === 'approve') actionText = 'Duyệt (Yêu cầu nộp cọc)';
  else if (action === 'reject') actionText = 'Từ chối';
  else if (action === 'confirm-deposit') actionText = 'Xác nhận đã nhận cọc & Gán phòng';
  
  if(!confirm(`Bạn có chắc chắn muốn ${actionText} đơn này?`)) return;
  
  try {
    const res = await fetch(`/api/applications/${appId}/${action}`, {
      method: 'PUT',
      credentials: 'include'
    });
    const result = await res.json();
    
    if(!res.ok) {
      alert(result.message || 'Có lỗi xảy ra');
      return;
    }
    
    alert('Thao tác thành công');
    closeModal('applicationModal');
    loadApplications();
    loadRooms(); // Refresh rooms if room assigned
  } catch(err) {
    alert('Lỗi kết nối máy chủ');
  }
}
