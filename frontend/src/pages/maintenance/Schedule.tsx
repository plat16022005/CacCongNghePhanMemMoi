import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock, MapPin, RefreshCw } from 'lucide-react';

export default function MaintenanceSchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [month, setMonth] = useState('2024-06');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSchedules(); }, [month]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maintenance/schedule?month=${month}`);
      const json = await res.json();
      setSchedules(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDone = async (id: string) => {
    if(!window.confirm('Xác nhận đã bảo trì xong hạng mục này?')) return;
    try {
      await fetch(`/api/maintenance/schedule/${id}/done`, { method: 'PATCH' });
      fetchSchedules();
    } catch (err) { alert('Lỗi'); }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">Lịch bảo trì định kỳ</h1>
          <p className="text-slate-500">Thực hiện kiểm tra hệ thống định kỳ</p>
        </div>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)} className="border p-2 rounded-lg font-bold text-slate-700 shadow-sm" />
      </div>

      <div className="flex flex-col gap-4">
        {loading ? <div className="p-4">Đang tải...</div> : schedules.length === 0 ? <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">Không có lịch bảo trì nào trong tháng này.</div> : schedules.map(s => (
          <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
            
            {/* Date Box */}
            <div className={`p-6 flex flex-col items-center justify-center shrink-0 w-32 border-r border-slate-100 ${s.status === 'done' ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-700'}`}>
              <span className="text-sm font-bold uppercase mb-1">{new Date(s.scheduledDate).toLocaleString('vi-VN', {weekday: 'short'})}</span>
              <span className="text-4xl font-bold leading-none">{new Date(s.scheduledDate).getDate()}</span>
              <span className="text-sm font-bold mt-1">{s.scheduledTime}</span>
            </div>

            {/* Info */}
            <div className="p-6 flex-1 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className={`text-xl font-bold ${s.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{s.title}</h3>
                {s.status === 'done' ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3"/> Đã xong
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">Chưa làm</span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 mt-2">
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4"/> Hệ thống: {s.category}</div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4"/> Ước tính: {s.estimatedDuration} phút</div>
                <div className="flex items-center gap-1"><RefreshCw className="w-4 h-4"/> Lặp lại: {s.recurrence}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 md:border-l border-slate-100 flex items-center justify-center bg-slate-50 md:bg-transparent">
              {s.status === 'scheduled' ? (
                <button onClick={() => handleDone(s.id)} className="w-full md:w-auto px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5"/> Check-in Hoàn thành
                </button>
              ) : (
                <div className="text-center text-sm font-bold text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-1"/>
                  Đã hoàn tất
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
