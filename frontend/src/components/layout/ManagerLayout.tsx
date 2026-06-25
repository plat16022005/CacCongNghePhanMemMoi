import { Outlet } from 'react-router-dom';
import ManagerSidebar from './ManagerSidebar';
import Topbar from './Topbar';

export default function ManagerLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <ManagerSidebar />
      <div className="flex-1 md:ml-[240px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-4 md:p-8 w-full max-w-[1440px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
