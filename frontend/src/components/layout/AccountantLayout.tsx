import { Outlet } from 'react-router-dom';
import AccountantSidebar from './AccountantSidebar';
import Topbar from './Topbar';

export default function AccountantLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AccountantSidebar />
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 w-full max-w-[1440px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
