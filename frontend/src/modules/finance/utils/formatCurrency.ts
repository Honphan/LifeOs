export function formatCurrency(amount: number, currency = 'VND') {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSignedAmount(amount: number, type: 'INCOME' | 'EXPENSE', currency = 'VND') {
  const formatted = formatCurrency(amount, currency);
  return type === 'INCOME' ? `+${formatted}` : `-${formatted}`;
}
