import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function ManagerGuests() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => { fetchGuests(); }, [filter]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/manager/guests' : `/api/manager/guests?status=${filter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!json.error) setGuests(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/manager/guests/${id}/${action}`, { method: 'PATCH' });
      const json = await res.json();
      if (!json.error) fetchGuests();
      else alert(json.message || 'Lỗi thực hiện thao tác');
    } catch (err) { alert('Lỗi'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Duyệt khách đến thăm</h1>
          <p className="text-slate-500">Quản lý các yêu cầu khách thăm từ cư dân</p>
        </div>
        <div className="flex gap-2 bg-white border border-slate-200 rounded-lg p-1">
          {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition ${filter === f ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {f === 'pending' ? 'Chờ duyệt' : f === 'approved' ? 'Đã duyệt' : f === 'rejected' ? 'Từ chối' : 'Tất cả'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Khách / SĐT</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">CCCD</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Cư dân bảo lãnh</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Ngày thăm</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Trạng thái</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">Không có dữ liệu</td></tr>
            ) : guests.map((g) => (
              <tr key={g._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{g.guestName}</div>
                  <div className="text-xs text-slate-500 font-mono">{g.phone}</div>
                </td>
                <td className="p-4 font-mono text-xs text-slate-600">{g.cccd || '---'}</td>
                <td className="p-4 font-medium text-indigo-600">{g.residentId?.name || '---'}</td>
                <td className="p-4 text-sm">{new Date(g.visitDate).toLocaleDateString('vi-VN')} {g.visitTime}</td>
                <td className="p-4 text-center">
                  {g.status === 'pending' && <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded"><Clock className="w-3 h-3"/>Chờ duyệt</span>}
                  {g.status === 'approved' && <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded"><CheckCircle2 className="w-3 h-3"/>Đã duyệt</span>}
                  {g.status === 'rejected' && <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded"><XCircle className="w-3 h-3"/>Từ chối</span>}
                </td>
                <td className="p-4 text-right">
                  {g.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(g._id, 'approve')} className="mr-2 px-3 py-1.5 bg-green-100 text-green-700 font-bold rounded hover:bg-green-200 text-sm"><CheckCircle2 className="w-4 h-4 inline mr-1"/>Duyệt</button>
                      <button onClick={() => handleAction(g._id, 'reject')} className="px-3 py-1.5 bg-red-100 text-red-700 font-bold rounded hover:bg-red-200 text-sm"><XCircle className="w-4 h-4 inline mr-1"/>Từ chối</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
