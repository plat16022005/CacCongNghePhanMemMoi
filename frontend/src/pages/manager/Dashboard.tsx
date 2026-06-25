import { useState, useEffect } from 'react';
import { Users, Home, FileText, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/manager/dashboard');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for Recharts, since we don't have the full aggregation in the API yet.
  const chartData = [
    { name: 'Tháng 1', paid: 60000000, unpaid: 10000000 },
    { name: 'Tháng 2', paid: 65000000, unpaid: 5000000 },
    { name: 'Tháng 3', paid: 70000000, unpaid: 8000000 },
    { name: 'Tháng 4', paid: 68000000, unpaid: 12000000 },
    { name: 'Tháng 5', paid: 75000000, unpaid: 4000000 },
    { name: 'Tháng 6', paid: 85000000, unpaid: 20000000 },
  ];

  if (loading) return <div className="p-6 text-slate-500">Đang tải dữ liệu tổng quan...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan chung cư</h1>
        <p className="text-slate-500">Số liệu cập nhật thời gian thực</p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tổng cư dân</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalResidents || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Căn hộ trống</p>
            <p className="text-2xl font-bold text-slate-800">
              {(stats.totalApartments || 0) - (stats.occupiedApartments || 0)}
              <span className="text-xs text-slate-400 font-normal ml-2">/ {stats.totalApartments || 0} căn</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Hóa đơn chưa thu</p>
            <p className="text-2xl font-bold text-slate-800">{stats.unpaidInvoices || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Yêu cầu bảo trì mở</p>
            <p className="text-2xl font-bold text-slate-800">{stats.openMaintenanceRequests || 0}</p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Doanh thu 6 tháng gần nhất</h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748B'}} 
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <Tooltip 
                cursor={{fill: '#F8FAFC'}} 
                formatter={(value: number) => [`${value.toLocaleString()} VNĐ`, '']}
              />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              <Bar dataKey="paid" name="Đã thu" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={50} />
              <Bar dataKey="unpaid" name="Chưa thu" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
