import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'service', rating: 5 });

  useEffect(() => { fetchFeedbacks(); }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/resident/feedbacks');
      const json = await res.json();
      if (!json.error) setFeedbacks(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/resident/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!json.error) {
        alert('Gửi góp ý thành công! Xin cảm ơn.');
        setShowModal(false);
        setForm({ title: '', content: '', category: 'service', rating: 5 });
        fetchFeedbacks();
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
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Góp ý & Đánh giá</h1>
          <p className="text-[var(--color-text-secondary)]">Giúp chúng tôi nâng cao chất lượng dịch vụ</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-[var(--radius-md)] font-bold flex items-center gap-2 hover:bg-[var(--color-primary-light)] transition"
        >
          <Plus className="w-5 h-5" /> Viết góp ý
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbacks.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-lg border text-gray-500">Bạn chưa gửi góp ý nào</div>
        ) : (
          feedbacks.map((f) => (
            <div key={f._id} className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-lg">{f.title}</h3>
                <span className="text-xs text-gray-400 font-mono">{new Date(f.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < f.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-4">{f.content}</p>
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded capitalize">{f.category}</span>
                {f.status === 'pending' && <span className="text-xs font-bold text-orange-500">Đang chờ xử lý</span>}
                {f.status === 'reviewed' && <span className="text-xs font-bold text-green-500">Đã ghi nhận</span>}
                {f.status === 'resolved' && <span className="text-xs font-bold text-blue-500">Đã giải quyết</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[var(--radius-lg)] p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Viết góp ý / Đánh giá</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div><label className="text-sm font-bold text-gray-600">Tiêu đề</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full border p-2 rounded" /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-600">Phân loại</label>
                  <select value={form.category} onChange={e=>setForm({...form, category: e.target.value})} className="w-full border p-2 rounded">
                    <option value="service">Dịch vụ</option>
                    <option value="security">An ninh</option>
                    <option value="cleanliness">Vệ sinh</option>
                    <option value="staff">Nhân viên</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600">Đánh giá sao</label>
                  <select value={form.rating} onChange={e=>setForm({...form, rating: parseInt(e.target.value)})} className="w-full border p-2 rounded">
                    <option value={5}>5 Sao - Rất tốt</option>
                    <option value={4}>4 Sao - Tốt</option>
                    <option value={3}>3 Sao - Tạm được</option>
                    <option value={2}>2 Sao - Kém</option>
                    <option value={1}>1 Sao - Rất kém</option>
                  </select>
                </div>
              </div>

              <div><label className="text-sm font-bold text-gray-600">Nội dung chi tiết</label><textarea required rows={4} value={form.content} onChange={e=>setForm({...form, content: e.target.value})} className="w-full border p-2 rounded" /></div>
              
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 py-2 border rounded font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded font-bold hover:bg-[var(--color-primary-light)]">Gửi góp ý</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
