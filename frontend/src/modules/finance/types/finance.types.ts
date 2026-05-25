export type TransactionType = 'INCOME' | 'EXPENSE';

export interface FinanceProfile {
  currentBalance: number;
  initialBalance: number;
  currency: string;
}

export interface FinanceCategory {
  id: number;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
  isDefault: boolean;
}

export interface TransactionAttachment {
  id: number;
  imageUrl?: string;
  fileUrl?: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  createdAt?: string;
}

export interface FinanceTransaction {
  id: number;
  name: string;
  amount: number;
  type: TransactionType;
  categoryId: number;
  categoryName: string;
  categoryColor?: string;
  categoryIcon?: string;
  note?: string;
  transactionDate: string;
  attachments?: TransactionAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface FinanceBudget {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  amountLimit: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  month: number;
  year: number;
}

export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface CreateTransactionPayload {
  name: string;
  amount: number;
  type: TransactionType;
  categoryId: number;
  note?: string;
  transactionDate: string;
}

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export interface CreateBudgetPayload {
  name: string;
  categoryId: number;
  amountLimit: number;
  month: number;
  year: number;
}

export type UpdateBudgetPayload = Partial<CreateBudgetPayload>;

export interface TransactionFilterParams {
  keyword?: string;
  type?: TransactionType;
  categoryId?: number;
  from?: string;
  to?: string;
  minAmount?: number;
  maxAmount?: number;
  hasAttachment?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
