import { useState, useEffect } from 'react';
import { Plus, Power } from 'lucide-react';

export default function ManagerAmenities() {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', openTime: '06:00', closeTime: '22:00', capacity: 20 });

  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => { fetchAmenities(); }, []);

  const fetchAmenities = async () => {
    try {
      const res = await fetch('/api/manager/amenities');
      const json = await res.json();
      if (!json.error) setAmenities(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleViewBookings = async (amenity: any) => {
    setSelectedAmenity(amenity);
    setShowBookingsModal(true);
    try {
      const res = await fetch(`/api/manager/amenities/${amenity._id}/bookings`);
      const json = await res.json();
      if (!json.error) setBookings(json.data || []);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/manager/amenities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Tạo tiện ích thành công!');
        setShowModal(false);
        fetchAmenities();
      } else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await fetch(`/api/manager/amenities/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAmenities();
    } catch (err) { alert('Lỗi'); }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`/api/manager/amenities/bookings/${bookingId}/${status}`, { method: 'PATCH' });
      const json = await res.json();
      if (!json.error) {
        // Cập nhật lại danh sách booking
        if (selectedAmenity) handleViewBookings(selectedAmenity);
      } else {
        alert(json.message);
      }
    } catch (err) { alert('Lỗi'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Tiện ích</h1>
          <p className="text-slate-500">Thiết lập các tiện ích nội khu</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700">
          <Plus className="w-5 h-5" /> Thêm tiện ích
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {amenities.map(a => (
          <div key={a._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative flex flex-col">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => toggleStatus(a._id, a.status)}
                className={`p-2 rounded-full ${a.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                title={a.status === 'active' ? 'Đang hoạt động' : 'Tạm đóng'}
              >
                <Power className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-bold text-lg text-indigo-700 mb-2 pr-10">{a.name}</h3>
            <p className="text-sm text-slate-500 mb-4 flex-1">{a.description}</p>
            <div className="flex justify-between text-sm font-medium bg-slate-50 p-2 rounded mb-3">
              <span className="text-slate-600">{a.openTime} - {a.closeTime}</span>
              <span className="text-indigo-600">Sức chứa: {a.capacity}</span>
            </div>
            <button 
              onClick={() => handleViewBookings(a)}
              className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition"
            >
              Xem danh sách đặt chỗ
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Thêm tiện ích mới</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div><label className="text-sm font-bold text-slate-600 mb-1 block">Tên tiện ích</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border p-2 rounded focus:border-indigo-500" /></div>
              <div><label className="text-sm font-bold text-slate-600 mb-1 block">Mô tả</label><textarea required value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border p-2 rounded focus:border-indigo-500" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-slate-600 mb-1 block">Giờ mở cửa</label><input type="time" required value={form.openTime} onChange={e=>setForm({...form, openTime: e.target.value})} className="w-full border p-2 rounded focus:border-indigo-500" /></div>
                <div><label className="text-sm font-bold text-slate-600 mb-1 block">Giờ đóng cửa</label><input type="time" required value={form.closeTime} onChange={e=>setForm({...form, closeTime: e.target.value})} className="w-full border p-2 rounded focus:border-indigo-500" /></div>
              </div>
              <div><label className="text-sm font-bold text-slate-600 mb-1 block">Sức chứa tối đa</label><input type="number" required value={form.capacity} onChange={e=>setForm({...form, capacity: parseInt(e.target.value)})} className="w-full border p-2 rounded focus:border-indigo-500" /></div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2 bg-slate-100 rounded font-bold text-slate-600 hover:bg-slate-200">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">Lưu tiện ích</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBookingsModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Danh sách đặt chỗ - {selectedAmenity?.name}</h2>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {bookings.length === 0 ? (
                <div className="text-center text-slate-500 py-8">Chưa có ai đặt chỗ tiện ích này.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {bookings.map(b => (
                    <div key={b._id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-center bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-800">{b.residentId?.name || 'Cư dân không tồn tại'}</p>
                        <p className="text-sm text-slate-500">{b.residentId?.phoneNumber}</p>
                        <p className="text-sm mt-1">
                          Trạng thái: {' '}
                          {b.status === 'pending' && <span className="text-orange-500 font-bold">Chờ duyệt</span>}
                          {b.status === 'approved' && <span className="text-green-500 font-bold">Đã duyệt</span>}
                          {b.status === 'rejected' && <span className="text-red-500 font-bold">Từ chối</span>}
                          {b.status === 'cancelled' && <span className="text-gray-500 font-bold">Đã hủy</span>}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="font-bold text-indigo-700">{new Date(b.date).toLocaleDateString('vi-VN')}</p>
                          <p className="text-sm font-medium bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded mt-1 inline-block">
                            {b.startTime} - {b.endTime}
                          </p>
                        </div>
                        {b.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateBookingStatus(b._id, 'approve')} className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded hover:bg-green-200">Duyệt</button>
                            <button onClick={() => handleUpdateBookingStatus(b._id, 'reject')} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded hover:bg-red-200">Từ chối</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button onClick={() => setShowBookingsModal(false)} className="px-6 py-2 bg-slate-100 rounded-lg font-bold text-slate-600 hover:bg-slate-200">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
