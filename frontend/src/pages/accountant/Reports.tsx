import { useState, useEffect } from 'react';
import { Download, PieChart, TrendingUp } from 'lucide-react';

export default function AccountantReports() {
  const [report, setReport] = useState<any>(null);
  const [month, setMonth] = useState('2024-06');
  const [exportFrom, setExportFrom] = useState('');
  const [exportTo, setExportTo] = useState('');

  useEffect(() => { fetchReport(); }, [month]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/accountant/reports/monthly?month=${month}`);
      const json = await res.json();
      setReport(json);
    } catch (err) { console.error(err); }
  };

  const handleExport = () => {
    if (!exportFrom || !exportTo) return alert('Vui lòng chọn từ ngày đến ngày');
    window.location.href = `/api/accountant/reports/export?from=${exportFrom}&to=${exportTo}`;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Báo cáo Tài chính</h1>
          <p className="text-slate-500">Phân tích thu chi và xuất dữ liệu Excel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><PieChart className="w-6 h-6 text-emerald-500"/> Cơ cấu thu theo loại phí</h2>
              <input type="month" value={month} onChange={e=>setMonth(e.target.value)} className="border p-2 rounded font-bold text-slate-700 bg-slate-50" />
            </div>

            {report ? (
              <div className="flex flex-col gap-4">
                {report.byType.map((t: any) => (
                  <div key={t.type} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="uppercase text-slate-600">{t.type}</span>
                      <span className="text-slate-800">{t.collected.toLocaleString()} / {t.billed.toLocaleString()} đ ({t.rate.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{width: `${t.rate}%`}}></div>
                    </div>
                  </div>
                ))}

                <div className="mt-6 pt-6 border-t flex justify-between items-center">
                  <div>
                    <p className="text-slate-500 font-bold uppercase text-sm mb-1">Tổng dư nợ kỳ này</p>
                    <p className="text-2xl font-bold text-red-600">{report.total?.outstanding?.toLocaleString()} đ</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 font-bold uppercase text-sm mb-1">Tổng thu kỳ này</p>
                    <p className="text-3xl font-bold text-emerald-600">{report.total?.collected?.toLocaleString()} đ</p>
                  </div>
                </div>
              </div>
            ) : <p>Đang tải...</p>}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 rounded-xl shadow-lg text-white">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Download className="w-6 h-6"/> Xuất Excel</h2>
            <p className="text-emerald-200 text-sm mb-6">Tải xuống báo cáo chi tiết các giao dịch và hóa đơn dưới dạng file .xlsx đa sheet.</p>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-emerald-300 mb-1 block">Từ ngày</label>
                <input type="date" value={exportFrom} onChange={e=>setExportFrom(e.target.value)} className="w-full p-2 rounded bg-emerald-900/50 border border-emerald-700 text-white focus:outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="text-sm font-bold text-emerald-300 mb-1 block">Đến ngày</label>
                <input type="date" value={exportTo} onChange={e=>setExportTo(e.target.value)} className="w-full p-2 rounded bg-emerald-900/50 border border-emerald-700 text-white focus:outline-none focus:border-emerald-400" />
              </div>
              <button onClick={handleExport} className="w-full py-3 mt-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-2">
                <Download className="w-5 h-5"/> Tải Báo Cáo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
