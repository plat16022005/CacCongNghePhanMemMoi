import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <Sidebar />
      <div className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-4 md:p-8 w-full max-w-[1280px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
