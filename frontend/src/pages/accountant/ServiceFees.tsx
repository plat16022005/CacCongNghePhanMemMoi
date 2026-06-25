import { useState, useEffect } from 'react';
import { Plus, Settings2 } from 'lucide-react';

export default function ServiceFees() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'management', unit: 'per_sqm', price: 0, effectiveFrom: '' });

  useEffect(() => { fetchFees(); }, []);

  const fetchFees = async () => {
    try {
      const res = await fetch('/api/accountant/service-fees');
      const json = await res.json();
      setFees(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/accountant/service-fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Đã thêm biểu phí mới!');
        setShowModal(false);
        fetchFees();
      } else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Cấu hình Biểu phí</h1>
          <p className="text-slate-500">Quản lý đơn giá các loại dịch vụ chung cư</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700">
          <Plus className="w-5 h-5" /> Thêm biểu phí mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <div className="p-6">Đang tải...</div> : fees.map(f => (
          <div key={f._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition"><Settings2 className="w-5 h-5"/></button>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{f.name}</h3>
            <p className="text-sm font-medium text-slate-500 uppercase mb-4 bg-slate-100 inline-block px-2 py-0.5 rounded">{f.type}</p>
            
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-bold text-emerald-600">{f.price.toLocaleString()}</span>
              <span className="text-slate-500 font-medium mb-1">đ / {f.unit.replace('per_', '')}</span>
            </div>

            <p className="text-xs text-slate-400 pt-4 border-t">Áp dụng từ: <span className="font-bold text-slate-600">{new Date(f.effectiveFrom).toLocaleDateString('vi-VN')}</span></p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-emerald-700">Thêm biểu phí mới</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div><label className="text-sm font-bold text-slate-600">Tên hiển thị</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border p-2 rounded focus:border-emerald-500" placeholder="VD: Phí quản lý chung cư" /></div>
              
              <div>
                <label className="text-sm font-bold text-slate-600">Phân loại</label>
                <select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="w-full border p-2 rounded focus:border-emerald-500 bg-white">
                  <option value="management">Phí quản lý</option>
                  <option value="electricity">Điện</option>
                  <option value="water">Nước</option>
                  <option value="parking">Gửi xe</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600">Đơn vị tính</label>
                <select value={form.unit} onChange={e=>setForm({...form, unit: e.target.value})} className="w-full border p-2 rounded focus:border-emerald-500 bg-white">
                  <option value="per_sqm">Theo m2 (Diện tích)</option>
                  <option value="per_unit">Theo số khối/kWh</option>
                  <option value="fixed">Cố định/Tháng</option>
                  <option value="per_vehicle">Theo từng xe</option>
                </select>
              </div>

              <div><label className="text-sm font-bold text-slate-600">Đơn giá (VNĐ)</label><input type="number" required value={form.price} onChange={e=>setForm({...form, price: Number(e.target.value)})} className="w-full border p-2 rounded focus:border-emerald-500 font-bold" /></div>
              <div><label className="text-sm font-bold text-slate-600">Ngày áp dụng</label><input type="date" required value={form.effectiveFrom} onChange={e=>setForm({...form, effectiveFrom: e.target.value})} className="w-full border p-2 rounded focus:border-emerald-500" /></div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2 border rounded font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700">Lưu biểu phí</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
