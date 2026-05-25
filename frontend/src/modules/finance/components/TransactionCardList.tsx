import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { formatSignedAmount } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { cn } from '../../../utils/cn';
import type { FinanceTransaction } from '../types/finance.types';

interface TransactionCardListProps {
  transactions: FinanceTransaction[];
  onView: (tx: FinanceTransaction) => void;
  onEdit: (tx: FinanceTransaction) => void;
  onDelete: (tx: FinanceTransaction) => void;
}

export function TransactionCardList({
  transactions,
  onView,
  onEdit,
  onDelete,
}: TransactionCardListProps) {
  return (
    <div className="md:hidden flex flex-col gap-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="bg-surface rounded-lg p-4 shadow-card border border-primary/5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-body font-semibold text-primary">{tx.name}</p>
              <p className="text-sm text-primary/50 font-body">
                {tx.categoryName} • {formatDate(tx.transactionDate)}
              </p>
            </div>
            <span
              className={cn(
                'font-mono text-sm font-semibold flex-shrink-0',
                tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500',
              )}
            >
              {formatSignedAmount(tx.amount, tx.type)}
            </span>
          </div>
          <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-primary/5">
            <Button variant="ghost" size="sm" onClick={() => onView(tx)}>
              <Eye size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(tx)}>
              <Pencil size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(tx)}>
              <Trash2 size={14} className="text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
