import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';

export default function GuestList() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('checked_in');

  useEffect(() => { fetchGuests(); }, [filter]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/security/guests/today?status=${filter}`);
      const json = await res.json();
      setGuests(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleCheckout = async (id: string) => {
    if(!window.confirm('Xác nhận khách này đã ra khỏi tòa nhà?')) return;
    try {
      await fetch(`/api/security/checkout/${id}`, { method: 'POST' });
      fetchGuests();
    } catch (err) { alert('Lỗi'); }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Khách trong tòa nhà</h1>
          <p className="text-lg text-slate-500 mt-1">Danh sách khách có mặt hôm nay</p>
        </div>
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          className="text-lg p-3 rounded-xl border border-slate-300 bg-slate-50 font-medium focus:outline-none focus:border-orange-500"
        >
          <option value="all">Tất cả hôm nay</option>
          <option value="checked_in">Đang ở trong tòa nhà</option>
          <option value="checked_out">Đã rời đi</option>
          <option value="pending">Chưa tới</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? <div className="p-8 text-xl text-center text-slate-500">Đang tải...</div> : (
          <table className="w-full text-left text-lg">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-5 font-bold text-slate-600">Khách & SĐT</th>
                <th className="p-5 font-bold text-slate-600">Phòng</th>
                <th className="p-5 font-bold text-slate-600">Thời gian</th>
                <th className="p-5 font-bold text-slate-600 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {guests.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-500 text-xl">Không có dữ liệu</td></tr> : guests.map(g => (
                <tr key={g._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-slate-800 text-xl">{g.guestName}</div>
                    <div className="text-slate-500 font-mono mt-1">{g.phone}</div>
                    {g.type === 'manual' && <span className="inline-block mt-1 px-2 py-0.5 bg-slate-200 text-slate-600 text-xs font-bold rounded">Thủ công</span>}
                  </td>
                  <td className="p-5">
                    <span className="font-bold text-indigo-600 text-xl">{g.apartmentNumber || 'Không rõ'}</span>
                  </td>
                  <td className="p-5 font-medium text-slate-600">
                    <div><span className="text-slate-400 text-sm">Vào: </span> {g.checkinTime ? new Date(g.checkinTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : '--:--'}</div>
                    <div><span className="text-slate-400 text-sm">Ra: </span> {g.checkoutTime ? new Date(g.checkoutTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : '--:--'}</div>
                  </td>
                  <td className="p-5 text-right">
                    {g.status === 'checked_in' ? (
                      <button 
                        onClick={() => handleCheckout(g._id)} 
                        className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition flex items-center gap-2 ml-auto"
                      >
                        <LogOut className="w-5 h-5" /> CHECK OUT
                      </button>
                    ) : (
                      <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider inline-block ${g.status === 'checked_out' ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-600'}`}>
                        {g.status === 'checked_out' ? 'Đã ra' : 'Chưa vào'}
                      </span>
                    )}
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
