import { ArrowDownLeft, ArrowUpRight, Hash, Scale } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../utils/formatCurrency';
import { cn } from '../../../utils/cn';
import type { FinanceSummary } from '../types/analytics.types';

interface FinanceSummaryCardsProps {
  summary: FinanceSummary;
  currency?: string;
}

const items = [
  { key: 'income', label: 'Tổng thu tháng này', icon: ArrowUpRight, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { key: 'expense', label: 'Tổng chi tháng này', icon: ArrowDownLeft, color: 'text-red-500', bg: 'bg-red-50' },
  { key: 'net', label: 'Chênh lệch', icon: Scale, color: 'text-tertiary', bg: 'bg-tertiary/10' },
  { key: 'count', label: 'Số giao dịch', icon: Hash, color: 'text-secondary', bg: 'bg-secondary/10' },
] as const;

export function FinanceSummaryCards({ summary, currency = 'VND' }: FinanceSummaryCardsProps) {
  const values: Record<(typeof items)[number]['key'], string> = {
    income: formatCurrency(summary.totalIncome, currency),
    expense: formatCurrency(summary.totalExpense, currency),
    net: formatCurrency(summary.netBalance, currency),
    count: String(summary.transactionCount),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(({ key, label, icon: Icon, color, bg }) => (
        <Card key={key} className="!p-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-sm flex items-center justify-center', bg)}>
              <Icon size={18} className={color} />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-label uppercase tracking-widest text-primary/40 truncate">
                {label}
              </p>
              <p
                className={cn(
                  'font-display text-lg font-bold truncate',
                  key === 'net' && summary.netBalance < 0 && 'text-red-500',
                  key === 'net' && summary.netBalance >= 0 && 'text-primary',
                  key !== 'net' && 'text-primary',
                )}
              >
                {values[key]}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
