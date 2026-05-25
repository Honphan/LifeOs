import { Search } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import type { FinanceCategory, TransactionFilterParams, TransactionType } from '../types/finance.types';

interface TransactionFilterBarProps {
  filters: TransactionFilterParams;
  categories: FinanceCategory[];
  onChange: (filters: TransactionFilterParams) => void;
}

export function TransactionFilterBar({ filters, categories, onChange }: TransactionFilterBarProps) {
  const update = (patch: Partial<TransactionFilterParams>) => {
    onChange({ ...filters, ...patch, page: 0 });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
      <div className="relative xl:col-span-2">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30" />
        <input
          type="search"
          placeholder="Tìm theo tên giao dịch..."
          value={filters.keyword ?? ''}
          onChange={(e) => update({ keyword: e.target.value || undefined })}
          className="w-full pl-9 pr-4 py-3 rounded-md bg-surface text-primary font-body border-2 border-primary/10 focus:border-secondary focus:outline-none"
        />
      </div>

      <select
        value={filters.type ?? ''}
        onChange={(e) =>
          update({ type: (e.target.value as TransactionType) || undefined })
        }
        className="px-4 py-3 rounded-md bg-surface text-primary font-body border-2 border-primary/10 focus:border-secondary focus:outline-none"
      >
        <option value="">Tất cả loại</option>
        <option value="INCOME">Thu nhập</option>
        <option value="EXPENSE">Chi tiêu</option>
      </select>

      <select
        value={filters.categoryId ?? ''}
        onChange={(e) =>
          update({ categoryId: e.target.value ? Number(e.target.value) : undefined })
        }
        className="px-4 py-3 rounded-md bg-surface text-primary font-body border-2 border-primary/10 focus:border-secondary focus:outline-none"
      >
        <option value="">Tất cả danh mục</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <Input
        label="Từ ngày"
        type="date"
        value={filters.from ?? ''}
        onChange={(e) => update({ from: e.target.value || undefined })}
      />
      <Input
        label="Đến ngày"
        type="date"
        value={filters.to ?? ''}
        onChange={(e) => update({ to: e.target.value || undefined })}
      />
      <Input
        label="Số tiền tối thiểu"
        type="number"
        min={0}
        value={filters.minAmount ?? ''}
        onChange={(e) =>
          update({ minAmount: e.target.value ? Number(e.target.value) : undefined })
        }
      />
      <Input
        label="Số tiền tối đa"
        type="number"
        min={0}
        value={filters.maxAmount ?? ''}
        onChange={(e) =>
          update({ maxAmount: e.target.value ? Number(e.target.value) : undefined })
        }
      />

      <select
        value={
          filters.hasAttachment === undefined
            ? ''
            : filters.hasAttachment
              ? 'yes'
              : 'no'
        }
        onChange={(e) => {
          const v = e.target.value;
          update({
            hasAttachment: v === '' ? undefined : v === 'yes',
          });
        }}
        className="px-4 py-3 rounded-md bg-surface text-primary font-body border-2 border-primary/10 focus:border-secondary focus:outline-none"
      >
        <option value="">Ảnh: tất cả</option>
        <option value="yes">Có ảnh</option>
        <option value="no">Không ảnh</option>
      </select>

      <select
        value={filters.sort ?? 'transactionDate,desc'}
        onChange={(e) => update({ sort: e.target.value })}
        className="px-4 py-3 rounded-md bg-surface text-primary font-body border-2 border-primary/10 focus:border-secondary focus:outline-none"
      >
        <option value="transactionDate,desc">Mới nhất</option>
        <option value="transactionDate,asc">Cũ nhất</option>
        <option value="amount,desc">Số tiền giảm</option>
        <option value="amount,asc">Số tiền tăng</option>
      </select>
    </div>
  );
}
