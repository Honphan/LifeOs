import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../../api/client';
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

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, summaryRes, txRes] = await Promise.all([
        getFinanceProfile(),
        getFinanceSummary(month, year),
        getTransactions({ page: 0, size: 5, sort: 'transactionDate,desc' }),
      ]);

      const [categoryResult, trendResult] = await Promise.allSettled([
        getCategorySummary(month, year, 'EXPENSE'),
        getMonthlyTrend(year),
      ]);

      setProfile(profileRes);
      setSummary(summaryRes);
      setCategoryData(categoryResult.status === 'fulfilled' ? categoryResult.value : []);
      setTrendData(trendResult.status === 'fulfilled' ? trendResult.value : []);
      setRecent(txRes.content);
      const unsetBalance =
        profileRes.currentBalance === undefined ||
        profileRes.currentBalance === null;
      setNeedsSetup(unsetBalance);
      setBalanceModalOpen(unsetBalance);
    } catch (err) {
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
      {profile && (
        <BalanceCard
          balance={profile.currentBalance}
          currency={profile.currency}
          onEdit={() => setBalanceModalOpen(true)}
        />
      )}

      {summary && <FinanceSummaryCards summary={summary} currency={profile?.currency} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart data={trendData} />
        <CategoryPieChart data={categoryData} />
      </div>

      <RecentTransactions transactions={recent} />

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
