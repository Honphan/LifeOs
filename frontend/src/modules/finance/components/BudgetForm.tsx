import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type {
  CreateBudgetPayload,
  FinanceBudget,
  FinanceCategory,
} from '../types/finance.types';
import { getCurrentMonthYear } from '../utils/formatDate';

interface BudgetFormProps {
  open: boolean;
  categories: FinanceCategory[];
  initial?: FinanceBudget | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateBudgetPayload) => void;
}

export function BudgetForm({
  open,
  categories,
  initial,
  loading,
  onClose,
  onSubmit,
}: BudgetFormProps) {
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amountLimit, setAmountLimit] = useState('');
  const [month, setMonth] = useState(String(currentMonth));
  const [year, setYear] = useState(String(currentYear));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setCategoryId(String(initial.categoryId));
      setAmountLimit(String(initial.amountLimit));
      setMonth(String(initial.month));
      setYear(String(initial.year));
    } else {
      setName('');
      setCategoryId('');
      setAmountLimit('');
      setMonth(String(currentMonth));
      setYear(String(currentYear));
    }
    setErrors({});
  }, [open, initial, currentMonth, currentYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Tên ngân sách là bắt buộc';
    if (!categoryId) next.categoryId = 'Chọn danh mục';
    const limit = Number(amountLimit);
    if (!amountLimit || Number.isNaN(limit) || limit <= 0) next.amountLimit = 'Hạn mức phải lớn hơn 0';
    const m = Number(month);
    if (!month || m < 1 || m > 12) next.month = 'Tháng không hợp lệ';
    if (!year) next.year = 'Năm là bắt buộc';
    setErrors(next);
    if (Object.keys(next).length) return;

    onSubmit({
      name: name.trim(),
      categoryId: Number(categoryId),
      amountLimit: limit,
      month: m,
      year: Number(year),
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Sửa ngân sách' : 'Thêm ngân sách'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Tên ngân sách" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-label uppercase tracking-widest text-secondary">Danh mục chi</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-surface border-2 border-primary/10 font-body"
          >
            <option value="">Chọn danh mục</option>
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <span className="font-mono text-label text-red-500">{errors.categoryId}</span>}
        </div>

        <Input
          label="Hạn mức"
          type="number"
          min={1}
          value={amountLimit}
          onChange={(e) => setAmountLimit(e.target.value)}
          error={errors.amountLimit}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Tháng" type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} error={errors.month} />
          <Input label="Năm" type="number" value={year} onChange={(e) => setYear(e.target.value)} error={errors.year} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Hủy</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button>
        </div>
      </form>
    </Modal>
  );
}
