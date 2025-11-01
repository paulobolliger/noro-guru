export function formatCurrency(
  value: number,
  currency: 'BRL' | 'USD'
): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(value);
}