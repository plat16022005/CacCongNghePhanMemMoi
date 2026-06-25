import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserX, UserCheck, ShieldAlert, KeyRound } from 'lucide-react';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // States for actions
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      const json = await res.json();
      setUser(json);
      setNewRole(json.role);
      setNewStatus(json.status);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleRoleChange = async () => {
    if(!window.confirm(`Đổi Role thành ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const json = await res.json();
      if(res.ok) alert('Đổi Role thành công');
      else alert(json.message);
      fetchUser();
    } catch (err) { alert('Lỗi'); }
  };

  const handleStatusChange = async () => {
    if(!window.confirm(`Đổi Status thành ${newStatus}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if(res.ok) alert('Đổi Status thành công');
      else alert(json.message);
      fetchUser();
    } catch (err) { alert('Lỗi'); }
  };

  const handleResetPassword = async () => {
    if(!window.confirm(`Reset mật khẩu cho user này?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/reset-password`, { method: 'POST' });
      const json = await res.json();
      if(res.ok) alert(json.message);
      else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  if (loading || !user) return <div className="p-8">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-4 hover:text-slate-800 transition w-fit">
        <ArrowLeft className="w-5 h-5" /> Trở về danh sách
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">{user.name || `${user.firstName || ''} ${user.lastName || ''}`}</h1>
            <p className="text-slate-400">{user.email}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 bg-white/20 rounded font-bold uppercase tracking-wider text-sm">{user.role}</span>
            <span className={`px-3 py-1 rounded font-bold uppercase tracking-wider text-sm ${user.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>{user.status}</span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Thông tin cá nhân</h3>
            <div><label className="text-xs font-bold text-slate-400 uppercase">Số điện thoại</label><p className="font-medium">{user.phoneNumber || 'N/A'}</p></div>
            <div><label className="text-xs font-bold text-slate-400 uppercase">CCCD</label><p className="font-medium">{user.cccdNumber || 'N/A'}</p></div>
            <div><label className="text-xs font-bold text-slate-400 uppercase">Giới tính</label><p className="font-medium">{user.gender || 'N/A'}</p></div>
            <div><label className="text-xs font-bold text-slate-400 uppercase">Lần cuối đăng nhập</label><p className="font-mono text-sm text-indigo-600">{user.lastLogin ? new Date(user.lastLogin).toLocaleString('vi-VN') : 'Chưa có dữ liệu'}</p></div>
          </div>

          <div className="flex flex-col gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Thao tác Quản trị</h3>
            
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-indigo-500"/> Chuyển đổi Role</label>
              <div className="flex gap-2">
                <select value={newRole} onChange={e=>setNewRole(e.target.value)} className="flex-1 border p-2 rounded focus:border-indigo-500 font-bold text-slate-700 bg-white">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="accountant">Accountant</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="security">Security</option>
                  <option value="resident">Resident</option>
                </select>
                <button onClick={handleRoleChange} disabled={newRole === user.role} className="px-4 bg-indigo-600 text-white rounded font-bold disabled:opacity-50">Lưu</button>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                {newStatus === 'active' ? <UserCheck className="w-4 h-4 text-emerald-500"/> : <UserX className="w-4 h-4 text-red-500"/>} 
                Chuyển trạng thái
              </label>
              <div className="flex gap-2">
                <select value={newStatus} onChange={e=>setNewStatus(e.target.value)} className="flex-1 border p-2 rounded focus:border-indigo-500 font-bold text-slate-700 bg-white">
                  <option value="active">Active (Hoạt động)</option>
                  <option value="inactive">Inactive (Khóa tạm thời)</option>
                  <option value="deleted">Deleted (Xóa mềm)</option>
                </select>
                <button onClick={handleStatusChange} disabled={newStatus === user.status} className="px-4 bg-indigo-600 text-white rounded font-bold disabled:opacity-50">Lưu</button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><KeyRound className="w-4 h-4 text-orange-500"/> Bảo mật</label>
              <button onClick={handleResetPassword} className="w-full py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded font-bold transition border border-orange-200">
                Gửi Email Reset Password
              </button>
              <p className="text-xs text-slate-500 text-center">User sẽ bị ép đổi mật khẩu ở lần đăng nhập tới.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
