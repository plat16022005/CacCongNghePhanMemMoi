import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function AccountantPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]); // For manual confirm select
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ invoiceId: '', paymentMethod: 'cash', amount: 0, note: '' });

  useEffect(() => { 
    fetchPayments(); 
    fetchUnpaidInvoices();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/accountant/payments');
      const json = await res.json();
      setPayments(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchUnpaidInvoices = async () => {
    try {
      const res = await fetch('/api/accountant/invoices?status=unpaid');
      const json = await res.json();
      setInvoices(json.data || []);
    } catch (err) { console.error(err); }
  };

  const handleConfirm = async (e: any) => {
    e.preventDefault();
    if (!form.invoiceId) return alert('Vui lòng chọn hóa đơn');
    try {
      const res = await fetch(`/api/accountant/payments/${form.invoiceId}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Đã xác nhận thanh toán thành công!');
        setShowConfirm(false);
        fetchPayments();
        fetchUnpaidInvoices();
      } else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Lịch sử Thanh toán</h1>
          <p className="text-slate-500">Các giao dịch đã được ghi nhận</p>
        </div>
        <button onClick={() => setShowConfirm(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700">
          <CheckCircle2 className="w-5 h-5" /> Xác nhận thu tiền thủ công
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? <div className="p-6">Đang tải...</div> : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Mã GD</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Hóa đơn gốc</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Số tiền (VNĐ)</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Hình thức</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Thời gian nộp</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Người nhận</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-mono text-xs text-slate-500">{p.id.slice(-6).toUpperCase()}</td>
                  <td className="p-4">
                    <div className="font-bold text-indigo-600">Phòng {p.apartmentCode || 'N/A'}</div>
                    <div className="text-xs text-slate-500">{p.residentName || 'N/A'}</div>
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-600">+{p.amount?.toLocaleString()} đ</td>
                  <td className="p-4 text-sm font-medium capitalize">{p.method.replace('_', ' ')}</td>
                  <td className="p-4 text-sm font-mono text-slate-600">{new Date(p.paidAt).toLocaleString('vi-VN')}</td>
                  <td className="p-4 text-sm font-bold text-slate-700">{p.confirmedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-emerald-700">Xác nhận thu tiền tại quầy</h2>
            <form onSubmit={handleConfirm} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-slate-600 mb-1 block">Chọn hóa đơn chưa thanh toán</label>
                <select 
                  required 
                  value={form.invoiceId} 
                  onChange={e => {
                    const inv = invoices.find(i => i._id === e.target.value);
                    setForm({...form, invoiceId: e.target.value, amount: inv ? (inv.amount || inv.totalBill) : 0});
                  }} 
                  className="w-full border p-2 rounded focus:border-emerald-500 bg-white"
                >
                  <option value="">-- Chọn Hóa Đơn --</option>
                  {invoices.map(i => (
                    <option key={i._id} value={i._id}>Phòng {i.room?.roomNumber} - {i.type} - Kỳ {i.period}</option>
                  ))}
                </select>
              </div>

              <div><label className="text-sm font-bold text-slate-600">Số tiền nộp (VNĐ)</label><input type="number" required value={form.amount} onChange={e=>setForm({...form, amount: Number(e.target.value)})} className="w-full border p-2 rounded focus:border-emerald-500 font-mono font-bold" /></div>
              
              <div>
                <label className="text-sm font-bold text-slate-600">Hình thức thanh toán</label>
                <select value={form.paymentMethod} onChange={e=>setForm({...form, paymentMethod: e.target.value})} className="w-full border p-2 rounded focus:border-emerald-500 bg-white">
                  <option value="cash">Tiền mặt</option>
                  <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                </select>
              </div>

              <div><label className="text-sm font-bold text-slate-600">Ghi chú</label><textarea rows={2} value={form.note} onChange={e=>setForm({...form, note: e.target.value})} className="w-full border p-2 rounded focus:border-emerald-500" /></div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowConfirm(false)} className="flex-1 py-2 border rounded font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700">Xác nhận đã thu tiền</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
