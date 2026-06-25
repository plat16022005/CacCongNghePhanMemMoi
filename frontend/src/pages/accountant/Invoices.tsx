import { useState, useEffect } from 'react';
import { Plus, Filter, FileSpreadsheet } from 'lucide-react';

export default function AccountantInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkForm, setBulkForm] = useState({ period: '2024-06', type: 'management', dueDate: '', pricePerSqm: 8000, targetApartments: 'all' });

  useEffect(() => { fetchInvoices(); }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/accountant/invoices');
      const json = await res.json();
      setInvoices(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleBulkSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/accountant/invoices/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkForm)
      });
      const json = await res.json();
      alert(`Đã tạo thành công ${json.created} hóa đơn. Bỏ qua ${json.skipped} (trùng lặp hoặc phòng trống).`);
      setShowBulk(false);
      fetchInvoices();
    } catch (err) { alert('Lỗi'); }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Đã thanh toán</span>;
      case 'unpaid': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">Chưa thanh toán</span>;
      case 'overdue': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">Quá hạn</span>;
      case 'draft': return <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">Bản nháp</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-slate-200 text-slate-500 text-xs font-bold rounded line-through">Đã hủy</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Hóa đơn</h1>
          <p className="text-slate-500">Xem và phát hành hóa đơn thu phí</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Lọc
          </button>
          <button onClick={() => setShowBulk(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700">
            <FileSpreadsheet className="w-5 h-5" /> Tạo hàng loạt
          </button>
          <button className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-900">
            <Plus className="w-5 h-5" /> Tạo hóa đơn lẻ
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? <div className="p-6">Đang tải...</div> : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Phòng / Chủ hộ</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Loại phí</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Kỳ</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Hạn chót</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Tổng tiền</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-bold text-indigo-600">{inv.room?.roomNumber || '---'}</div>
                    <div className="text-xs text-slate-500">{inv.tenant?.name || 'Trống'}</div>
                  </td>
                  <td className="p-4 font-medium capitalize text-slate-700">{inv.type}</td>
                  <td className="p-4 font-mono text-slate-600">{inv.period || inv.month}</td>
                  <td className="p-4 text-sm text-slate-500">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('vi-VN') : '---'}</td>
                  <td className="p-4 text-right font-bold text-slate-800">{(inv.amount || inv.totalBill).toLocaleString()} đ</td>
                  <td className="p-4 text-center">{getStatusBadge(inv.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showBulk && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-emerald-700">Tạo hóa đơn hàng loạt</h2>
            <form onSubmit={handleBulkSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-slate-600">Kỳ (YYYY-MM)</label><input required value={bulkForm.period} onChange={e=>setBulkForm({...bulkForm, period: e.target.value})} className="w-full border p-2 rounded focus:border-emerald-500" /></div>
                <div>
                  <label className="text-sm font-bold text-slate-600">Loại phí</label>
                  <select value={bulkForm.type} onChange={e=>setBulkForm({...bulkForm, type: e.target.value})} className="w-full border p-2 rounded focus:border-emerald-500 bg-white">
                    <option value="management">Phí quản lý</option>
                    <option value="parking">Phí gửi xe</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-slate-600">Hạn chót</label><input type="date" required value={bulkForm.dueDate} onChange={e=>setBulkForm({...bulkForm, dueDate: e.target.value})} className="w-full border p-2 rounded focus:border-emerald-500" /></div>
                <div><label className="text-sm font-bold text-slate-600">Đơn giá / m2</label><input type="number" required value={bulkForm.pricePerSqm} onChange={e=>setBulkForm({...bulkForm, pricePerSqm: Number(e.target.value)})} className="w-full border p-2 rounded focus:border-emerald-500" /></div>
              </div>

              <div className="bg-emerald-50 text-emerald-700 p-3 rounded text-sm mt-2">
                Hệ thống sẽ tự động nhân diện tích căn hộ với đơn giá và bỏ qua các căn hộ trống hoặc đã tạo hóa đơn cho kỳ này.
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowBulk(false)} className="flex-1 py-2 border rounded font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700">Phát hành tự động</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
