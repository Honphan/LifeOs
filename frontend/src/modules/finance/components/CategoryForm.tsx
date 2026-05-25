import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type {
  CreateCategoryPayload,
  FinanceCategory,
  TransactionType,
} from '../types/finance.types';

interface CategoryFormProps {
  open: boolean;
  initial?: FinanceCategory | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCategoryPayload) => void;
}

export function CategoryForm({ open, initial, loading, onClose, onSubmit }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [color, setColor] = useState('#06B6D4');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setType(initial.type);
      setColor(initial.color ?? '#06B6D4');
      setIcon(initial.icon ?? '');
    } else {
      setName('');
      setType('EXPENSE');
      setColor('#06B6D4');
      setIcon('');
    }
    setError(undefined);
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tên danh mục là bắt buộc');
      return;
    }
    onSubmit({
      name: name.trim(),
      type,
      color: color || undefined,
      icon: icon.trim() || undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Sửa danh mục' : 'Thêm danh mục'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Tên danh mục" value={name} onChange={(e) => setName(e.target.value)} error={error} />

        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-label uppercase tracking-widest text-secondary">Loại</span>
          <div className="flex gap-2">
            {(['INCOME', 'EXPENSE'] as const).map((t) => (
              <button
                key={t}
                type="button"
                disabled={initial?.isDefault}
                onClick={() => setType(t)}
                className={`flex-1 py-2 rounded-md text-sm font-body font-medium border-2 transition-base cursor-pointer disabled:opacity-50 ${
                  type === t
                    ? 'border-tertiary bg-tertiary/10 text-tertiary'
                    : 'border-primary/10 text-primary/50'
                }`}
              >
                {t === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-label uppercase tracking-widest text-secondary">Màu</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-20 cursor-pointer" />
        </div>

        <Input label="Icon (tùy chọn)" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="vd: coffee" />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Thêm'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
