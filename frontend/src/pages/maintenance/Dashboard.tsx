import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AlertTriangle, Clock, CheckCircle2, Calendar } from 'lucide-react';

export default function MaintenanceDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/maintenance/dashboard');
      const json = await res.json();
      setStats(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan công việc</h1>
        <p className="text-slate-500">Hôm nay: {new Date().toLocaleDateString('vi-VN')}</p>
      </div>

      {stats?.emergencyTasks > 0 && (
        <NavLink to="/maintenance/tasks?urgency=emergency" className="bg-red-500 p-4 rounded-2xl text-white shadow-lg shadow-red-500/30 flex items-center gap-4 animate-pulse">
          <AlertTriangle className="w-10 h-10" />
          <div>
            <h2 className="text-xl font-bold">CÓ SỰ CỐ KHẨN CẤP!</h2>
            <p className="opacity-90 font-medium">Bạn có {stats.emergencyTasks} công việc cần xử lý ngay.</p>
          </div>
        </NavLink>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NavLink to="/maintenance/tasks?status=pending" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2">
          <Clock className="w-8 h-8 text-orange-500" />
          <span className="text-3xl font-bold text-slate-800">{stats?.myTasks?.pending || 0}</span>
          <span className="text-xs font-bold text-slate-500 uppercase text-center">Chờ tiếp nhận</span>
        </NavLink>

        <NavLink to="/maintenance/tasks?status=in_progress" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2">
          <WrenchIcon className="w-8 h-8 text-indigo-500" />
          <span className="text-3xl font-bold text-slate-800">{stats?.myTasks?.inProgress || 0}</span>
          <span className="text-xs font-bold text-slate-500 uppercase text-center">Đang xử lý</span>
        </NavLink>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          <span className="text-3xl font-bold text-slate-800">{stats?.myTasks?.completedToday || 0}</span>
          <span className="text-xs font-bold text-slate-500 uppercase text-center">Đã xong hôm nay</span>
        </div>

        <NavLink to="/maintenance/schedule" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2">
          <Calendar className="w-8 h-8 text-blue-500" />
          <span className="text-3xl font-bold text-slate-800">{stats?.scheduledToday || 0}</span>
          <span className="text-xs font-bold text-slate-500 uppercase text-center">Lịch bảo trì HN</span>
        </NavLink>
      </div>

      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
        <h3 className="font-bold text-orange-800 mb-2">Lưu ý an toàn</h3>
        <ul className="list-disc pl-5 text-sm text-orange-700 space-y-1">
          <li>Luôn mang đồ bảo hộ khi kiểm tra hệ thống điện/nước.</li>
          <li>Cập nhật hình ảnh và ghi chú đầy đủ sau khi hoàn thành.</li>
          <li>Ưu tiên xử lý các việc được đánh dấu Khẩn Cấp trước.</li>
        </ul>
      </div>
    </div>
  );
}

// Inline Icon to avoid extra imports
const WrenchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
);
