import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../../api/client';
import { getFinanceSummary, getCategorySummary } from '../api/analyticsApi';
import { Card, CardHeader } from '../../../components/ui/Card';
import { FinanceSummaryCards } from '../components/FinanceSummaryCards';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { ErrorState, LoadingState } from '../components/FinanceState';
import { formatCurrency } from '../utils/formatCurrency';
import type { CategorySummary, FinanceSummary } from '../types/analytics.types';

export function ReportsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [prevSummary, setPrevSummary] = useState<FinanceSummary | null>(null);
  const [incomeByCategory, setIncomeByCategory] = useState<CategorySummary[]>([]);
  const [expenseByCategory, setExpenseByCategory] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [current, previous, income, expense] = await Promise.all([
        getFinanceSummary(month, year),
        getFinanceSummary(prevMonth, prevYear),
        getCategorySummary(month, year, 'INCOME'),
        getCategorySummary(month, year, 'EXPENSE'),
      ]);
      setSummary(current);
      setPrevSummary(previous);
      setIncomeByCategory(income);
      setExpenseByCategory(expense);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [month, year, prevMonth, prevYear]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const incomeDelta = (summary?.totalIncome ?? 0) - (prevSummary?.totalIncome ?? 0);
  const expenseDelta = (summary?.totalExpense ?? 0) - (prevSummary?.totalExpense ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-label uppercase tracking-widest text-secondary">Tháng</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-4 py-3 rounded-md bg-surface border-2 border-primary/10 font-body"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-label uppercase tracking-widest text-secondary">Năm</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-3 rounded-md bg-surface border-2 border-primary/10 font-body"
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {summary && <FinanceSummaryCards summary={summary} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-primary">So với tháng trước</h3>
          </CardHeader>
          <div className="space-y-2 font-body text-body">
            <p>
              Tổng thu:{' '}
              <span className={incomeDelta >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                {incomeDelta >= 0 ? '+' : ''}
                {formatCurrency(incomeDelta)}
              </span>
            </p>
            <p>
              Tổng chi:{' '}
              <span className={expenseDelta <= 0 ? 'text-emerald-600' : 'text-red-500'}>
                {expenseDelta >= 0 ? '+' : ''}
                {formatCurrency(expenseDelta)}
              </span>
            </p>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-display font-bold text-primary">Export</h3>
          </CardHeader>
          <p className="text-body text-primary/50 font-body">
            Xuất CSV/Excel sẽ được bổ sung trong phiên bản sau.
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart data={incomeByCategory} title="Thu theo danh mục" />
        <CategoryPieChart data={expenseByCategory} title="Chi theo danh mục" />
      </div>
    </div>
  );
}
