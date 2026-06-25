import { useState, useEffect } from 'react';
import { Users, Server, Database, Activity, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      setStats(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="p-8 font-bold text-slate-500">Đang tải cấu hình hệ thống...</div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">System Dashboard</h1>
        <p className="text-slate-500">Tổng quan toàn bộ hệ thống ApartmentHub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Users className="w-6 h-6"/></div>
            <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Active: {stats?.users?.activeToday || 0}</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats?.users?.total || 0}</p>
          <p className="text-sm font-bold text-slate-500 uppercase mt-1">Tổng Tài Khoản</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Server className="w-6 h-6"/></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats?.system?.uptime || 'N/A'}</p>
          <p className="text-sm font-bold text-slate-500 uppercase mt-1">System Uptime</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Database className="w-6 h-6"/></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats?.system?.dbSizeMB || 0} MB</p>
          <p className="text-sm font-bold text-slate-500 uppercase mt-1">Database Size</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stats?.recentErrors > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}><Activity className="w-6 h-6"/></div>
          </div>
          <p className={`text-3xl font-bold ${stats?.recentErrors > 0 ? 'text-red-600' : 'text-slate-800'}`}>{stats?.recentErrors || 0}</p>
          <p className="text-sm font-bold text-slate-500 uppercase mt-1">Lỗi hệ thống hôm nay</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Cơ cấu Tài khoản theo Role</h2>
          <div className="flex flex-col gap-4">
            {stats?.users?.byRole && Object.entries(stats.users.byRole).map(([role, count]: any) => {
              const percentage = ((count / stats.users.total) * 100).toFixed(1);
              return (
                <div key={role} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="uppercase text-slate-600">{role}</span>
                    <span className="text-slate-800">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{width: `${percentage}%`}}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Hạ tầng chung cư</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div>
                <p className="font-bold text-slate-800 text-lg">Tổng số Tòa nhà</p>
                <p className="text-sm text-slate-500">Đang được quản lý trên hệ thống</p>
              </div>
              <span className="text-3xl font-bold text-indigo-600">{stats?.system?.buildings || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div>
                <p className="font-bold text-slate-800 text-lg">Tổng Căn Hộ</p>
                <p className="text-sm text-slate-500">Bao gồm trống và đã có người</p>
              </div>
              <span className="text-3xl font-bold text-emerald-600">{stats?.system?.totalApartments || 0}</span>
            </div>
            
            {stats?.recentErrors > 0 && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-200 mt-auto">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Cảnh báo hệ thống</h4>
                  <p className="text-sm mt-1">Phát hiện {stats.recentErrors} lỗi phát sinh trong ngày. Vui lòng kiểm tra log hệ thống để xử lý.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
