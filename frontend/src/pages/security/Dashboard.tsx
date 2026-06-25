import { useState, useEffect } from 'react';
import { Users, UserCheck, UserMinus, Clock, AlertTriangle } from 'lucide-react';

export default function SecurityDashboard() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/security/dashboard');
      const json = await res.json();
      setStats(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="p-8 text-xl font-medium text-slate-500">Đang tải dữ liệu ca trực...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Báo cáo ca trực</h1>
          <p className="text-lg text-slate-500">Ngày: <span className="font-bold text-slate-700">{stats.date}</span></p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-6 py-3 rounded-xl font-bold text-xl uppercase tracking-wider">
          Ca {stats.shift === 'morning' ? 'Sáng' : stats.shift === 'afternoon' ? 'Chiều' : 'Tối'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border-l-8 border-l-blue-500 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg text-slate-500 font-medium">Khách dự kiến hôm nay</p>
            <p className="text-4xl font-bold text-slate-800 mt-2">{stats.guestsToday || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border-l-8 border-l-green-500 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg text-slate-500 font-medium">Đã Check-in (Vào)</p>
            <p className="text-4xl font-bold text-slate-800 mt-2">{stats.guestsCheckedIn || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-l-8 border-l-slate-500 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <UserMinus className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg text-slate-500 font-medium">Đã Check-out (Ra)</p>
            <p className="text-4xl font-bold text-slate-800 mt-2">{stats.guestsCheckedOut || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-l-8 border-l-red-500 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg text-slate-500 font-medium">Sự cố đang xử lý</p>
            <p className="text-4xl font-bold text-slate-800 mt-2">{stats.openIncidents || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-l-8 border-l-indigo-500 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg text-slate-500 font-medium">Xe chờ cấp thẻ</p>
            <p className="text-4xl font-bold text-slate-800 mt-2">{stats.pendingVehicleRegistrations || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
