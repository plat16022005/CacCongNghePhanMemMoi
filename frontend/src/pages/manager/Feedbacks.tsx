import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function ManagerFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<{id: string, text: string} | null>(null);

  useEffect(() => { fetchFeedbacks(); }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/manager/feedbacks');
      const json = await res.json();
      if (!json.error) setFeedbacks(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleRespond = async (e: any) => {
    e.preventDefault();
    if(!response) return;
    try {
      const res = await fetch(`/api/manager/feedbacks/${response.id}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: response.text, status: 'resolved' })
      });
      const json = await res.json();
      if (!json.error) {
        setResponse(null);
        fetchFeedbacks();
      } else alert(json.message);
    } catch (err) { alert('Lỗi'); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Góp ý & Phản ánh</h1>
        <p className="text-slate-500">Phản hồi ý kiến từ cư dân</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.map((f) => (
          <div key={f._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800 text-lg">{f.title}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded ${f.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {f.status === 'resolved' ? 'Đã giải quyết' : 'Chờ xử lý'}
              </span>
            </div>
            <p className="text-sm text-indigo-600 font-medium mb-1">Cư dân: {f.residentId?.name}</p>
            <p className="text-slate-600 bg-slate-50 p-3 rounded mb-4 flex-1">{f.content}</p>
            
            {f.status === 'resolved' && f.response && (
              <div className="bg-green-50 p-3 rounded text-sm text-green-800 mb-2 border border-green-100">
                <strong>BQL trả lời:</strong> {f.response}
              </div>
            )}

            {f.status !== 'resolved' && (
              <div className="mt-auto">
                {response?.id === f._id ? (
                  <form onSubmit={handleRespond} className="flex gap-2">
                    <input autoFocus required value={response.text} onChange={e=>setResponse({...response, text: e.target.value})} className="flex-1 border p-2 text-sm rounded" placeholder="Nhập câu trả lời..." />
                    <button type="submit" className="bg-indigo-600 text-white px-3 rounded flex items-center justify-center hover:bg-indigo-700"><Send className="w-4 h-4"/></button>
                  </form>
                ) : (
                  <button onClick={() => setResponse({id: f._id, text: ''})} className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded hover:bg-indigo-100 w-full">Trình bày phản hồi</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
