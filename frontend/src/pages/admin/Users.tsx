import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Filter, Plus, ShieldAlert } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300); // debounce
    return () => clearTimeout(timer);
  }, [search, role, status, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/users?page=${page}&limit=20`;
      if (search) url += `&search=${search}`;
      if (role) url += `&role=${role}`;
      if (status) url += `&status=${status}`;

      const res = await fetch(url);
      const json = await res.json();
      setUsers(json.data || []);
      setTotalPages(Math.ceil((json.pagination?.total || 0) / 20));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const getRoleColor = (r: string) => {
    switch(r) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'manager': return 'bg-purple-100 text-purple-700';
      case 'security': return 'bg-orange-100 text-orange-700';
      case 'accountant': return 'bg-emerald-100 text-emerald-700';
      case 'maintenance': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'deleted': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý Tài Khoản</h1>
          <p className="text-slate-500">Thêm mới, phân quyền và khóa tài khoản</p>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30">
          <Plus className="w-5 h-5" /> Tạo Account Mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, email, SDT..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select value={role} onChange={e=>setRole(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-500">
              <option value="">Tất cả Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="accountant">Accountant</option>
              <option value="maintenance">Maintenance</option>
              <option value="security">Security</option>
              <option value="resident">Resident</option>
            </select>
          </div>

          <select value={status} onChange={e=>setStatus(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-500">
            <option value="">Tất cả Trạng thái</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div> : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase w-10">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Người dùng</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Lần cuối đăng nhập</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(u.status)}`} title={u.status}></div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{u.fullName}</div>
                    <div className="text-sm text-slate-500">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase flex items-center w-fit gap-1 ${getRoleColor(u.role)}`}>
                      {u.role === 'admin' && <ShieldAlert className="w-3 h-3"/>}
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-500">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString('vi-VN') : 'Chưa từng'}
                  </td>
                  <td className="p-4 text-right">
                    <NavLink to={`/admin/users/${u.id}`} className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 text-indigo-600 font-bold text-sm rounded-lg transition">
                      Chi tiết
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-white border rounded disabled:opacity-50 font-bold">Prev</button>
          <span className="font-bold text-slate-600">Trang {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-white border rounded disabled:opacity-50 font-bold">Next</button>
        </div>
      )}
    </div>
  );
}
