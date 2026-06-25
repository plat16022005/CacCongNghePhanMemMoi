import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Guests() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ guestName: '', cccd: '', phone: '', visitDate: '', visitTime: '', purpose: '', numberOfGuests: 1 });

  useEffect(() => { fetchGuests(); }, []);

  const fetchGuests = async () => {
    try {
      const res = await fetch('/api/resident/guests');
      const json = await res.json();
      if (!json.error) setGuests(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/resident/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Đăng ký khách thành công!');
        setShowModal(false);
        fetchGuests();
      } else {
        alert(json.message);
      }
    } catch (err) { alert('Lỗi kết nối'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hủy lịch đăng ký khách này?')) return;
    try {
      const res = await fetch(`/api/resident/guests/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.error) fetchGuests();
      else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 relative">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Đăng ký khách</h1>
          <p className="text-[var(--color-text-secondary)]">Đăng ký trước thông tin khách đến thăm</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-[var(--radius-md)] font-bold flex items-center gap-2 hover:bg-[var(--color-primary-light)] transition"
        >
          <Plus className="w-5 h-5" /> Thêm khách
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {guests.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-lg border text-gray-500">Chưa có khách nào được đăng ký</div>
        ) : (
          guests.map((g) => (
            <div key={g._id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{g.guestName}</h3>
                    <p className="text-xs text-gray-500 font-mono">{g.phone}</p>
                  </div>
                </div>
                {g.status === 'pending' && <span className="text-[var(--color-warning)] bg-[var(--color-warning-bg)] px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Chờ duyệt</span>}
                {g.status === 'approved' && <span className="text-[var(--color-success)] bg-[var(--color-success-bg)] px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Đã duyệt</span>}
                {g.status === 'rejected' && <span className="text-[var(--color-error)] bg-[var(--color-error-bg)] px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Từ chối</span>}
              </div>
              
              <div className="text-sm text-gray-600 mb-4 flex flex-col gap-1">
                <p><strong>Ngày đến:</strong> {new Date(g.visitDate).toLocaleDateString('vi-VN')} {g.visitTime}</p>
                <p><strong>Mục đích:</strong> {g.purpose || '---'}</p>
                <p><strong>Số người:</strong> {g.numberOfGuests}</p>
              </div>

              {g.status === 'pending' && (
                <button 
                  onClick={() => handleDelete(g._id)}
                  className="w-full py-2 border border-red-200 text-red-500 rounded hover:bg-red-50 transition text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Hủy đăng ký
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[var(--radius-lg)] p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Đăng ký khách mới</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div><label className="text-sm font-bold text-gray-600">Tên khách</label><input required value={form.guestName} onChange={e=>setForm({...form, guestName: e.target.value})} className="w-full border p-2 rounded" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-gray-600">SĐT</label><input required value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full border p-2 rounded" /></div>
                <div><label className="text-sm font-bold text-gray-600">CCCD</label><input required value={form.cccd} onChange={e=>setForm({...form, cccd: e.target.value})} className="w-full border p-2 rounded" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-gray-600">Ngày đến</label><input type="date" required value={form.visitDate} onChange={e=>setForm({...form, visitDate: e.target.value})} className="w-full border p-2 rounded" /></div>
                <div><label className="text-sm font-bold text-gray-600">Giờ đến</label><input type="time" required value={form.visitTime} onChange={e=>setForm({...form, visitTime: e.target.value})} className="w-full border p-2 rounded" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-gray-600">Số người</label><input type="number" min="1" value={form.numberOfGuests} onChange={e=>setForm({...form, numberOfGuests: parseInt(e.target.value)})} className="w-full border p-2 rounded" /></div>
                <div><label className="text-sm font-bold text-gray-600">Mục đích</label><input value={form.purpose} onChange={e=>setForm({...form, purpose: e.target.value})} className="w-full border p-2 rounded" /></div>
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
