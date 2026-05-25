import type { TransactionType } from './finance.types';

export interface FinanceSummary {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

export interface CategorySummary {
  categoryName: string;
  totalAmount: number;
  percentage: number;
  categoryColor?: string;
}

export interface MonthlyTrend {
  month: number;
  income: number;
  expense: number;
}

export interface CategorySummaryParams {
  month: number;
  year: number;
  type: TransactionType;
}
