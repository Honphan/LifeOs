import { api, unwrapData } from '../../../api/client';
import type {
  CreateTransactionPayload,
  FinanceTransaction,
  PaginatedResponse,
  TransactionFilterParams,
  UpdateTransactionPayload,
} from '../types/finance.types';

export async function getTransactions(params: TransactionFilterParams = {}) {
  const response = await api.get('/finance/transactions', { params });
  const data = unwrapData<PaginatedResponse<FinanceTransaction> | FinanceTransaction[]>(response.data);
  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length,
    } satisfies PaginatedResponse<FinanceTransaction>;
  }
  return {
    content: Array.isArray(data.content) ? data.content : [],
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
    number: data.number ?? 0,
    size: data.size ?? 0,
  } satisfies PaginatedResponse<FinanceTransaction>;
}

export async function getTransactionDetail(id: number) {
  const response = await api.get(`/finance/transactions/${id}`);
  return unwrapData<FinanceTransaction>(response.data);
}

export async function createTransaction(payload: CreateTransactionPayload) {
  const response = await api.post('/finance/transactions', payload);
  return unwrapData<FinanceTransaction>(response.data);
}

export async function updateTransaction(id: number, payload: UpdateTransactionPayload) {
  const response = await api.put(`/finance/transactions/${id}`, payload);
  return unwrapData<FinanceTransaction>(response.data);
}

export async function deleteTransaction(id: number) {
  await api.delete(`/finance/transactions/${id}`);
}

export async function uploadTransactionAttachment(transactionId: number, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(
    `/finance/transactions/${transactionId}/attachments`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return unwrapData(response.data);
}

export async function deleteTransactionAttachment(transactionId: number, attachmentId: number) {
  await api.delete(`/finance/transactions/${transactionId}/attachments/${attachmentId}`);
}
