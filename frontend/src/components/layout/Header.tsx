import { Bell, Search, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { getStoredAuthUser, logout } from '../../api/auth';
import { cn } from '../../utils/cn';

interface HeaderProps {
  sidebarCollapsed?: boolean;
}

export function Header({ sidebarCollapsed = false }: HeaderProps) {
  const authUser = getStoredAuthUser();
  const displayName = authUser?.name ?? authUser?.email ?? 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header
      className={cn(
        'sticky top-0 z-30',
        'h-16 px-6',
        'bg-neutral/80 backdrop-blur-md',
        'flex items-center justify-between gap-4',
        'border-b border-primary/5',
      )}
    >
      {/* ── Search ── */}
      <div className="flex items-center gap-2 bg-surface rounded-sm px-3 py-2 w-full max-w-md shadow-card">
        <Search size={16} className="text-primary/30 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent outline-none text-body font-body text-primary placeholder:text-primary/30 w-full"
        />
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-sm text-primary/50 hover:text-primary hover:bg-primary/5 transition-base cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />
          {/* Dot indicator */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-tertiary rounded-full" />
        </button>

        {/* Logout */}
        <Button variant="ghost" size="sm" onClick={() => logout()}>
          <LogOut size={16} />
        </Button>

        {/* Avatar */}
        {authUser?.picture ? (
          <img
            src={authUser.picture}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
            <span className="text-sm font-display font-bold text-secondary">{initial}</span>
          </div>
        )}
      </div>
    </header>
  );
}
