// ═══════════════════════════════════════════════════════════════════════════
// cpfService.ts — Validação Matemática de CPF (Módulo 11) & Formatação
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sanitiza a string mantendo apenas números.
 */
export function sanitizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/**
 * Formata uma string de 11 dígitos no padrão 000.000.000-00.
 */
export function formatCpf(cpf: string): string {
  const clean = sanitizeCpf(cpf);
  if (clean.length === 11) {
    return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6, 9)}-${clean.substring(9)}`;
  }
  return cpf;
}

/**
 * Valida se um CPF é matematicamente válido usando o algoritmo oficial do Módulo 11 (Receita Federal).
 * Retorna true se for um CPF válido e false se for inválido ou repetido (ex: 111.111.111-11).
 */
export function validateCpf(rawCpf: string): boolean {
  const clean = sanitizeCpf(rawCpf);

  // Deve possuir exatamente 11 dígitos
  if (clean.length !== 11) return false;

  // Elimina CPFs inválidos conhecidos (todos os dígitos iguais)
  if (/^(\d)\1{10}$/.test(clean)) return false;

  // Validação do 1º Dígito Verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i)) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(9))) return false;

  // Validação do 2º Dígito Verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i)) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(clean.charAt(10))) return false;

  return true;
}
