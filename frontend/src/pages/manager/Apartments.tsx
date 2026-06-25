import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

export default function Apartments() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [residents, setResidents] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({ status: '', tenantId: '' });

  useEffect(() => {
    fetchApartments();
    fetchResidents();
  }, []);

  const fetchApartments = async () => {
    try {
      const res = await fetch('/api/manager/apartments');
      const json = await res.json();
      if (!json.error) setApartments(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchResidents = async () => {
    try {
      const res = await fetch('/api/manager/residents');
      const json = await res.json();
      if (!json.error) setResidents(json.data || []);
    } catch (err) { console.error(err); }
  };

  const handleAptClick = (apt: any) => {
    setSelectedApt(apt);
    setEditForm({
      status: apt.status || 'available',
      tenantId: apt.tenantId?._id || apt.tenantId || ''
    });
    setShowModal(true);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/manager/apartments/${selectedApt._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if(res.ok) {
        setShowModal(false);
        fetchApartments();
      } else {
        alert('Cập nhật thất bại');
      }
    } catch (err) { alert('Lỗi'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Căn hộ</h1>
        <p className="text-slate-500">Danh sách và trạng thái phòng</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {apartments.map((apt) => (
          <div 
            key={apt._id} 
            onClick={() => handleAptClick(apt)}
            className={`cursor-pointer rounded-xl border p-4 text-center transition hover:shadow-md ${
              apt.status === 'occupied' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${apt.status === 'occupied' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              <Home className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">{apt.roomNumber}</h3>
            <p className="text-xs font-bold mt-1 uppercase">
              {apt.status === 'occupied' ? <span className="text-indigo-600">Có người</span> : <span className="text-slate-400">Trống</span>}
            </p>
            {apt.tenantId?.name && <p className="text-[10px] text-slate-500 mt-1 truncate">{apt.tenantId.name}</p>}
          </div>
        ))}
      </div>

      {showModal && selectedApt && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Phòng {selectedApt.roomNumber}</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-slate-600 mb-1 block">Trạng thái</label>
                <select 
                  value={editForm.status} 
                  onChange={e => setEditForm({...editForm, status: e.target.value})}
                  className="w-full border p-2 rounded focus:border-indigo-500"
                >
                  <option value="available">Trống / Sẵn sàng</option>
                  <option value="occupied">Đã cho thuê (Occupied)</option>
                  <option value="maintenance">Đang bảo trì (Maintenance)</option>
                </select>
              </div>

              {editForm.status === 'occupied' && (
                <div>
                  <label className="text-sm font-bold text-slate-600 mb-1 block">Chủ hộ / Người thuê</label>
                  <select 
                    value={editForm.tenantId} 
                    onChange={e => setEditForm({...editForm, tenantId: e.target.value})}
                    className="w-full border p-2 rounded focus:border-indigo-500"
                  >
                    <option value="">-- Chọn cư dân --</option>
                    {residents.map(r => (
                      <option key={r._id} value={r._id}>{r.name} ({r.email})</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">Lưu ý: Chỉ chọn được user có role là 'resident'. Nếu chưa có, vui lòng vào tab Cư dân để tạo.</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded font-bold hover:bg-slate-200">Đóng</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
