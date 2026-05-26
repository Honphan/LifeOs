import { useEffect, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from './FinanceState';
import type {
  CreateTransactionPayload,
  FinanceCategory,
  FinanceTransaction,
  TransactionType,
} from '../types/finance.types';
import { toInputDate } from '../utils/formatDate';

interface TransactionFormProps {
  open: boolean;
  categories: FinanceCategory[];
  initial?: FinanceTransaction | null;
  loading?: boolean;
  onCreateCategory?: () => void;
  onClose: () => void;
  onSubmit: (payload: CreateTransactionPayload, pendingFiles: File[]) => void;
}

interface FormState {
  name: string;
  amount: string;
  type: TransactionType;
  categoryId: string;
  transactionDate: string;
  note: string;
}

interface FormErrors {
  name?: string;
  amount?: string;
  categoryId?: string;
  transactionDate?: string;
}

export function TransactionForm({
  open,
  categories,
  initial,
  loading,
  onCreateCategory,
  onClose,
  onSubmit,
}: TransactionFormProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    amount: '',
    type: 'EXPENSE',
    categoryId: '',
    transactionDate: toInputDate(new Date()),
    note: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        name: initial.name,
        amount: String(initial.amount),
        type: initial.type,
        categoryId: String(initial.categoryId),
        transactionDate: toInputDate(initial.transactionDate),
        note: initial.note ?? '',
      });
    } else {
      setForm({
        name: '',
        amount: '',
        type: 'EXPENSE',
        categoryId: '',
        transactionDate: toInputDate(new Date()),
        note: '',
      });
    }
    setErrors({});
    setFiles([]);
    setPreviews([]);
  }, [open, initial]);

  const filteredCategories = categories.filter((c) => c.type === form.type);
  const canCreateCategory = Boolean(onCreateCategory);

  const validate = () => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'Tên giao dịch là bắt buộc';
    const amount = Number(form.amount);
    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      next.amount = 'Số tiền phải lớn hơn 0';
    }
    if (!form.categoryId) next.categoryId = 'Vui lòng chọn danh mục';
    if (!form.transactionDate) next.transactionDate = 'Ngày giao dịch là bắt buộc';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const images = selected.filter((f) => f.type.startsWith('image/'));
    setFiles(images);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews(images.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(
      {
        name: form.name.trim(),
        amount: Number(form.amount),
        type: form.type,
        categoryId: Number(form.categoryId),
        transactionDate: form.transactionDate,
        note: form.note.trim() || undefined,
      },
      files,
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Sửa giao dịch' : 'Thêm giao dịch'}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <Input
          label="Tên giao dịch"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
        />
        <Input
          label="Số tiền"
          type="number"
          min={1}
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          error={errors.amount}
        />

        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-label uppercase tracking-widest text-secondary">Loại</span>
          <div className="flex gap-2">
            {(['INCOME', 'EXPENSE'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type, categoryId: '' }))}
                className={`flex-1 py-2 rounded-md text-sm font-body font-medium border-2 transition-base cursor-pointer ${
                  form.type === type
                    ? type === 'INCOME'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-red-400 bg-red-50 text-red-600'
                    : 'border-primary/10 text-primary/50 hover:border-primary/20'
                }`}
              >
                {type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-label uppercase tracking-widest text-secondary">Danh mục</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="w-full px-4 py-3 rounded-md bg-surface text-primary font-body border-2 border-primary/10 focus:border-secondary focus:outline-none"
          >
            <option value="">Chọn danh mục</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span className="font-mono text-label text-red-500">{errors.categoryId}</span>
          )}
          {!filteredCategories.length && (
            <div className="pt-2">
              <EmptyState
                title={
                  categories.length
                    ? `Chưa có danh mục ${form.type === 'INCOME' ? 'thu nhập' : 'chi tiêu'}`
                    : 'Bạn chưa có danh mục nào'
                }
                description={
                  categories.length
                    ? 'Hãy tạo danh mục phù hợp trước khi thêm giao dịch.'
                    : 'Tạo danh mục đầu tiên để mở khóa luồng thêm giao dịch.'
                }
                action={
                  canCreateCategory ? (
                    <Button className="mt-2" variant="secondary" onClick={onCreateCategory}>
                      Thêm danh mục
                    </Button>
                  ) : undefined
                }
              />
            </div>
          )}
        </div>

        <Input
          label="Ngày giao dịch"
          type="date"
          value={form.transactionDate}
          onChange={(e) => setForm((f) => ({ ...f, transactionDate: e.target.value }))}
          error={errors.transactionDate}
        />

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-label uppercase tracking-widest text-secondary">Ghi chú</label>
          <textarea
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            rows={2}
            className="w-full px-4 py-3 rounded-md bg-surface text-primary font-body border-2 border-primary/10 focus:border-secondary focus:outline-none resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-label uppercase tracking-widest text-secondary">Ảnh hóa đơn</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="text-sm font-body text-primary/60"
          />
          <p className="text-xs font-body text-primary/45">
            Ảnh sẽ được tải lên cloud sau khi bạn lưu giao dịch.
          </p>
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {previews.map((src) => (
                <img key={src} src={src} alt="" className="w-16 h-16 object-cover rounded-sm border border-primary/10" />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-surface">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : initial ? 'Cập nhật' : 'Thêm'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
