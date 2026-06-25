import { useState, useEffect } from 'react';
import { FileText, Send } from 'lucide-react';

export default function Reports() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInvoices(); }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/manager/invoices');
      const json = await res.json();
      if (!json.error) setInvoices(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleRemind = async () => {
    if(!window.confirm('Gửi thông báo nhắc nhở đến tất cả căn hộ chưa đóng tiền?')) return;
    try {
      const res = await fetch('/api/manager/invoices/remind', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const json = await res.json();
      alert(json.message || 'Đã gửi');
    } catch (err) { alert('Lỗi'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Thu phí</h1>
          <p className="text-slate-500">Danh sách hóa đơn</p>
        </div>
        <button onClick={handleRemind} className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-600">
          <Send className="w-5 h-5" /> Nhắc nợ đồng loạt
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500">Phòng</th>
              <th className="p-4 text-xs font-bold text-slate-500">Kỳ</th>
              <th className="p-4 text-xs font-bold text-slate-500">Tổng tiền</th>
              <th className="p-4 text-xs font-bold text-slate-500">Hạn chót</th>
              <th className="p-4 text-xs font-bold text-slate-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-bold text-indigo-600">{inv.room?.roomNumber || '---'}</td>
                <td className="p-4 font-medium">{inv.period || inv.month}</td>
                <td className="p-4 font-mono font-bold text-slate-800">{Number(inv.totalBill).toLocaleString()} đ</td>
                <td className="p-4 text-sm text-slate-500">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('vi-VN') : '---'}</td>
                <td className="p-4">
                  {inv.status === 'paid' 
                    ? <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Đã thu</span>
                    : <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Chưa thanh toán</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
