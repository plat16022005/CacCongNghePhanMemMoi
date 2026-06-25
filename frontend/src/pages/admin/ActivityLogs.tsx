import { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchLogs(); }, [action, page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/logs?page=${page}&limit=50${action ? `&action=${action}` : ''}`);
      const json = await res.json();
      setLogs(json.data || []);
      setTotalPages(Math.ceil((json.pagination?.total || 0) / 50));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const formatAction = (a: string) => {
    const map: any = {
      login: 'Đăng nhập', logout: 'Đăng xuất', 
      role_change: 'Đổi Quyền', status_change: 'Đổi Trạng Thái',
      config_update: 'Sửa Cấu Hình', password_reset: 'Reset Password',
      user_create: 'Tạo User', building_create: 'Tạo Tòa nhà'
    };
    return map[a] || a;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Nhật ký Audit Log</h1>
          <p className="text-slate-500">Giám sát toàn bộ hoạt động nhạy cảm trên hệ thống</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <Activity className="w-5 h-5 text-indigo-500" />
        <span className="font-bold text-slate-600">Lọc theo hành động:</span>
        <select value={action} onChange={e=>setAction(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-bold text-slate-700 outline-none focus:border-indigo-500">
          <option value="">Tất cả hành động</option>
          <option value="login">Đăng nhập</option>
          <option value="role_change">Thay đổi Role</option>
          <option value="status_change">Đổi Status User</option>
          <option value="config_update">Cập nhật Config</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? <div className="p-8 text-center text-slate-500">Đang tải Audit Logs...</div> : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="p-4 font-bold uppercase w-48">Thời gian</th>
                <th className="p-4 font-bold uppercase">Người thực hiện</th>
                <th className="p-4 font-bold uppercase">Hành động</th>
                <th className="p-4 font-bold uppercase">Mục tiêu</th>
                <th className="p-4 font-bold uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-mono text-slate-500 whitespace-nowrap flex items-center gap-2">
                    <Clock className="w-3 h-3"/>
                    {new Date(log.createdAt).toLocaleString('vi-VN', {hour12: false})}
                  </td>
                  <td className="p-4 font-bold text-indigo-600">{log.userName}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-200 text-slate-700 font-bold text-xs uppercase rounded">{formatAction(log.action)}</span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-500 break-all">{log.target}</td>
                  <td className="p-4 font-mono text-xs text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={5} className="p-8 text-center">Không có log nào</td></tr>}
            </tbody>
          </table>
        )}
      </div>

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
