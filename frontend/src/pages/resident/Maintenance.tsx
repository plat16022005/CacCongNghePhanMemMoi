import { useState, useEffect } from 'react';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Maintenance() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'electrical', urgency: 'normal' });

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/resident/maintenance');
      const json = await res.json();
      if (!json.error) setRequests(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/resident/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Gửi yêu cầu thành công!');
        setShowModal(false);
        setForm({ title: '', description: '', category: 'electrical', urgency: 'normal' });
        fetchRequests();
      } else {
        alert(json.message);
      }
    } catch (err) { alert('Lỗi kết nối'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 relative">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Báo cáo sự cố</h1>
          <p className="text-[var(--color-text-secondary)]">Báo cáo bảo trì, sửa chữa trong căn hộ</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-[var(--radius-md)] font-bold flex items-center gap-2 hover:bg-[var(--color-primary-light)] transition"
        >
          <Plus className="w-5 h-5" /> Gửi báo cáo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-lg border text-gray-500">Chưa có báo cáo nào</div>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2">{r.title}</h3>
                {r.urgency === 'emergency' && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
              </div>
              
              <p className="text-sm text-gray-500 mb-4 line-clamp-3 min-h-[3rem]">{r.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded capitalize">{r.category}</span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded capitalize ${r.urgency === 'emergency' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{r.urgency}</span>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center">
                <span className="text-xs text-gray-400 font-mono">{new Date(r.createdAt).toLocaleDateString('vi-VN')}</span>
                
                {r.status === 'pending' && <span className="text-[var(--color-warning)] flex items-center gap-1 text-sm font-bold"><Clock className="w-4 h-4"/> Chờ xử lý</span>}
                {r.status === 'in_progress' && <span className="text-[var(--color-info)] flex items-center gap-1 text-sm font-bold"><Wrench className="w-4 h-4"/> Đang sửa</span>}
                {r.status === 'resolved' && <span className="text-[var(--color-success)] flex items-center gap-1 text-sm font-bold"><CheckCircle2 className="w-4 h-4"/> Đã xong</span>}
                {r.status === 'rejected' && <span className="text-[var(--color-error)] flex items-center gap-1 text-sm font-bold"><AlertCircle className="w-4 h-4"/> Từ chối</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[var(--radius-lg)] p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Báo cáo sự cố mới</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div><label className="text-sm font-bold text-gray-600">Tiêu đề</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" placeholder="VD: Ống nước rò rỉ" /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-600">Loại sự cố</label>
                  <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full border p-2 rounded">
                    <option value="electrical">Điện</option>
                    <option value="plumbing">Nước</option>
                    <option value="appliance">Thiết bị</option>
                    <option value="structural">Cơ sở hạ tầng</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600">Mức độ khẩn cấp</label>
                  <select value={form.urgency} onChange={e=>setForm({...form, urgency: e.target.value})} className="w-full border p-2 rounded">
                    <option value="low">Thấp</option>
                    <option value="normal">Bình thường</option>
                    <option value="high">Cao</option>
                    <option value="emergency">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div><label className="text-sm font-bold text-gray-600">Mô tả chi tiết</label><textarea required rows={3} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full border p-2 rounded" /></div>
              
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2 border rounded font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded font-bold hover:bg-[var(--color-primary-light)]">Gửi báo cáo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
