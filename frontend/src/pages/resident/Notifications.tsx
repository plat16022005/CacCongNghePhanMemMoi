import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, MailOpen, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/resident/notifications');
      const json = await res.json();
      if (!json.error) setNotifications(json.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleRead = async (id: string) => {
    try {
      await fetch(`/api/resident/notifications/${id}/read`, { method: 'PATCH' });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const handleReadAll = async () => {
    try {
      await fetch('/api/resident/notifications/read-all', { method: 'PATCH' });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="p-6">Đang tải...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Thông báo</h1>
          <p className="text-[var(--color-text-secondary)]">Cập nhật tin tức từ Ban quản lý</p>
        </div>
        <button 
          onClick={handleReadAll}
          className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-primary-light)]/10 px-4 py-2 rounded-lg transition"
        >
          <Check className="w-4 h-4" /> Đánh dấu đọc tất cả
        </button>
      </div>

      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] flex flex-col">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Bạn không có thông báo nào</div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n._id} 
              onClick={() => { if (!n.isRead) handleRead(n._id); }}
              className={`p-5 border-b border-[var(--color-border)] flex gap-4 cursor-pointer transition hover:bg-gray-50 ${!n.isRead ? 'bg-blue-50/50' : ''}`}
            >
              <div className={`mt-1 shrink-0 ${!n.isRead ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                {!n.isRead ? <Mail className="w-6 h-6" /> : <MailOpen className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-gray-800 ${!n.isRead ? 'text-[var(--color-primary)]' : ''}`}>{n.title}</h3>
                  <span className="text-xs text-gray-400 font-mono shrink-0 whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <p className={`text-sm ${!n.isRead ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>{n.content}</p>
                <div className="mt-2">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded tracking-wider">{n.type}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
