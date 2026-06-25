import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  AlertOctagon, 
  Settings, 
  BarChart3 
} from 'lucide-react';

export default function AccountantSidebar() {
  const navItems = [
    { name: 'Tổng quan tài chính', path: '/accountant', icon: LayoutDashboard },
    { name: 'Quản lý Hóa đơn', path: '/accountant/invoices', icon: FileText },
    { name: 'Xác nhận Thanh toán', path: '/accountant/payments', icon: CreditCard },
    { name: 'Theo dõi Công nợ', path: '/accountant/debts', icon: AlertOctagon },
    { name: 'Cấu hình Biểu phí', path: '/accountant/service-fees', icon: Settings },
    { name: 'Báo cáo Tài chính', path: '/accountant/reports', icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-screen bg-emerald-900 border-r border-emerald-800 fixed left-0 top-0 z-20 text-emerald-100">
      <div className="h-16 flex items-center px-6 border-b border-emerald-800 bg-emerald-950">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
          A
        </div>
        <span className="text-lg font-bold text-white tracking-tight">Kế Toán Tòa Nhà</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/accountant'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/50'
                  : 'hover:bg-emerald-800 hover:text-white font-medium'
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
