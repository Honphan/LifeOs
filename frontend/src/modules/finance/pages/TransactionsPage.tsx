import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getApiErrorMessage } from '../../../api/client';
import { getCategories } from '../api/categoryApi';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, uploadTransactionAttachment } from '../api/transactionApi';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { TransactionFilterBar } from '../components/TransactionFilterBar';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionCardList } from '../components/TransactionCardList';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionDetailDrawer } from '../components/TransactionDetailDrawer';
import { CategoryForm } from '../components/CategoryForm';
import { EmptyState, ErrorState, LoadingState } from '../components/FinanceState';
import { useToast } from '../components/Toast';
import type {
  CreateCategoryPayload,
  CreateTransactionPayload,
  FinanceCategory,
  FinanceTransaction,
  TransactionFilterParams,
} from '../types/finance.types';
import { createCategory } from '../api/categoryApi';

export function TransactionsPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [filters, setFilters] = useState<TransactionFilterParams>({
    page: 0,
    size: 20,
    sort: 'transactionDate,desc',
  });
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editing, setEditing] = useState<FinanceTransaction | null>(null);
  const [categorySaving, setCategorySaving] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<FinanceTransaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FinanceTransaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      /* categories optional for empty state */
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions(filters);
      setTransactions(result.content);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSubmit = async (payload: CreateTransactionPayload, files: File[]) => {
    setSaving(true);
    try {
      const transaction = editing
        ? await updateTransaction(editing.id, payload)
        : await createTransaction(payload);

      if (files.length > 0) {
        for (const file of files) {
          await uploadTransactionAttachment(transaction.id, file);
        }
      }

      showToast(editing ? 'Cập nhật giao dịch thành công' : 'Thêm giao dịch thành công');
      setFormOpen(false);
      setEditing(null);
      await loadTransactions();
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
      await loadCategories();
      await loadTransactions();
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
      await deleteTransaction(deleteTarget.id);
      showToast('Xóa giao dịch thành công');
      setDeleteTarget(null);
      setDetail(null);
      await loadTransactions();
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body text-primary/50 font-body">Quản lý giao dịch thu/chi</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setCategoryFormOpen(true)}>
            <Plus size={16} />
            Thêm danh mục
          </Button>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus size={16} />
            Thêm giao dịch
          </Button>
        </div>
      </div>

      <TransactionFilterBar filters={filters} categories={categories} onChange={setFilters} />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={loadTransactions} />
      ) : !transactions.length ? (
        <EmptyState
          title="Bạn chưa có giao dịch nào"
          description={
            categories.length
              ? 'Hãy thêm giao dịch đầu tiên để bắt đầu theo dõi tài chính.'
              : 'Bạn cần tạo danh mục trước, rồi mới thêm giao dịch.'
          }
          action={
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={() => setCategoryFormOpen(true)}>
                <Plus size={16} />
                Thêm danh mục
              </Button>
              <Button onClick={() => setFormOpen(true)}>
                <Plus size={16} />
                Thêm giao dịch
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <TransactionTable
            transactions={transactions}
            onView={setDetail}
            onEdit={(tx) => { setEditing(tx); setFormOpen(true); }}
            onDelete={setDeleteTarget}
          />
          <TransactionCardList
            transactions={transactions}
            onView={setDetail}
            onEdit={(tx) => { setEditing(tx); setFormOpen(true); }}
            onDelete={setDeleteTarget}
          />
        </>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={(filters.page ?? 0) <= 0}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 0) - 1 }))}
          >
            Trước
          </Button>
          <span className="text-sm text-primary/50 font-body self-center">
            Trang {(filters.page ?? 0) + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={(filters.page ?? 0) >= totalPages - 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 0) + 1 }))}
          >
            Sau
          </Button>
        </div>
      )}

      <TransactionForm
        open={formOpen}
        categories={categories}
        initial={editing}
        loading={saving}
        onCreateCategory={() => setCategoryFormOpen(true)}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />

      <CategoryForm
        open={categoryFormOpen}
        loading={categorySaving}
        onClose={() => setCategoryFormOpen(false)}
        onSubmit={handleCategorySubmit}
      />

      <TransactionDetailDrawer
        open={Boolean(detail)}
        transaction={detail}
        onClose={() => setDetail(null)}
        onEdit={(tx) => { setDetail(null); setEditing(tx); setFormOpen(true); }}
        onDelete={(tx) => setDeleteTarget(tx)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Xóa giao dịch"
        message="Bạn có chắc muốn xóa giao dịch này không? Thao tác này sẽ cập nhật lại số dư của bạn."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
