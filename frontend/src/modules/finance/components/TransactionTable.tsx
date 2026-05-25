import { Eye, Image, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { formatSignedAmount } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { cn } from '../../../utils/cn';
import type { FinanceTransaction } from '../types/finance.types';

interface TransactionTableProps {
  transactions: FinanceTransaction[];
  onView: (tx: FinanceTransaction) => void;
  onEdit: (tx: FinanceTransaction) => void;
  onDelete: (tx: FinanceTransaction) => void;
}

export function TransactionTable({
  transactions,
  onView,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left font-body text-sm">
        <thead>
          <tr className="border-b border-primary/10 text-primary/50 font-mono text-label uppercase">
            <th className="py-3 pr-4">Tên</th>
            <th className="py-3 pr-4">Danh mục</th>
            <th className="py-3 pr-4">Ngày</th>
            <th className="py-3 pr-4">Loại</th>
            <th className="py-3 pr-4 text-right">Số tiền</th>
            <th className="py-3 pr-4">Ảnh</th>
            <th className="py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/5">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-primary/[0.02]">
              <td className="py-3 pr-4 font-medium text-primary">{tx.name}</td>
              <td className="py-3 pr-4 text-primary/60">{tx.categoryName}</td>
              <td className="py-3 pr-4 text-primary/60">{formatDate(tx.transactionDate)}</td>
              <td className="py-3 pr-4">
                <span
                  className={cn(
                    'inline-flex px-2 py-0.5 rounded-sm text-xs font-medium',
                    tx.type === 'INCOME'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-600',
                  )}
                >
                  {tx.type === 'INCOME' ? 'Thu' : 'Chi'}
                </span>
              </td>
              <td
                className={cn(
                  'py-3 pr-4 text-right font-mono font-medium',
                  tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500',
                )}
              >
                {formatSignedAmount(tx.amount, tx.type)}
              </td>
              <td className="py-3 pr-4">
                {(tx.attachments?.length ?? 0) > 0 ? (
                  <Image size={16} className="text-tertiary" />
                ) : (
                  <span className="text-primary/20">—</span>
                )}
              </td>
              <td className="py-3">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onView(tx)} aria-label="Xem">
                    <Eye size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(tx)} aria-label="Sửa">
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(tx)} aria-label="Xóa">
                    <Trash2 size={14} className="text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
