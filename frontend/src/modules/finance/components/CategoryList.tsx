import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';
import type { FinanceCategory } from '../types/finance.types';
import { EmptyState } from './FinanceState';

interface CategoryListProps {
  title: string;
  categories: FinanceCategory[];
  onEdit: (category: FinanceCategory) => void;
  onDelete: (category: FinanceCategory) => void;
}

export function CategoryList({ title, categories, onEdit, onDelete }: CategoryListProps) {
  return (
    <div>
      <h3 className="font-display font-bold text-primary mb-3">{title}</h3>
      {!categories.length ? (
        <EmptyState title="Chưa có danh mục" />
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-3 p-3 rounded-md bg-surface border border-primary/5 shadow-card"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color ?? '#06B6D4' }}
                />
                <div className="min-w-0">
                  <p className="font-body font-medium text-primary truncate">{cat.name}</p>
                  {cat.isDefault && (
                    <span className="text-xs text-primary/40 font-body">Mặc định</span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => onEdit(cat)} disabled={cat.isDefault}>
                  <Pencil size={14} className={cn(cat.isDefault && 'opacity-30')} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(cat)} disabled={cat.isDefault}>
                  <Trash2 size={14} className={cn('text-red-500', cat.isDefault && 'opacity-30')} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
