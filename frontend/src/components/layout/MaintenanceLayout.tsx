import { Outlet } from 'react-router-dom';
import MaintenanceSidebar from './MaintenanceSidebar';
import Topbar from './Topbar';

export default function MaintenanceLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans pb-16 md:pb-0">
      <MaintenanceSidebar />
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        <div className="hidden md:block">
          <Topbar />
        </div>
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 text-white p-4 sticky top-0 z-40 shadow-md flex justify-between items-center">
          <h1 className="font-bold text-lg">Kỹ Thuật Tòa Nhà</h1>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">KT</div>
        </div>
        
        <main className="flex-1 p-4 md:p-8 w-full max-w-[1440px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
