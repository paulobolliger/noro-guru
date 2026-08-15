const { validateCpf, formatCpf } = require('../packages/lib/dist');

// Test CPFs
const testCases = [
  '111.111.111-11', // False (repetido)
  '12345678909',    // True (matematicamente válido)
  '99999999999',    // False
];

console.log('=== TESTE DE VALIDAÇÃO DE CPF (MÓDULO 11) ===');
testCases.forEach(cpf => {
  const valid = validateCpf(cpf);
  console.log(`CPF: ${cpf} -> Válido: ${valid} (Formatado: ${valid ? formatCpf(cpf) : 'N/A'})`);
});
