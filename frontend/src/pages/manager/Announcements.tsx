import { useState, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', targetRole: 'all' });

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/manager/announcements');
      const json = await res.json();
      if (!json.error) setAnnouncements(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/manager/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Gửi thông báo thành công!');
        setForm({ title: '', content: '', targetRole: 'all' });
        fetchAnnouncements();
      } else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Xóa thông báo này?')) return;
    try {
      await fetch(`/api/manager/announcements/${id}`, { method: 'DELETE' });
      fetchAnnouncements();
    } catch (err) { alert('Lỗi'); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Gửi Thông báo</h1>
        <p className="text-slate-500">Tạo thông báo đến tất cả cư dân</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="font-bold text-lg mb-4">Soạn thông báo</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div><label className="text-sm font-bold text-slate-600">Tiêu đề</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" /></div>
            <div><label className="text-sm font-bold text-slate-600">Nội dung</label><textarea required rows={5} value={form.content} onChange={e=>setForm({...form, content: e.target.value})} className="w-full border p-2 rounded" /></div>
            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"><Send className="w-4 h-4"/> Gửi đi</button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b font-bold bg-slate-50">Lịch sử thông báo</div>
          {loading ? <div className="p-4">Đang tải...</div> : (
            <div className="divide-y">
              {announcements.map((a) => (
                <div key={a._id} className="p-4 flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800">{a.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{a.content}</p>
                    <span className="text-xs text-slate-400 mt-2 block font-mono">{new Date(a.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <button onClick={() => handleDelete(a._id)} className="text-red-400 hover:text-red-600 self-start"><Trash2 className="w-5 h-5"/></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
