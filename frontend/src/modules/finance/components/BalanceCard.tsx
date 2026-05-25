import { Pencil, Wallet } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../utils/formatCurrency';
import { cn } from '../../../utils/cn';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  onEdit: () => void;
}

export function BalanceCard({ balance, currency = 'VND', onEdit }: BalanceCardProps) {
  const isNegative = balance < 0;

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-sm bg-tertiary/10 flex items-center justify-center">
              <Wallet size={16} className="text-tertiary" />
            </div>
            <span className="font-mono text-label uppercase tracking-widest text-primary/50">
              Số tiền hiện có
            </span>
          </div>
          <p
            className={cn(
              'font-display text-2xl font-bold',
              isNegative ? 'text-red-500' : 'text-primary',
            )}
          >
            {formatCurrency(balance, currency)}
          </p>
          {isNegative && (
            <p className="text-sm text-red-500 font-body mt-1">Số dư đang âm</p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil size={14} />
          Chỉnh sửa
        </Button>
      </div>
    </Card>
  );
}
