export function currencyFormat(value: number | string, currency: string = 'BRL'): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(numValue);
}

export function formatCurrency(value: number | string, currency: string = 'BRL'): string {
  return currencyFormat(value, currency);
}
