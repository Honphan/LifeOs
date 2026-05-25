import type { ReactNode } from 'react';
import { AlertCircle, Inbox, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export function LoadingState({ message = 'Đang tải dữ liệu...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-primary/50">
      <Loader2 size={28} className="animate-spin text-tertiary" />
      <p className="font-body text-body">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-sm bg-primary/5 flex items-center justify-center">
        <Inbox size={22} className="text-primary/30" />
      </div>
      <p className="font-display font-semibold text-primary">{title}</p>
      {description && <p className="font-body text-body text-primary/50 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({
  message = 'Không thể tải dữ liệu tài chính. Vui lòng thử lại.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-sm bg-red-50 flex items-center justify-center">
        <AlertCircle size={22} className="text-red-500" />
      </div>
      <p className="font-body text-body text-primary/70 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
