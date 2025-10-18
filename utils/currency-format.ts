// utils/currency-format.ts

/**
 * Formata um número como uma string de moeda em Euros (EUR).
 * @param value O valor numérico a ser formatado.
 * @returns Uma string formatada, por exemplo, "€1,234.56".
 */
export function currencyFormat(value: number): string {
  if (value === null || value === undefined) {
    return '€0,00';
  }
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}