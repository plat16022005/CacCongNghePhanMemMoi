import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  FileText, 
  UserPlus, 
  Megaphone, 
  MessageSquare, 
  Coffee,
  PieChart
} from 'lucide-react';

export default function ManagerSidebar() {
  const navItems = [
    { name: 'Tổng quan', path: '/manager', icon: LayoutDashboard },
    { name: 'Cư dân', path: '/manager/residents', icon: Users },
    { name: 'Căn hộ', path: '/manager/apartments', icon: Home },
    { name: 'Duyệt khách', path: '/manager/guests', icon: UserPlus },
    { name: 'Thông báo chung', path: '/manager/announcements', icon: Megaphone },
    { name: 'Phản ánh & Góp ý', path: '/manager/feedbacks', icon: MessageSquare },
    { name: 'Tiện ích', path: '/manager/amenities', icon: Coffee },
    { name: 'Báo cáo doanh thu', path: '/manager/reports', icon: PieChart },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[240px] h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 z-20 text-slate-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
          M
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Manager Portal</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/manager'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white font-medium'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
