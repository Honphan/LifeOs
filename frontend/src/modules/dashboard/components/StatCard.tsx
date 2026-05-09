import type { ReactNode } from 'react';
import { Card } from '../../../components/ui/Card';
import { cn } from '../../../utils/cn';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
}

export function StatCard({ icon, label, value, change, positive }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-4 min-w-0">
      {/* Icon + Label */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
          {icon}
        </div>
        <span className="font-mono text-label text-secondary uppercase tracking-widest truncate">
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span className="font-display text-h1 text-primary leading-none">{value}</span>
        {change && (
          <span
            className={cn(
              'font-mono text-label mb-1',
              positive ? 'text-emerald-500' : 'text-red-400',
            )}
          >
            {positive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
    </Card>
  );
}
