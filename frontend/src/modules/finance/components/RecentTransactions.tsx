import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { formatSignedAmount } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { cn } from '../../../utils/cn';
import type { FinanceTransaction } from '../types/finance.types';
import { EmptyState } from './FinanceState';

interface RecentTransactionsProps {
  transactions: FinanceTransaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between !mb-3">
        <h3 className="font-display font-bold text-primary">Giao dịch gần đây</h3>
        <Link
          to="/finance/transactions"
          className="flex items-center gap-1 text-sm text-secondary hover:text-tertiary transition-base font-body"
        >
          Xem tất cả <ArrowRight size={14} />
        </Link>
      </CardHeader>

      {!transactions.length ? (
        <EmptyState
          title="Bạn chưa có giao dịch nào"
          description="Thêm giao dịch đầu tiên để xem số liệu và biểu đồ bắt đầu có ý nghĩa."
          action={
            <Link
              to="/finance/transactions"
              className="mt-2 inline-flex items-center gap-1 rounded-md bg-tertiary px-4 py-2 text-sm font-body font-medium text-white transition-base hover:opacity-90"
            >
              Thêm giao dịch
              <ArrowRight size={14} />
            </Link>
          }
        />
      ) : (
        <div className="divide-y divide-primary/5">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-4">
              <div className="min-w-0">
                <p className="font-body font-medium text-primary truncate">{tx.name}</p>
                <p className="text-sm text-primary/40 font-body truncate">
                  {tx.categoryName} • {formatDate(tx.transactionDate)}
                </p>
              </div>
              <span
                className={cn(
                  'font-mono text-sm font-medium flex-shrink-0',
                  tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500',
                )}
              >
                {formatSignedAmount(tx.amount, tx.type)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
