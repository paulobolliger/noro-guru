export function formatCost(cost: number): string {
  if (typeof cost !== 'number') return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cost);
}
