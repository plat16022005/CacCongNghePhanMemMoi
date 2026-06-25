import { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Parking() {
  const [parkings, setParkings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ licensePlate: '', vehicleType: 'motorbike', vehicleBrand: '', vehicleColor: '' });

  useEffect(() => { fetchParkings(); }, []);

  const fetchParkings = async () => {
    try {
      const res = await fetch('/api/resident/parking');
      const json = await res.json();
      if (!json.error) setParkings(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/resident/parking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Đăng ký thẻ xe thành công!');
        setShowModal(false);
        fetchParkings();
      } else {
        alert(json.message || 'Lỗi khi đăng ký xe');
      }
    } catch (err) { alert('Lỗi kết nối'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hủy đăng ký thẻ xe này?')) return;
    try {
      const res = await fetch(`/api/resident/parking/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.error) fetchParkings();
      else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 relative">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Đăng ký gửi xe</h1>
          <p className="text-[var(--color-text-secondary)]">Tối đa 2 xe / căn hộ</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-[var(--radius-md)] font-bold flex items-center gap-2 hover:bg-[var(--color-primary-light)] transition"
        >
          <Plus className="w-5 h-5" /> Đăng ký xe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {parkings.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-lg border text-gray-500">Chưa có thẻ xe nào</div>
        ) : (
          parkings.map((p) => (
            <div key={p._id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Car className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg uppercase tracking-widest font-mono">{p.licensePlate}</h3>
                    <p className="text-sm text-gray-500 capitalize">{p.vehicleType}</p>
                  </div>
                </div>
                {p.status === 'pending' && <span className="text-[var(--color-warning)] bg-[var(--color-warning-bg)] px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Chờ duyệt</span>}
                {p.status === 'approved' && <span className="text-[var(--color-success)] bg-[var(--color-success-bg)] px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Đã duyệt</span>}
                {p.status === 'rejected' && <span className="text-[var(--color-error)] bg-[var(--color-error-bg)] px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Từ chối</span>}
              </div>
              
              <div className="text-sm text-gray-600 mb-4 flex justify-between bg-gray-50 p-3 rounded">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Nhãn hiệu</p>
                  <p className="font-bold">{p.vehicleBrand || '---'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase">Màu xe</p>
                  <p className="font-bold">{p.vehicleColor || '---'}</p>
                </div>
              </div>

              {p.status === 'pending' && (
                <button 
                  onClick={() => handleDelete(p._id)}
                  className="w-full py-2 border border-red-200 text-red-500 rounded hover:bg-red-50 transition text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Hủy đăng ký
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[var(--radius-lg)] p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Đăng ký xe mới</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-gray-600">Loại xe</label>
                <select value={form.vehicleType} onChange={e=>setForm({...form, vehicleType: e.target.value})} className="w-full border p-2 rounded">
                  <option value="motorbike">Xe máy</option>
                  <option value="car">Ô tô</option>
                  <option value="bicycle">Xe đạp</option>
                </select>
              </div>
              <div><label className="text-sm font-bold text-gray-600">Biển số (VD: 51A-12345)</label><input required value={form.licensePlate} onChange={e=>setForm({...form, licensePlate: e.target.value})} className="w-full border p-2 rounded uppercase font-mono" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-gray-600">Nhãn hiệu</label><input required value={form.vehicleBrand} onChange={e=>setForm({...form, vehicleBrand: e.target.value})} className="w-full border p-2 rounded" /></div>
                <div><label className="text-sm font-bold text-gray-600">Màu xe</label><input required value={form.vehicleColor} onChange={e=>setForm({...form, vehicleColor: e.target.value})} className="w-full border p-2 rounded" /></div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2 border rounded font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded font-bold hover:bg-[var(--color-primary-light)]">Đăng ký</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
