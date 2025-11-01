// Serviço BrasilAPI para auto-preenchimento e validação
// Pode ser usado em qualquer formulário ou backend

export async function buscarCep(cep: string) {
  const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
  if (!res.ok) throw new Error('CEP não encontrado');
  return await res.json();
}

export async function buscarCnpj(cnpj: string) {
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
  if (!res.ok) throw new Error('CNPJ não encontrado');
  return await res.json();
}

export async function buscarBanco(codigo: string) {
  const res = await fetch(`https://brasilapi.com.br/api/banks/v1/${codigo}`);
  if (!res.ok) throw new Error('Banco não encontrado');
  return await res.json();
}

export async function buscarDdd(ddd: string) {
  const res = await fetch(`https://brasilapi.com.br/api/ddd/v1/${ddd}`);
  if (!res.ok) throw new Error('DDD não encontrado');
  return await res.json();
}

export async function buscarFeriados(ano: number) {
  const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
  if (!res.ok) throw new Error('Ano inválido');
  return await res.json();
}

// Exemplos de uso:
// const endereco = await buscarCep('01001-000');
// const empresa = await buscarCnpj('27865757000102');
// const banco = await buscarBanco('001');
// const ddd = await buscarDdd('11');
// const feriados = await buscarFeriados(2025);
