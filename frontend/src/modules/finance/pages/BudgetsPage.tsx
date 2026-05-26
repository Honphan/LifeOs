import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getApiErrorMessage } from '../../../api/client';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../api/budgetApi';
import { getCategories, createCategory } from '../api/categoryApi';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { BudgetProgressCard } from '../components/BudgetProgressCard';
import { BudgetForm } from '../components/BudgetForm';
import { CategoryForm } from '../components/CategoryForm';
import { EmptyState, ErrorState, LoadingState } from '../components/FinanceState';
import { useToast } from '../components/Toast';
import type { CreateBudgetPayload, CreateCategoryPayload, FinanceBudget, FinanceCategory } from '../types/finance.types';
import { getCurrentMonthYear } from '../utils/formatDate';

export function BudgetsPage() {
  const { showToast } = useToast();
  const { month, year } = getCurrentMonthYear();
  const [budgets, setBudgets] = useState<FinanceBudget[]>([]);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editing, setEditing] = useState<FinanceBudget | null>(null);
  const [categorySaving, setCategorySaving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FinanceBudget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [budgetData, categoryData] = await Promise.all([
        getBudgets(month, year),
        getCategories('EXPENSE'),
      ]);
      setBudgets(budgetData);
      setCategories(categoryData);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (payload: CreateBudgetPayload) => {
    setSaving(true);
    try {
      if (editing) {
        await updateBudget(editing.id, payload);
        showToast('Cập nhật ngân sách thành công');
      } else {
        await createBudget(payload);
        showToast('Thêm ngân sách thành công');
      }
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCategorySubmit = async (payload: CreateCategoryPayload) => {
    setCategorySaving(true);
    try {
      await createCategory(payload);
      showToast('Thêm danh mục thành công');
      setCategoryFormOpen(false);
      await load();
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    } finally {
      setCategorySaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBudget(deleteTarget.id);
      showToast('Xóa ngân sách thành công');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body text-primary/50 font-body">
          Ngân sách tháng {month}/{year}
        </p>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus size={16} />
          Thêm ngân sách
        </Button>
      </div>

      {!categories.length ? (
        <EmptyState
          title="Chưa có danh mục chi tiêu"
          description="Tạo ít nhất một danh mục chi tiêu trước khi thiết lập ngân sách."
          action={
            <Button className="mt-2" onClick={() => setCategoryFormOpen(true)}>
              <Plus size={16} />
              Thêm danh mục
            </Button>
          }
        />
      ) : !budgets.length ? (
        <EmptyState
          title="Chưa có ngân sách"
          description="Tạo ngân sách để theo dõi chi tiêu theo danh mục."
          action={
            <Button className="mt-2" onClick={() => setFormOpen(true)}>
              <Plus size={16} />
              Thêm ngân sách
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b) => (
            <BudgetProgressCard
              key={b.id}
              budget={b}
              onEdit={(budget) => { setEditing(budget); setFormOpen(true); }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <BudgetForm
        open={formOpen}
        categories={categories}
        initial={editing}
        loading={saving}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />

      <CategoryForm
        open={categoryFormOpen}
        loading={categorySaving}
        onClose={() => setCategoryFormOpen(false)}
        onSubmit={handleCategorySubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa ngân sách"
        message="Bạn có chắc muốn xóa ngân sách này không?"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
