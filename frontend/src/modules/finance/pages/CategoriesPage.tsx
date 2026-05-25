import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getApiErrorMessage } from '../../../api/client';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { CategoryList } from '../components/CategoryList';
import { CategoryForm } from '../components/CategoryForm';
import { ErrorState, LoadingState } from '../components/FinanceState';
import { useToast } from '../components/Toast';
import type { CreateCategoryPayload, FinanceCategory } from '../types/finance.types';

export function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FinanceCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FinanceCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await getCategories());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (payload: CreateCategoryPayload) => {
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, payload);
        showToast('Cập nhật danh mục thành công');
      } else {
        await createCategory(payload);
        showToast('Thêm danh mục thành công');
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      showToast('Xóa danh mục thành công');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Không thể xóa danh mục đang được sử dụng'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const income = categories.filter((c) => c.type === 'INCOME');
  const expense = categories.filter((c) => c.type === 'EXPENSE');

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus size={16} />
          Thêm danh mục
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoryList
          title="Danh mục thu nhập"
          categories={income}
          onEdit={(c) => { setEditing(c); setFormOpen(true); }}
          onDelete={setDeleteTarget}
        />
        <CategoryList
          title="Danh mục chi tiêu"
          categories={expense}
          onEdit={(c) => { setEditing(c); setFormOpen(true); }}
          onDelete={setDeleteTarget}
        />
      </div>

      <CategoryForm
        open={formOpen}
        initial={editing}
        loading={saving}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa danh mục"
        message="Bạn có chắc muốn xóa danh mục này không?"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
