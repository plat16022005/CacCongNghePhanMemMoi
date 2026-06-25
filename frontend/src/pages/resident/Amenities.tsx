import { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, Users, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Amenities() {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ amenityId: '', date: '', startTime: '', endTime: '', numberOfPeople: 1 });

  useEffect(() => { 
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const [amenitiesRes, bookingsRes] = await Promise.all([
        fetch('/api/resident/amenities'),
        fetch('/api/resident/amenities/bookings')
      ]);
      const amData = await amenitiesRes.json();
      const bkData = await bookingsRes.json();
      
      if (!amData.error) setAmenities(amData.data || []);
      if (!bkData.error) setBookings(bkData.data || []);
      
      if (amData.data && amData.data.length > 0) {
        setForm(f => ({ ...f, amenityId: amData.data[0]._id }));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Rào lại thời gian hợp lý
    const today = new Date().toISOString().split('T')[0];
    if (form.date < today) {
      alert('Không thể đặt lịch cho ngày trong quá khứ!');
      return;
    }
    if (form.startTime >= form.endTime) {
      alert('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!');
      return;
    }

    try {
      const res = await fetch(`/api/resident/amenities/${form.amenityId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Đặt lịch tiện ích thành công!');
        setShowModal(false);
        fetchData();
      } else {
        alert(json.message);
      }
    } catch (err) { alert('Lỗi kết nối'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn muốn hủy lịch đặt này?')) return;
    try {
      const res = await fetch(`/api/resident/amenities/bookings/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.error) fetchData();
      else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 relative">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Tiện ích & Đặt lịch</h1>
          <p className="text-[var(--color-text-secondary)]">Quản lý và đặt lịch sử dụng các tiện ích chung cư</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-[var(--radius-md)] font-bold flex items-center gap-2 hover:bg-[var(--color-primary-light)] transition"
        >
          <Plus className="w-5 h-5" /> Đặt lịch mới
        </button>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-6">
        <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4 border-b pb-2">Lịch đã đặt của bạn</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-xs font-bold text-gray-500 uppercase">Tiện ích</th>
                <th className="p-3 text-xs font-bold text-gray-500 uppercase">Ngày</th>
                <th className="p-3 text-xs font-bold text-gray-500 uppercase">Thời gian</th>
                <th className="p-3 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                <th className="p-3 text-xs font-bold text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Bạn chưa đặt lịch nào</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-bold text-[var(--color-primary)]">{b.amenityId?.name || '---'}</td>
                    <td className="p-3 text-sm">{new Date(b.date).toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 text-sm font-mono">{b.startTime} - {b.endTime}</td>
                    <td className="p-3">
                      {b.status === 'pending' && <span className="text-orange-500 font-bold text-xs bg-orange-50 px-2 py-1 rounded">Chờ duyệt</span>}
                      {b.status === 'approved' && <span className="text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded">Đã duyệt</span>}
                      {b.status === 'rejected' && <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded">Từ chối</span>}
                    </td>
                    <td className="p-3">
                      {(b.status === 'pending' || b.status === 'approved') && (
                        <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map(a => (
          <div key={a._id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-5">
            <h3 className="font-bold text-[var(--color-primary)] text-lg mb-2">{a.name}</h3>
            <p className="text-sm text-gray-500 mb-4 h-10">{a.description}</p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p className="flex items-center gap-2"><Clock className="w-4 h-4"/> {a.openTime} - {a.closeTime}</p>
              <p className="flex items-center gap-2"><Users className="w-4 h-4"/> Sức chứa: {a.capacity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[var(--radius-lg)] p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Đặt lịch tiện ích</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-gray-600">Chọn tiện ích</label>
                <select required value={form.amenityId} onChange={e=>setForm({...form, amenityId: e.target.value})} className="w-full border p-2 rounded">
                  {amenities.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
              
              <div><label className="text-sm font-bold text-gray-600">Ngày đặt</label><input type="date" required value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="w-full border p-2 rounded" /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-gray-600">Từ giờ</label><input type="time" required value={form.startTime} onChange={e=>setForm({...form, startTime: e.target.value})} className="w-full border p-2 rounded" /></div>
                <div><label className="text-sm font-bold text-gray-600">Đến giờ</label><input type="time" required value={form.endTime} onChange={e=>setForm({...form, endTime: e.target.value})} className="w-full border p-2 rounded" /></div>
              </div>

              <div><label className="text-sm font-bold text-gray-600">Số người sử dụng</label><input type="number" min="1" required value={form.numberOfPeople} onChange={e=>setForm({...form, numberOfPeople: parseInt(e.target.value)})} className="w-full border p-2 rounded" /></div>
              
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2 border rounded font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded font-bold hover:bg-[var(--color-primary-light)]">Đặt lịch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
