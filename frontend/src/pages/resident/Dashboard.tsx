import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Bell, Wrench, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    unpaidInvoices: 0,
    unreadNotifications: 0,
    activeMaintenance: 0,
    upcomingBookings: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [invoicesRes, notifRes, maintRes, bookRes] = await Promise.all([
        fetch('/api/resident/invoices?status=unpaid'),
        fetch('/api/resident/notifications'),
        fetch('/api/resident/maintenance'),
        fetch('/api/resident/amenities/bookings')
      ]);

      const invoices = invoicesRes.ok ? await invoicesRes.json() : { total: 0 };
      const notifs = notifRes.ok ? await notifRes.json() : { unreadCount: 0 };
      const maint = maintRes.ok ? await maintRes.json() : { data: [] };
      const bookings = bookRes.ok ? await bookRes.json() : { data: [] };

      setSummary({
        unpaidInvoices: invoices.total || (invoices.data && invoices.data.length) || 0,
        unreadNotifications: notifs.unreadCount || 0,
        activeMaintenance: maint.data ? maint.data.filter((m: any) => m.status !== 'resolved').length : 0,
        upcomingBookings: bookings.data ? bookings.data.length : 0,
      });

    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-32 bg-white rounded-[var(--radius-xl)]"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-32 bg-white rounded-[var(--radius-xl)]"></div>
          <div className="h-32 bg-white rounded-[var(--radius-xl)]"></div>
          <div className="h-32 bg-white rounded-[var(--radius-xl)]"></div>
          <div className="h-32 bg-white rounded-[var(--radius-xl)]"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] font-['Plus_Jakarta_Sans'] tracking-tight">
          Tổng quan của bạn
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Cập nhật thông tin nhanh về căn hộ và các dịch vụ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Widget 
          title="Hóa đơn chưa thanh toán"
          value={summary.unpaidInvoices}
          icon={<CreditCard className="w-6 h-6 text-[var(--color-warning)]" />}
          colorClass="border-[var(--color-warning)] text-[var(--color-warning)]"
          bgClass="bg-[var(--color-warning-bg)]"
          link="/dashboard/invoices"
        />
        <Widget 
          title="Thông báo mới"
          value={summary.unreadNotifications}
          icon={<Bell className="w-6 h-6 text-[var(--color-info)]" />}
          colorClass="border-[var(--color-info)] text-[var(--color-info)]"
          bgClass="bg-[var(--color-info-bg)]"
          link="/dashboard/notifications"
        />
        <Widget 
          title="Yêu cầu bảo trì đang xử lý"
          value={summary.activeMaintenance}
          icon={<Wrench className="w-6 h-6 text-[var(--color-error)]" />}
          colorClass="border-[var(--color-error)] text-[var(--color-error)]"
          bgClass="bg-[var(--color-error-bg)]"
          link="/dashboard/maintenance"
        />
        <Widget 
          title="Lịch tiện ích sắp tới"
          value={summary.upcomingBookings}
          icon={<Calendar className="w-6 h-6 text-[var(--color-success)]" />}
          colorClass="border-[var(--color-success)] text-[var(--color-success)]"
          bgClass="bg-[var(--color-success-bg)]"
          link="/dashboard/amenities"
        />
      </div>

    </motion.div>
  );
}

function Widget({ title, value, icon, colorClass, bgClass, link }: any) {
  return (
    <Link to={link}>
      <motion.div 
        whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
        className={`bg-white border-l-4 ${colorClass} border-t border-r border-b border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)] flex flex-col justify-between h-full transition-all`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-[var(--radius-md)] ${bgClass}`}>
            {icon}
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
        </div>
        <div>
          <p className="text-3xl font-bold mb-1">{value}</p>
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{title}</p>
        </div>
      </motion.div>
    </Link>
  );
}
