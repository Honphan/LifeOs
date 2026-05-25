import { api, unwrapData } from '../../../api/client';
import type {
  CreateCategoryPayload,
  FinanceCategory,
  TransactionType,
  UpdateCategoryPayload,
} from '../types/finance.types';

export async function getCategories(type?: TransactionType) {
  const response = await api.get('/finance/categories', { params: { type } });
  return unwrapData<FinanceCategory[]>(response.data);
}

export async function createCategory(payload: CreateCategoryPayload) {
  const response = await api.post('/finance/categories', payload);
  return unwrapData<FinanceCategory>(response.data);
}

export async function updateCategory(id: number, payload: UpdateCategoryPayload) {
  const response = await api.put(`/finance/categories/${id}`, payload);
  return unwrapData<FinanceCategory>(response.data);
}

export async function deleteCategory(id: number) {
  await api.delete(`/finance/categories/${id}`);
}
