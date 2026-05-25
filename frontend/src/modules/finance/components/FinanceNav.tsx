import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  FolderOpen,
  LayoutDashboard,
  PiggyBank,
  Receipt,
} from 'lucide-react';
import { cn } from '../../../utils/cn';

const items = [
  { to: '/finance', icon: LayoutDashboard, label: 'Tổng quan', end: true },
  { to: '/finance/transactions', icon: Receipt, label: 'Giao dịch' },
  { to: '/finance/categories', icon: FolderOpen, label: 'Danh mục' },
  { to: '/finance/budgets', icon: PiggyBank, label: 'Ngân sách' },
  { to: '/finance/reports', icon: BarChart3, label: 'Báo cáo' },
] as const;

export function FinanceNav() {
  return (
    <nav className="flex flex-wrap gap-2 mb-6">
      {items.map(({ to, icon: Icon, label, ...rest }) => (
        <NavLink
          key={to}
          to={to}
          end={'end' in rest ? rest.end : false}
          className={({ isActive }) =>
            cn(
              'inline-flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-body font-medium transition-base',
              isActive
                ? 'bg-tertiary/10 text-tertiary'
                : 'text-primary/50 hover:text-primary hover:bg-primary/5',
            )
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
