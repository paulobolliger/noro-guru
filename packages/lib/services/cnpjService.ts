// ═══════════════════════════════════════════════════════════════════════════
// cnpjService.ts — Serviço de Consulta de CNPJ (CNPJ.ws, BrasilAPI, ReceitaWS)
// ═══════════════════════════════════════════════════════════════════════════

export interface CnpjResult {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  situacaoCadastral: string;
  dataAbertura?: string;
  cnaePrincipal?: string;
  telefone?: string;
  email?: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  source: 'CNPJ.ws' | 'BrasilAPI' | 'ReceitaWS';
}

/**
 * Sanitiza o CNPJ removendo barras, traços e pontos.
 */
export function sanitizeCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

/**
 * Formata um CNPJ de 14 dígitos para 00.000.000/0000-00.
 */
export function formatCnpj(cnpj: string): string {
  const clean = sanitizeCnpj(cnpj);
  if (clean.length === 14) {
    return `${clean.substring(0, 2)}.${clean.substring(2, 5)}.${clean.substring(5, 8)}/${clean.substring(8, 12)}-${clean.substring(12)}`;
  }
  return cnpj;
}

/**
 * Consulta resiliente de CNPJ com fallback automático entre múltiplos provedores.
 * 1. CNPJ.ws (Gratuito, Completo, Dados da Receita Federal)
 * 2. BrasilAPI
 * 3. ReceitaWS
 */
export async function lookupCnpj(rawCnpj: string): Promise<CnpjResult | null> {
  const cleanCnpj = sanitizeCnpj(rawCnpj);
  if (cleanCnpj.length !== 14) {
    console.warn(`[cnpjService] CNPJ inválido recebido: ${rawCnpj}`);
    return null;
  }

  // 1. Tentar CNPJ.ws
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`https://publica.cnpj.ws/cnpj/${cleanCnpj}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const estab = data.estabelecimento || {};
      return {
        cnpj: formatCnpj(cleanCnpj),
        razaoSocial: data.razao_social || '',
        nomeFantasia: estab.nome_fantasia || data.razao_social || '',
        situacaoCadastral: estab.situacao_cadastral || 'ATIVA',
        dataAbertura: estab.data_inicio_atividade || '',
        cnaePrincipal: estab.atividade_principal?.descricao || '',
        telefone: estab.ddd1 && estab.telefone1 ? `(${estab.ddd1}) ${estab.telefone1}` : '',
        email: estab.email || '',
        endereco: {
          logradouro: `${estab.tipo_logradouro || ''} ${estab.logradouro || ''}`.trim(),
          numero: estab.numero || '',
          complemento: estab.complemento || '',
          bairro: estab.bairro || '',
          cidade: estab.cidade?.nome || '',
          estado: estab.estado?.sigla || '',
          cep: estab.cep || '',
        },
        source: 'CNPJ.ws',
      };
    }
  } catch (e) {
    console.warn('[cnpjService] CNPJ.ws indisponível ou timeout, tentando BrasilAPI...');
  }

  // 2. Fallback 1: BrasilAPI
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return {
        cnpj: formatCnpj(cleanCnpj),
        razaoSocial: data.razao_social || '',
        nomeFantasia: data.nome_fantasia || data.razao_social || '',
        situacaoCadastral: data.descricao_situacao_cadastral || 'ATIVA',
        dataAbertura: data.data_inicio_atividade || '',
        cnaePrincipal: data.cnae_fiscal_descricao || '',
        telefone: data.ddd_telefone_1 ? `${data.ddd_telefone_1}` : '',
        email: data.email || '',
        endereco: {
          logradouro: `${data.descricao_tipo_de_logradouro || ''} ${data.logradouro || ''}`.trim(),
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cidade: data.municipio || '',
          estado: data.uf || '',
          cep: data.cep || '',
        },
        source: 'BrasilAPI',
      };
    }
  } catch (e) {
    console.warn('[cnpjService] BrasilAPI indisponível, tentando ReceitaWS...');
  }

  // 3. Fallback 2: ReceitaWS
  try {
    const res = await fetch(`https://receitaws.com.br/v1/cnpj/${cleanCnpj}`, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status !== 'ERROR') {
        return {
          cnpj: formatCnpj(cleanCnpj),
          razaoSocial: data.nome || '',
          nomeFantasia: data.fantasia || data.nome || '',
          situacaoCadastral: data.situacao || 'ATIVA',
          dataAbertura: data.abertura || '',
          cnaePrincipal: data.atividade_principal?.[0]?.text || '',
          telefone: data.telefone || '',
          email: data.email || '',
          endereco: {
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.municipio || '',
            estado: data.uf || '',
            cep: data.cep || '',
          },
          source: 'ReceitaWS',
        };
      }
    }
  } catch (e) {
    console.error('[cnpjService] Falha em todos os provedores de CNPJ:', e);
  }

  return null;
}
