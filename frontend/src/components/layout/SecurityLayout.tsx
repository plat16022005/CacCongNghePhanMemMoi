import { Outlet } from 'react-router-dom';
import SecuritySidebar from './SecuritySidebar';
import Topbar from './Topbar';

export default function SecurityLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-[16px]">
      <SecuritySidebar />
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 w-full max-w-[1280px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
