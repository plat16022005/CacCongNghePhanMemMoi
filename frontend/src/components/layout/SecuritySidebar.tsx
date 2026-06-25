import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScanLine, 
  CarFront, 
  Users, 
  AlertTriangle 
} from 'lucide-react';

export default function SecuritySidebar() {
  const navItems = [
    { name: 'Ca trực hôm nay', path: '/security', icon: LayoutDashboard },
    { name: 'Quét QR / Vào cửa', path: '/security/checkin', icon: ScanLine },
    { name: 'Danh sách khách', path: '/security/guests', icon: Users },
    { name: 'Kiểm soát xe', path: '/security/vehicles', icon: CarFront },
    { name: 'Ghi nhận sự cố', path: '/security/incidents', icon: AlertTriangle },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[280px] h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 z-20 text-slate-300">
      <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold mr-4 shadow-sm">
          S
        </div>
        <div>
          <span className="text-xl font-bold text-white tracking-tight block">Security Hub</span>
          <span className="text-xs text-slate-400">Trạm gác chính</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/security'}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-xl text-base transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20'
                  : 'hover:bg-slate-800 hover:text-white font-medium'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
