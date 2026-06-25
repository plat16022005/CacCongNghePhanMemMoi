import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, AlertTriangle } from 'lucide-react';

export default function MaintenanceTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchTasks(); }, [filter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/maintenance/tasks' : `/api/maintenance/tasks?status=${filter}`;
      const res = await fetch(url);
      const json = await res.json();
      setTasks(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const getUrgencyColor = (u: string) => {
    switch(u) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusText = (s: string) => {
    switch(s) {
      case 'pending': return 'Chờ xử lý';
      case 'assigned': return 'Mới giao';
      case 'in_progress': return 'Đang sửa';
      case 'waiting_parts': return 'Chờ linh kiện';
      case 'completed': return 'Đã xong';
      default: return s;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-slate-800">Danh sách công việc</h1>
      
      {/* Scrollable Filters for Mobile */}
      <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
        {['all', 'pending', 'assigned', 'in_progress', 'completed'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === f ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'}`}
          >
            {f === 'all' ? 'Tất cả' : getStatusText(f)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {loading ? <div className="p-4 text-center">Đang tải...</div> : tasks.map(t => (
          <NavLink key={t.id} to={`/maintenance/tasks/${t.id}`} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 active:bg-slate-50 transition flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex gap-2 items-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getUrgencyColor(t.urgency)} flex items-center gap-1`}>
                  {t.urgency === 'emergency' && <AlertTriangle className="w-3 h-3"/>}
                  {t.urgency}
                </span>
                <span className="text-xs font-bold text-slate-400">{getStatusText(t.status)}</span>
              </div>
              <span className="text-xs text-slate-400">{new Date(t.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{t.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{t.description}</p>
            </div>

            <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-xs">
                  {t.apartmentCode}
                </div>
                <span className="text-sm font-medium text-slate-600">{t.residentName}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
