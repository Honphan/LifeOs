import { api, unwrapArrayData, unwrapData } from '../../../api/client';
import type {
  CategorySummary,
  FinanceSummary,
  MonthlyTrend,
} from '../types/analytics.types';
import type { TransactionType } from '../types/finance.types';

export async function getFinanceSummary(month: number, year: number) {
  const response = await api.get('/finance/summary', { params: { month, year } });
  return unwrapData<FinanceSummary>(response.data);
}

export async function getCategorySummary(month: number, year: number, type: TransactionType) {
  const response = await api.get('/finance/analytics/category-summary', {
    params: { month, year, type },
  });
  return unwrapArrayData<CategorySummary>(response.data);
}

export async function getMonthlyTrend(year: number) {
  const response = await api.get('/finance/analytics/monthly-trend', { params: { year } });
  return unwrapArrayData<MonthlyTrend>(response.data);
}
