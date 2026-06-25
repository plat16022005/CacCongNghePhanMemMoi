import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, User, CheckCircle2, ListPlus } from 'lucide-react';

export default function MaintenanceTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [progressNote, setProgressNote] = useState('');
  const [progressStatus, setProgressStatus] = useState('in_progress');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNote, setCompletionNote] = useState('');
  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    fetchTask();
    fetchHistory();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await fetch(`/api/maintenance/tasks/${id}`);
      const json = await res.json();
      setTask(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/maintenance/tasks/${id}/history`);
      const json = await res.json();
      setHistory(json.history || []);
    } catch (err) { console.error(err); }
  };

  const handleAccept = async () => {
    try {
      await fetch(`/api/maintenance/tasks/${id}/accept`, { method: 'PATCH' });
      fetchTask(); fetchHistory();
    } catch (err) { alert('Lỗi'); }
  };

  const handleProgress = async (e: any) => {
    e.preventDefault();
    try {
      await fetch(`/api/maintenance/tasks/${id}/progress`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: progressStatus, note: progressNote })
      });
      setProgressNote('');
      fetchTask(); fetchHistory();
    } catch (err) { alert('Lỗi'); }
  };

  const handleComplete = async (e: any) => {
    e.preventDefault();
    try {
      await fetch(`/api/maintenance/tasks/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completionNote, materialsUsed: materials })
      });
      setShowCompleteModal(false);
      fetchTask(); fetchHistory();
    } catch (err) { alert('Lỗi'); }
  };

  const addMaterial = () => setMaterials([...materials, { name: '', quantity: 1, cost: 0 }]);

  if (loading || !task) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-2">
        <ArrowLeft className="w-5 h-5" /> Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className={`p-4 text-white font-bold flex justify-between items-center ${task.urgency === 'emergency' ? 'bg-red-500' : 'bg-slate-800'}`}>
          <span>{task.title}</span>
          <span className="px-2 py-1 bg-white/20 rounded text-xs uppercase">{task.status}</span>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <MapPin className="w-5 h-5 text-indigo-500" />
            Phòng <span className="font-bold text-slate-800">{task.apartmentCode}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <User className="w-5 h-5 text-emerald-500" />
            {task.residentId?.name} ({task.residentId?.phone})
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
            {task.description}
          </div>

          {task.status === 'pending' && (
            <button onClick={handleAccept} className="w-full py-4 mt-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-500/30">
              NHẬN VIỆC NÀY
            </button>
          )}

          {(task.status === 'assigned' || task.status === 'in_progress' || task.status === 'waiting_parts') && (
            <div className="mt-4 border-t pt-6">
              <h3 className="font-bold text-slate-800 mb-4">Cập nhật tiến độ</h3>
              <form onSubmit={handleProgress} className="flex flex-col gap-4">
                <select value={progressStatus} onChange={e=>setProgressStatus(e.target.value)} className="w-full border p-3 rounded-xl bg-slate-50 font-medium">
                  <option value="in_progress">Đang xử lý tại hiện trường</option>
                  <option value="waiting_parts">Đang chờ vật tư / linh kiện</option>
                </select>
                <textarea required value={progressNote} onChange={e=>setProgressNote(e.target.value)} placeholder="Ghi chú tình hình..." className="w-full border p-3 rounded-xl bg-slate-50" rows={3}></textarea>
                <button type="submit" className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold">Lưu tiến độ</button>
              </form>

              <button onClick={() => setShowCompleteModal(true)} className="w-full py-4 mt-4 bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> ĐÁNH DẤU HOÀN THÀNH
              </button>
            </div>
          )}

          {task.status === 'completed' && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Công việc đã hoàn thành</h3>
              <p className="text-emerald-700 text-sm mb-2">{task.completionNote}</p>
              {task.materialsUsed && task.materialsUsed.length > 0 && (
                <div className="mt-3 pt-3 border-t border-emerald-200/50">
                  <p className="text-xs font-bold text-emerald-800 uppercase mb-2">Vật tư đã dùng:</p>
                  {task.materialsUsed.map((m: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm text-emerald-700 mb-1">
                      <span>{m.name} (x{m.quantity})</span>
                      <span className="font-bold">{m.cost.toLocaleString()} đ</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="pl-2">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock className="w-5 h-5"/> Lịch sử cập nhật</h3>
        <div className="flex flex-col gap-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {history.map((h, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                {h.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500"/> : <Clock className="w-4 h-4"/>}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-800 text-sm">{h.updatedBy}</div>
                  <time className="font-mono text-xs text-slate-500">{new Date(h.at).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</time>
                </div>
                <div className="text-slate-600 text-sm">{h.note}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-2">{h.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-end md:items-center justify-center p-4 pb-0 md:pb-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10">
            <h2 className="text-xl font-bold mb-4 text-emerald-600">Hoàn thành công việc</h2>
            <form onSubmit={handleComplete} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-slate-600 block mb-2">Báo cáo kết quả</label>
                <textarea required value={completionNote} onChange={e=>setCompletionNote(e.target.value)} rows={3} className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-emerald-500"></textarea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-600 block">Vật tư sử dụng (nếu có)</label>
                  <button type="button" onClick={addMaterial} className="text-emerald-600 text-sm font-bold flex items-center gap-1"><ListPlus className="w-4 h-4"/> Thêm</button>
                </div>
                
                <div className="flex flex-col gap-3">
                  {materials.map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <input placeholder="Tên vật tư" required value={m.name} onChange={e=>{const n = [...materials]; n[idx].name = e.target.value; setMaterials(n);}} className="flex-1 p-2 rounded text-sm border focus:border-emerald-500"/>
                      <input type="number" placeholder="SL" required value={m.quantity} onChange={e=>{const n = [...materials]; n[idx].quantity = Number(e.target.value); setMaterials(n);}} className="w-16 p-2 rounded text-sm border focus:border-emerald-500"/>
                      <input type="number" placeholder="Đơn giá" required value={m.cost} onChange={e=>{const n = [...materials]; n[idx].cost = Number(e.target.value); setMaterials(n);}} className="w-24 p-2 rounded text-sm border focus:border-emerald-500"/>
                      <button type="button" onClick={()=>{const n = [...materials]; n.splice(idx, 1); setMaterials(n);}} className="text-red-500 font-bold px-2">X</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={()=>setShowCompleteModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold">Xác nhận xong</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
