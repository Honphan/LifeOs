import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage, isEmptyApiError } from '../../../api/client';
import { getFinanceProfile, updateFinanceBalance } from '../api/financeProfileApi';
import { getFinanceSummary, getCategorySummary, getMonthlyTrend } from '../api/analyticsApi';
import { getTransactions } from '../api/transactionApi';
import { BalanceCard } from '../components/BalanceCard';
import { BalanceSetupModal } from '../components/BalanceSetupModal';
import { FinanceSummaryCards } from '../components/FinanceSummaryCards';
import { IncomeExpenseChart } from '../components/charts/IncomeExpenseChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { RecentTransactions } from '../components/RecentTransactions';
import { ErrorState, LoadingState } from '../components/FinanceState';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Wallet, ListChecks, ArrowRight } from 'lucide-react';
import { useToast } from '../components/Toast';
import type { FinanceProfile } from '../types/finance.types';
import type { CategorySummary, FinanceSummary, MonthlyTrend } from '../types/analytics.types';
import type { FinanceTransaction } from '../types/finance.types';
import { getCurrentMonthYear } from '../utils/formatDate';

export function FinanceDashboardPage() {
  const { showToast } = useToast();
  const { month, year } = getCurrentMonthYear();

  const [profile, setProfile] = useState<FinanceProfile | null>(null);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySummary[]>([]);
  const [trendData, setTrendData] = useState<MonthlyTrend[]>([]);
  const [recent, setRecent] = useState<FinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [savingBalance, setSavingBalance] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const isEmptyWorkspace =
    (summary?.transactionCount ?? 0) === 0 &&
    recent.length === 0 &&
    categoryData.length === 0 &&
    trendData.length === 0;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileResult, summaryResult, txResult, categoryResult, trendResult] = await Promise.allSettled([
        getFinanceProfile(),
        getFinanceSummary(month, year),
        getTransactions({ page: 0, size: 5, sort: 'transactionDate,desc' }),
        getCategorySummary(month, year, 'EXPENSE'),
        getMonthlyTrend(year),
      ]);

      const profileRes = profileResult.status === 'fulfilled' ? profileResult.value : null;
      const summaryRes = summaryResult.status === 'fulfilled' ? summaryResult.value : null;
      const txRes = txResult.status === 'fulfilled' ? txResult.value : null;

      if (profileResult.status === 'rejected' && !isEmptyApiError(profileResult.reason)) {
        throw profileResult.reason;
      }
      if (summaryResult.status === 'rejected' && !isEmptyApiError(summaryResult.reason)) {
        throw summaryResult.reason;
      }
      if (txResult.status === 'rejected' && !isEmptyApiError(txResult.reason)) {
        throw txResult.reason;
      }
      if (categoryResult.status === 'rejected' && !isEmptyApiError(categoryResult.reason)) {
        throw categoryResult.reason;
      }
      if (trendResult.status === 'rejected' && !isEmptyApiError(trendResult.reason)) {
        throw trendResult.reason;
      }

      setProfile(profileRes);
      setSummary(summaryRes);
      setCategoryData(categoryResult.status === 'fulfilled' ? categoryResult.value : []);
      setTrendData(trendResult.status === 'fulfilled' ? trendResult.value : []);
      setRecent(txRes?.content ?? []);
      const unsetBalance =
        profileRes?.currentBalance === undefined ||
        profileRes?.currentBalance === null;
      setNeedsSetup(Boolean(unsetBalance));
      setBalanceModalOpen(Boolean(unsetBalance));
    } catch (err) {
      if (isEmptyApiError(err)) {
        setProfile(null);
        setSummary(null);
        setCategoryData([]);
        setTrendData([]);
        setRecent([]);
        setNeedsSetup(true);
        setBalanceModalOpen(true);
        return;
      }

      setError(getApiErrorMessage(err, 'Không thể tải dữ liệu tài chính. Vui lòng thử lại.'));
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveBalance = async (balance: number) => {
    setSavingBalance(true);
    try {
      const updated = await updateFinanceBalance(balance);
      setProfile(updated);
      setNeedsSetup(false);
      setBalanceModalOpen(false);
      showToast('Cập nhật số dư thành công');
      await loadData();
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    } finally {
      setSavingBalance(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {isEmptyWorkspace && (
        <div className="relative overflow-hidden rounded-2xl border border-secondary/20 bg-gradient-to-br from-white via-surface to-secondary/10 p-6 md:p-8 shadow-card">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-tertiary/10 blur-2xl" />
          <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-secondary/10 blur-2xl" />

          <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.9fr] items-start">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-white/70 px-3 py-1 text-xs font-mono uppercase tracking-widest text-secondary">
                <Sparkles size={14} />
                Tài khoản mới
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">
                  Bắt đầu theo dõi tài chính thật gọn gàng
                </h2>
                <p className="font-body text-primary/60 max-w-2xl">
                  Bạn chưa có danh mục, giao dịch hay biểu đồ nào. Hãy tạo danh mục đầu tiên, nhập số dư ban đầu và thêm giao dịch đầu tiên để dashboard tự động sống lên.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/finance/categories"
                  className="inline-flex items-center gap-2 rounded-md bg-tertiary px-4 py-2 text-sm font-body font-medium text-white transition-base hover:opacity-90"
                >
                  <Plus size={16} />
                  Thêm danh mục
                </Link>
                <Link
                  to="/finance/transactions"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/10 bg-surface px-4 py-2 text-sm font-body font-medium text-primary transition-base hover:border-secondary/40"
                >
                  <Plus size={16} />
                  Thêm giao dịch
                </Link>
                <button
                  type="button"
                  onClick={() => setBalanceModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md border border-primary/10 bg-white px-4 py-2 text-sm font-body font-medium text-primary transition-base hover:border-secondary/40"
                >
                  <Wallet size={16} />
                  Nhập số dư ban đầu
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-xl border border-primary/10 bg-white/80 p-4">
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <ListChecks size={16} />
                  <span className="font-mono text-label uppercase tracking-widest">Bước 1</span>
                </div>
                <p className="font-body text-primary/70 text-sm">Tạo danh mục thu/chi phù hợp với thói quen chi tiêu của bạn.</p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-white/80 p-4">
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <Wallet size={16} />
                  <span className="font-mono text-label uppercase tracking-widest">Bước 2</span>
                </div>
                <p className="font-body text-primary/70 text-sm">Nhập số dư ban đầu để dashboard có điểm xuất phát chính xác.</p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-white/80 p-4">
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <ArrowRight size={16} />
                  <span className="font-mono text-label uppercase tracking-widest">Bước 3</span>
                </div>
                <p className="font-body text-primary/70 text-sm">Thêm giao dịch đầu tiên để biểu đồ và tổng quan tự động hiển thị.</p>
              </div>
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white/70 p-4 border border-primary/10">
              <p className="font-mono text-label uppercase tracking-widest text-primary/40">Tổng quan</p>
              <p className="mt-2 font-display text-lg font-bold text-primary">Chưa có dữ liệu</p>
            </div>
            <div className="rounded-xl bg-white/70 p-4 border border-primary/10">
              <p className="font-mono text-label uppercase tracking-widest text-primary/40">Danh mục</p>
              <p className="mt-2 font-display text-lg font-bold text-primary">Sẵn sàng tạo mới</p>
            </div>
            <div className="rounded-xl bg-white/70 p-4 border border-primary/10">
              <p className="font-mono text-label uppercase tracking-widest text-primary/40">Biểu đồ</p>
              <p className="mt-2 font-display text-lg font-bold text-primary">Sẽ hiện sau giao dịch đầu tiên</p>
            </div>
            <div className="rounded-xl bg-white/70 p-4 border border-primary/10">
              <p className="font-mono text-label uppercase tracking-widest text-primary/40">Ngân sách</p>
              <p className="mt-2 font-display text-lg font-bold text-primary">Theo dõi sau khi thêm chi tiêu</p>
            </div>
          </div>
        </div>
      )}

      {!isEmptyWorkspace && profile && (
        <BalanceCard
          balance={profile.currentBalance}
          currency={profile.currency}
          onEdit={() => setBalanceModalOpen(true)}
        />
      )}

      {!isEmptyWorkspace && summary && <FinanceSummaryCards summary={summary} currency={profile?.currency} />}

      {!isEmptyWorkspace && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeExpenseChart data={trendData} />
          <CategoryPieChart data={categoryData} />
        </div>
      )}

      {!isEmptyWorkspace && <RecentTransactions transactions={recent} />}

      <BalanceSetupModal
        open={balanceModalOpen}
        forceOpen={needsSetup}
        initialBalance={profile?.currentBalance ?? 0}
        initialCurrency={profile?.currency ?? 'VND'}
        loading={savingBalance}
        onSave={handleSaveBalance}
        onClose={() => !needsSetup && setBalanceModalOpen(false)}
      />
    </div>
  );
}
