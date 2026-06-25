import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
