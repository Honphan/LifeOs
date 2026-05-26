import { useEffect } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { formatSignedAmount } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { cn } from '../../../utils/cn';
import type { FinanceTransaction } from '../types/finance.types';

interface TransactionDetailDrawerProps {
  open: boolean;
  transaction: FinanceTransaction | null;
  onClose: () => void;
  onEdit: (tx: FinanceTransaction) => void;
  onDelete: (tx: FinanceTransaction) => void;
}

export function TransactionDetailDrawer({
  open,
  transaction,
  onClose,
  onEdit,
  onDelete,
}: TransactionDetailDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !transaction) return null;

  const resolveAttachmentUrl = (attachment: NonNullable<FinanceTransaction['attachments']>[number]) =>
    attachment.imageUrl ?? '';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" className="absolute inset-0 bg-primary/30" onClick={onClose} aria-label="Đóng" />
      <aside className="relative w-full max-w-md bg-surface h-full shadow-float flex flex-col animate-in">
        <div className="flex items-center justify-between p-5 border-b border-primary/5">
          <h2 className="font-display text-lg font-bold text-primary">Chi tiết giao dịch</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-sm text-primary/40 hover:text-primary hover:bg-primary/5 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <DetailRow label="Tên" value={transaction.name} />
          <DetailRow
            label="Số tiền"
            value={formatSignedAmount(transaction.amount, transaction.type)}
            valueClassName={transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500'}
          />
          <DetailRow label="Loại" value={transaction.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'} />
          <DetailRow label="Danh mục" value={transaction.categoryName} />
          <DetailRow label="Ngày" value={formatDate(transaction.transactionDate)} />
          {transaction.note && <DetailRow label="Ghi chú" value={transaction.note} />}
          <DetailRow label="Ngày tạo" value={formatDate(transaction.createdAt)} />
          <DetailRow label="Cập nhật" value={formatDate(transaction.updatedAt)} />

          {(transaction.attachments?.length ?? 0) > 0 && (
            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="font-mono text-label uppercase tracking-widest text-secondary">Ảnh hóa đơn</p>
                <span className="inline-flex items-center rounded-full bg-tertiary/10 px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest text-tertiary">
                  Cloud
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {transaction.attachments!.map((att) => (
                  <a
                    key={att.id}
                    href={resolveAttachmentUrl(att)}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-lg border border-primary/10 overflow-hidden bg-primary/[0.02] hover:border-secondary/30 transition-base"
                  >
                    <img
                      src={resolveAttachmentUrl(att)}
                      alt={att.fileName}
                      className="h-32 w-full object-cover group-hover:scale-[1.02] transition-transform"
                    />
                    <div className="p-2">
                      <p className="text-xs font-body text-primary/70 truncate">{att.fileName}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-primary/5 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => onEdit(transaction)}>
            <Pencil size={14} />
            Sửa
          </Button>
          <Button
            className="flex-1 bg-red-500 text-on-primary hover:brightness-110"
            onClick={() => onDelete(transaction)}
          >
            <Trash2 size={14} />
            Xóa
          </Button>
        </div>
      </aside>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="font-mono text-label uppercase tracking-widest text-secondary mb-0.5">{label}</p>
      <p className={cn('font-body text-primary', valueClassName)}>{value}</p>
    </div>
  );
}
