import { useState, useEffect } from 'react';
import { CreditCard, FileText, AlertOctagon, RefreshCw } from 'lucide-react';

export default function AccountantDashboard() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/accountant/dashboard');
      const json = await res.json();
      setStats(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="p-6 text-slate-500">Đang tải dữ liệu...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan tài chính</h1>
        <p className="text-slate-500">Kỳ báo cáo: <span className="font-bold">{stats.currentMonth}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <p className="text-sm font-bold text-slate-500 uppercase">Tổng đã xuất (tháng này)</p>
          </div>
          <p className="text-2xl font-bold text-slate-800">{(stats.totalBilled || 0).toLocaleString()} <span className="text-sm font-normal text-slate-500">VNĐ</span></p>
          <p className="text-xs text-slate-400 mt-2">{stats.invoicesCreatedThisMonth} hóa đơn</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/30">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-emerald-500" />
            <p className="text-sm font-bold text-emerald-700 uppercase">Đã thu (tháng này)</p>
          </div>
          <p className="text-2xl font-bold text-emerald-700">{(stats.totalCollected || 0).toLocaleString()} <span className="text-sm font-normal opacity-70">VNĐ</span></p>
          <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${stats.totalBilled ? (stats.totalCollected/stats.totalBilled)*100 : 0}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm bg-red-50/30">
          <div className="flex items-center gap-3 mb-2">
            <AlertOctagon className="w-5 h-5 text-red-500" />
            <p className="text-sm font-bold text-red-700 uppercase">Dư nợ quá hạn (Tổng)</p>
          </div>
          <p className="text-2xl font-bold text-red-700">{(stats.totalOverdue || 0).toLocaleString()} <span className="text-sm font-normal opacity-70">VNĐ</span></p>
          <p className="text-xs text-red-500 mt-2">{stats.overdueCount} hóa đơn quá hạn</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm bg-orange-50/30">
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="w-5 h-5 text-orange-500" />
            <p className="text-sm font-bold text-orange-700 uppercase">Chờ xác nhận</p>
          </div>
          <p className="text-2xl font-bold text-orange-700">{stats.pendingConfirmation || 0} <span className="text-sm font-normal opacity-70">giao dịch</span></p>
          <p className="text-xs text-orange-500 mt-2">Cần đối soát ngay</p>
        </div>
      </div>
    </div>
  );
}
