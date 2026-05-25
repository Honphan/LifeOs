import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface BalanceSetupModalProps {
  open: boolean;
  initialBalance?: number;
  initialCurrency?: string;
  loading?: boolean;
  onSave: (balance: number, currency: string) => void;
  onClose?: () => void;
  forceOpen?: boolean;
}

export function BalanceSetupModal({
  open,
  initialBalance = 0,
  initialCurrency = 'VND',
  loading,
  onSave,
  onClose,
  forceOpen,
}: BalanceSetupModalProps) {
  const [balance, setBalance] = useState(String(initialBalance));
  const [currency, setCurrency] = useState(initialCurrency);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setBalance(String(initialBalance));
      setCurrency(initialCurrency);
      setError(undefined);
    }
  }, [open, initialBalance, initialCurrency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(balance);
    if (Number.isNaN(value)) {
      setError('Số tiền phải là số hợp lệ');
      return;
    }
    setError(undefined);
    onSave(value, currency);
  };

  return (
    <Modal
      open={open}
      onClose={forceOpen ? () => {} : onClose ?? (() => {})}
      title="Thiết lập số dư"
    >
      <p className="text-body text-primary/60 font-body mb-4">
        Nhập số tiền hiện có để bắt đầu theo dõi tài chính.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Số tiền hiện có"
          type="number"
          min={0}
          step={1000}
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          error={error}
        />
        <div className="flex flex-col gap-1.5 w-full">
          <label className="font-mono text-label uppercase tracking-widest text-secondary">
            Đơn vị tiền tệ
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-surface text-primary font-body text-body border-2 border-primary/10 focus:border-secondary focus:outline-none"
          >
            <option value="VND">VND — Việt Nam Đồng</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          {!forceOpen && onClose && (
            <Button type="button" variant="ghost" onClick={onClose}>
              Để sau
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
