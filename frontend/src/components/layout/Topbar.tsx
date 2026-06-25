import { Bell, Search, Menu, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Topbar() {
  const userData = (window as any).USER_DATA;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[var(--color-border)] flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] rounded-[var(--radius-sm)]">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-9 pr-4 py-1.5 bg-[var(--color-surface)] border-transparent focus:bg-white border focus:border-[var(--color-primary-light)] rounded-[var(--radius-full)] text-sm outline-none transition-all w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/dashboard/notifications" className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-error)] rounded-full border-2 border-white"></span>
        </Link>

        <div className="flex items-center gap-3 border-l border-[var(--color-border)] pl-4 md:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">
              {userData?.name || 'Cư dân'}
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              {userData?.email || 'user@example.com'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary-pale)] text-[var(--color-primary)] flex items-center justify-center font-bold border border-[var(--color-border)]">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          
          <button 
            onClick={handleLogout}
            className="ml-2 p-2 text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-[var(--radius-sm)] transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
