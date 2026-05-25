import { AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../utils/formatCurrency';
import { cn } from '../../../utils/cn';
import type { FinanceBudget } from '../types/finance.types';

interface BudgetProgressCardProps {
  budget: FinanceBudget;
  onEdit: (budget: FinanceBudget) => void;
  onDelete: (budget: FinanceBudget) => void;
}

export function BudgetProgressCard({ budget, onEdit, onDelete }: BudgetProgressCardProps) {
  const pct = Math.min(budget.percentageUsed, 100);
  const isWarning = budget.percentageUsed >= 80 && budget.percentageUsed < 100;
  const isOver = budget.percentageUsed >= 100;

  return (
    <Card className="!p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-body font-semibold text-primary">{budget.name}</p>
          <p className="text-sm text-primary/50">{budget.categoryName}</p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(budget)}>Sửa</Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(budget)}>Xóa</Button>
        </div>
      </div>

      <div className="h-2 rounded-full bg-primary/5 overflow-hidden mb-2">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-tertiary',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-sm font-body text-primary/60 mb-2">
        <span>Đã chi: {formatCurrency(budget.spentAmount)}</span>
        <span>Hạn mức: {formatCurrency(budget.amountLimit)}</span>
      </div>

      <p className="text-sm font-mono text-primary/50">
        Còn lại: {formatCurrency(budget.remainingAmount)} ({budget.percentageUsed.toFixed(0)}%)
      </p>

      {(isWarning || isOver) && (
        <div
          className={cn(
            'flex items-center gap-2 mt-3 p-2 rounded-sm text-sm font-body',
            isOver ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700',
          )}
        >
          <AlertTriangle size={14} />
          {isOver ? 'Đã vượt ngân sách!' : 'Sắp vượt ngân sách (≥80%)'}
        </div>
      )}
    </Card>
  );
}
