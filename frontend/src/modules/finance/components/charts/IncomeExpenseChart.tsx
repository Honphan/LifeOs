import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import type { MonthlyTrend } from '../../types/analytics.types';
import { EmptyState } from '../FinanceState';

const MONTH_LABELS = [
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
  'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
];

interface IncomeExpenseChartProps {
  data: MonthlyTrend[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const chartData = data.map((item) => ({
    name: MONTH_LABELS[item.month - 1] ?? `T${item.month}`,
    Thu: item.income,
    Chi: item.expense,
  }));

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-display font-bold text-primary">Thu / Chi theo tháng</h3>
        </CardHeader>
        <EmptyState title="Chưa có dữ liệu biểu đồ" />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-display font-bold text-primary">Thu / Chi theo tháng</h3>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
            <Legend />
            <Bar dataKey="Thu" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Chi" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
