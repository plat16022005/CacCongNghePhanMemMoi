import { NavLink } from 'react-router-dom';
import { 
  Wrench, 
  ClipboardList, 
  CalendarClock, 
  Home
} from 'lucide-react';

export default function MaintenanceSidebar() {
  const navItems = [
    { name: 'Tổng quan', path: '/maintenance', icon: Home },
    { name: 'Công việc', path: '/maintenance/tasks', icon: ClipboardList },
    { name: 'Lịch bảo trì', path: '/maintenance/schedule', icon: CalendarClock },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] h-screen bg-slate-900 border-r border-slate-800 fixed left-0 top-0 z-20 text-slate-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold mr-3">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Đội Kỹ Thuật</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/maintenance'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-4 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white font-bold'
                    : 'hover:bg-slate-800 hover:text-white font-medium'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-lg">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/maintenance'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full py-3 gap-1 ${isActive ? 'text-orange-500' : 'text-slate-500'}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-orange-100' : ''}`} />
                <span className="text-[11px] font-bold">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
