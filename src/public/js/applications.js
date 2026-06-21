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
    
    tr.innerHTML = `
      <td><strong>${app.tenantId?.name || 'N/A'}</strong><br><small>${app.tenantId?.phoneNumber || ''}</small></td>
      <td><strong>${app.roomId?.roomNumber || 'N/A'}</strong></td>
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
  
  document.getElementById('appUserName').textContent = app.tenantId?.name || 'N/A';
  document.getElementById('appUserPhone').textContent = app.tenantId?.phoneNumber || 'N/A';
  document.getElementById('appUserCccd').textContent = app.tenantId?.cccdNumber || 'N/A';
  document.getElementById('appUserDob').textContent = app.tenantId?.dob || 'N/A';
  
  document.getElementById('appRoomNumber').textContent = app.roomId?.roomNumber || 'N/A';
  document.getElementById('appRoomPrice').textContent = Number(app.roomId?.rentalPrice).toLocaleString() || 'N/A';
  document.getElementById('appRoomInfo').textContent = `Tầng ${app.roomId?.floor || '?'} / ${app.roomId?.area || '?'} m2`;
  
  document.getElementById('appCccdFront').src = app.tenantId?.cccdFrontImage || 'https://via.placeholder.com/400x200?text=Khong+co+anh';
  document.getElementById('appCccdBack').src = app.tenantId?.cccdBackImage || 'https://via.placeholder.com/400x200?text=Khong+co+anh';
  
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
