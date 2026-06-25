import { useState, useEffect } from 'react';
import { Search, Plus, UserX, UserCheck, Mail } from 'lucide-react';

export default function Residents() {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', apartmentId: '' });

  useEffect(() => {
    fetchResidents();
  }, [search]);

  const fetchResidents = async () => {
    try {
      const res = await fetch(`/api/manager/residents?search=${search}`);
      const json = await res.json();
      if (!json.error) setResidents(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/manager/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Tạo cư dân thành công! Mật khẩu đã gửi qua email.');
        setShowModal(false);
        fetchResidents();
      } else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  const toggleStatus = async (id: string) => {
    if(!window.confirm('Thay đổi trạng thái tài khoản này?')) return;
    try {
      await fetch(`/api/manager/residents/${id}/status`, { method: 'PATCH' });
      fetchResidents();
    } catch (err) { alert('Lỗi'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Cư dân</h1>
          <p className="text-slate-500">Danh sách cư dân và tài khoản</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700">
          <Plus className="w-5 h-5" /> Thêm cư dân
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, SĐT..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Họ và tên</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Liên hệ</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Trạng thái</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((r) => (
                <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{r.name}</td>
                  <td className="p-4">
                    <div className="flex flex-col text-sm text-slate-600">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {r.email}</span>
                      <span className="font-mono mt-1">{r.phoneNumber}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {r.status === 'active' 
                      ? <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Hoạt động</span>
                      : <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Đã khóa</span>
                    }
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => toggleStatus(r._id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition">
                      {r.status === 'active' ? <UserX className="w-5 h-5 text-red-500" /> : <UserCheck className="w-5 h-5 text-green-500" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Thêm cư dân mới</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div><label className="text-sm font-bold text-slate-600">Họ tên</label><input required value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} className="w-full border p-2 rounded" /></div>
              <div><label className="text-sm font-bold text-slate-600">Email (để nhận MK)</label><input type="email" required value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full border p-2 rounded" /></div>
              <div><label className="text-sm font-bold text-slate-600">Số điện thoại</label><input required value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full border p-2 rounded" /></div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2 border rounded font-bold text-slate-600 hover:bg-slate-50">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">Tạo tài khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
