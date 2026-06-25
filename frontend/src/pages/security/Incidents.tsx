import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';

export default function Incidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '', severity: 'medium' });

  useEffect(() => { fetchIncidents(); }, []);

  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/security/incidents');
      const json = await res.json();
      if (!json.error) setIncidents(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/security/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert(form.severity === 'critical' ? 'Đã tạo sự cố và GỬI BÁO ĐỘNG đến BQL!' : 'Tạo sự cố thành công!');
        setShowModal(false);
        setForm({ title: '', description: '', location: '', severity: 'medium' });
        fetchIncidents();
      } else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  const handleClose = async (id: string) => {
    if(!window.confirm('Đánh dấu sự cố này đã được giải quyết?')) return;
    try {
      await fetch(`/api/security/incidents/${id}/close`, { method: 'PATCH' });
      fetchIncidents();
    } catch (err) { alert('Lỗi'); }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sự cố An ninh</h1>
          <p className="text-lg text-slate-500 mt-1">Ghi nhận và báo cáo khẩn cấp</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-3 hover:bg-red-600 shadow-lg shadow-red-500/30">
          <AlertTriangle className="w-7 h-7" /> Báo cáo sự cố mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? <div className="p-6 text-xl text-slate-500">Đang tải...</div> : incidents.map(inc => (
          <div key={inc._id} className={`bg-white p-6 rounded-3xl shadow-sm border-2 relative ${inc.status === 'open' ? 'border-red-200' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-slate-800 pr-20">{inc.title}</h3>
              <div className={`px-3 py-1 rounded-lg text-sm font-bold uppercase ${inc.severity === 'critical' ? 'bg-red-600 text-white animate-pulse' : inc.severity === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {inc.severity}
              </div>
            </div>
            
            <p className="text-lg text-slate-600 bg-slate-50 p-4 rounded-xl mb-4 min-h-[80px]">{inc.description}</p>
            
            <div className="flex justify-between items-end">
              <div className="text-slate-500 font-medium">
                <p>📍 {inc.location}</p>
                <p className="text-sm mt-1">🕰️ {new Date(inc.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              
              {inc.status === 'open' ? (
                <button onClick={() => handleClose(inc._id)} className="px-5 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition">Đóng sự cố</button>
              ) : (
                <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg uppercase text-sm">Đã xử lý</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-600 flex items-center gap-3"><AlertTriangle className="w-8 h-8"/> Báo cáo sự cố</h2>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"><X className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-lg">
              <div><label className="block font-bold text-slate-700 mb-2">Tiêu đề sự cố</label><input required autoFocus value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-red-500" placeholder="VD: Khách làm ồn tại sảnh..." /></div>
              
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block font-bold text-slate-700 mb-2">Vị trí</label><input required value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-red-500" placeholder="VD: Sảnh A" /></div>
                <div>
                  <label className="block font-bold text-slate-700 mb-2">Mức độ nghiêm trọng</label>
                  <select value={form.severity} onChange={e=>setForm({...form, severity: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-red-500 bg-white font-medium">
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                    <option value="critical">Rất nghiêm trọng (Gửi báo động BQL)</option>
                  </select>
                </div>
              </div>

              <div><label className="block font-bold text-slate-700 mb-2">Mô tả chi tiết</label><textarea required rows={4} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-red-500" /></div>
              
              <button type="submit" className={`w-full py-5 rounded-2xl text-xl font-bold text-white transition mt-2 shadow-lg ${form.severity === 'critical' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/40 animate-pulse' : 'bg-slate-800 hover:bg-slate-900'}`}>
                {form.severity === 'critical' ? 'GHI NHẬN VÀ GỬI BÁO ĐỘNG KHẨN CẤP' : 'Lưu báo cáo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
