import { api, unwrapData } from '../../../api/client';
import type { FinanceProfile } from '../types/finance.types';

export async function getFinanceProfile() {
  const response = await api.get('/finance/profile');
  return unwrapData<FinanceProfile>(response.data);
}

export async function updateFinanceBalance(currentBalance: number) {
  const response = await api.put('/finance/profile/balance', { currentBalance });
  return unwrapData<FinanceProfile>(response.data);
}
