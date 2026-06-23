import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Home, 
  FileText, 
  Users, 
  Car, 
  Wrench, 
  MessageSquare, 
  Settings 
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Hồ sơ', path: '/dashboard/profile', icon: User },
    { name: 'Căn hộ của tôi', path: '/dashboard/apartment', icon: Home },
    { name: 'Hóa đơn', path: '/dashboard/invoices', icon: FileText },
    { name: 'Khách thăm', path: '/dashboard/guests', icon: Users },
    { name: 'Đăng ký xe', path: '/dashboard/parking', icon: Car },
    { name: 'Báo cáo sự cố', path: '/dashboard/maintenance', icon: Wrench },
    { name: 'Đánh giá', path: '/dashboard/feedbacks', icon: MessageSquare },
    { name: 'Cài đặt', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[240px] h-screen bg-white border-r border-[var(--color-border)] fixed left-0 top-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-[var(--color-border)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-info)] flex items-center justify-center text-white font-bold mr-3 shadow-sm">
          A
        </div>
        <span className="text-lg font-bold text-[var(--color-primary)] tracking-tight">ApartmentHub</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary-pale)] text-[var(--color-primary)] font-semibold border-l-4 border-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] font-medium border-l-4 border-transparent'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="bg-[var(--color-surface)] p-3 rounded-[var(--radius-md)]">
          <p className="text-xs font-semibold text-[var(--color-text-primary)]">Hỗ trợ kỹ thuật</p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Hotline: 1900 1234</p>
        </div>
      </div>
    </aside>
  );
}
