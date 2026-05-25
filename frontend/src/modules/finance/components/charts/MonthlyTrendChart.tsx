import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

interface MonthlyTrendChartProps {
  data: MonthlyTrend[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.map((item) => ({
    name: MONTH_LABELS[item.month - 1] ?? `T${item.month}`,
    Thu: item.income,
    Chi: item.expense,
  }));

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-display font-bold text-primary">Xu hướng thu/chi</h3>
        </CardHeader>
        <EmptyState title="Chưa có dữ liệu xu hướng" />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-display font-bold text-primary">Xu hướng thu/chi</h3>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
            <Legend />
            <Line type="monotone" dataKey="Thu" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Chi" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
