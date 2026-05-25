import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader } from '../../../../components/ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import type { CategorySummary } from '../../types/analytics.types';
import { EmptyState } from '../FinanceState';

const DEFAULT_COLORS = ['#06B6D4', '#60A5FA', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

interface CategoryPieChartProps {
  data: CategorySummary[];
  title?: string;
}

export function CategoryPieChart({
  data,
  title = 'Chi tiêu theo danh mục',
}: CategoryPieChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.categoryName,
    value: item.totalAmount,
    fill: item.categoryColor ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <h3 className="font-display font-bold text-primary">{title}</h3>
        </CardHeader>
        <EmptyState title="Chưa có dữ liệu chi tiêu" />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-display font-bold text-primary">{title}</h3>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={entry.fill ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
