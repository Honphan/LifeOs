import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Wallet,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';

/* ── Navigation items ── */
const navItems = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',   icon: CheckSquare,     label: 'Tasks' },
  { to: '/finance', icon: Wallet,          label: 'Finance' },
  { to: '/notes',   icon: FileText,        label: 'Notes' },
] as const;

/* ── Component ── */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-4 top-4 bottom-4 z-40',
        'bg-surface rounded-lg shadow-float',
        'flex flex-col',
        'transition-all duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-[240px]',
      )}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-primary/5">
        <div className="w-8 h-8 rounded-sm bg-tertiary flex items-center justify-center flex-shrink-0">
          <span className="text-on-primary font-display text-sm font-bold">L</span>
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-bold text-primary tracking-tight">
            LifeOS
          </span>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm',
                'text-body font-body font-medium',
                'transition-base group',
                isActive
                  ? 'bg-tertiary/10 text-tertiary'
                  : 'text-primary/60 hover:text-primary hover:bg-primary/5',
              )
            }
          >
            <Icon
              size={20}
              strokeWidth={1.8}
              className="flex-shrink-0"
            />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className={cn(
          'flex items-center justify-center',
          'mx-3 mb-4 py-2 rounded-sm',
          'text-primary/40 hover:text-primary hover:bg-primary/5',
          'transition-base cursor-pointer',
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
}
