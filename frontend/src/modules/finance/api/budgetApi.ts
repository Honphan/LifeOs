import { api, unwrapArrayData, unwrapData } from '../../../api/client';
import type {
  CreateBudgetPayload,
  FinanceBudget,
  UpdateBudgetPayload,
} from '../types/finance.types';

export async function getBudgets(month: number, year: number) {
  const response = await api.get('/finance/budgets', { params: { month, year } });
  return unwrapArrayData<FinanceBudget>(response.data);
}

export async function createBudget(payload: CreateBudgetPayload) {
  const response = await api.post('/finance/budgets', payload);
  return unwrapData<FinanceBudget>(response.data);
}

export async function updateBudget(id: number, payload: UpdateBudgetPayload) {
  const response = await api.put(`/finance/budgets/${id}`, payload);
  return unwrapData<FinanceBudget>(response.data);
}

export async function deleteBudget(id: number) {
  await api.delete(`/finance/budgets/${id}`);
}
