import { NavLink } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  Activity
} from 'lucide-react';

export default function AdminSidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Quản lý Tài khoản', path: '/admin/users', icon: Users },
    { name: 'Tòa nhà / Block', path: '/admin/buildings', icon: Building2 },
    { name: 'Cấu hình hệ thống', path: '/admin/config', icon: Settings },
    { name: 'Nhật ký hoạt động', path: '/admin/logs', icon: Activity },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 z-20 text-slate-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Admin System</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                  : 'hover:bg-slate-800 hover:text-white font-medium'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
