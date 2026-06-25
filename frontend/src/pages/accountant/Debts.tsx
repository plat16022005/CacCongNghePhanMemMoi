import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function AccountantDebts() {
  const [debts, setDebts] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDebts(); }, []);

  const fetchDebts = async () => {
    try {
      const res = await fetch('/api/accountant/debts?overdueOnly=true');
      const json = await res.json();
      setDebts(json.data || []);
      setSummary(json.summary || {});
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleRemindAll = async () => {
    if(!window.confirm('Gửi thông báo nhắc nợ (Notification) đến TẤT CẢ các căn hộ đang có dư nợ quá hạn?')) return;
    try {
      const apartmentIds = debts.map(d => d.apartmentId);
      const res = await fetch('/api/accountant/debts/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apartmentIds })
      });
      const json = await res.json();
      alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  const handleRemindSingle = async (id: string, code: string) => {
    if(!window.confirm(`Gửi nhắc nợ cho phòng ${code}?`)) return;
    try {
      const res = await fetch('/api/accountant/debts/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apartmentIds: [id] })
      });
      const json = await res.json();
      alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Công nợ</h1>
          <p className="text-slate-500">Danh sách các căn hộ đang có nợ quá hạn</p>
        </div>
        <button onClick={handleRemindAll} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-600 shadow-md shadow-red-500/20">
          <Send className="w-5 h-5" /> Gửi nhắc nợ hàng loạt
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
          <p className="text-sm font-bold text-red-600 uppercase">Tổng căn hộ nợ</p>
          <p className="text-2xl font-bold text-red-700">{summary.totalApartments || 0}</p>
        </div>
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
          <p className="text-sm font-bold text-red-600 uppercase">Tổng số tiền quá hạn</p>
          <p className="text-2xl font-bold text-red-700">{(summary.totalDebt || 0).toLocaleString()} VNĐ</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? <div className="p-6">Đang tải...</div> : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Căn hộ / Chủ hộ</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Số HĐ nợ</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Kỳ nợ cũ nhất</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Tổng nợ (VNĐ)</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {debts.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-500">Không có công nợ quá hạn</td></tr> : debts.map((d) => (
                <tr key={d.apartmentId} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-bold text-indigo-600 text-lg">Phòng {d.apartmentCode}</div>
                    <div className="text-sm text-slate-600">{d.residentName}</div>
                  </td>
                  <td className="p-4 text-center font-bold text-slate-700">{d.invoiceCount}</td>
                  <td className="p-4 text-sm text-slate-500 font-mono">{d.oldestDueDate ? new Date(d.oldestDueDate).toLocaleDateString('vi-VN') : '---'}</td>
                  <td className="p-4 text-right font-bold text-red-600 text-lg">{d.totalDebt.toLocaleString()} đ</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleRemindSingle(d.apartmentId, d.apartmentCode)} className="px-3 py-1.5 bg-orange-100 text-orange-700 font-bold rounded hover:bg-orange-200 text-sm flex items-center gap-1 ml-auto">
                      <Send className="w-3 h-3" /> Nhắc nợ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
