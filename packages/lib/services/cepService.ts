// ═══════════════════════════════════════════════════════════════════════════
// cepService.ts — Serviço de Consulta de CEP com OpenCEP & Fallbacks
// ═══════════════════════════════════════════════════════════════════════════

export interface AddressResult {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  ibge?: string;
  complemento?: string;
  source: 'OpenCEP' | 'ViaCEP' | 'AwesomeAPI';
}

/**
 * Sanitiza a string removendo traços, pontos e caracteres não numéricos.
 */
export function sanitizeCep(cep: string): string {
  return cep.replace(/\D/g, '');
}

/**
 * Formata um CEP de 8 dígitos para o padrão de exibição 00000-000.
 */
export function formatCep(cep: string): string {
  const clean = sanitizeCep(cep);
  if (clean.length === 8) {
    return `${clean.substring(0, 5)}-${clean.substring(5)}`;
  }
  return cep;
}

/**
 * Consulta de CEP utilizando a API ultra-rápida do OpenCEP com fallback automático.
 * Primary: https://opencep.com/v1/{cep}.json
 * Fallback 1: https://viacep.com.br/ws/{cep}/json/
 * Fallback 2: https://cep.awesomeapi.com.br/json/{cep}
 */
export async function lookupAddressByCep(rawCep: string): Promise<AddressResult | null> {
  const cleanCep = sanitizeCep(rawCep);
  if (cleanCep.length !== 8) {
    console.warn(`[cepService] CEP inválido recebido: ${rawCep}`);
    return null;
  }

  // 1. Tentar OpenCEP (100% Grátis, CDN Cloudflare Jamstack)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2s timeout

    const openCepRes = await fetch(`https://opencep.com/v1/${cleanCep}.json`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (openCepRes.ok) {
      const data = await openCepRes.json();
      if (!data.erro) {
        return {
          cep: formatCep(data.cep || cleanCep),
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
          ibge: data.ibge || '',
          complemento: data.complemento || '',
          source: 'OpenCEP',
        };
      }
    }
  } catch (error) {
    console.warn('[cepService] OpenCEP falhou ou excedeu o timeout, acionando fallback ViaCEP...');
  }

  // 2. Fallback 1: ViaCEP
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (viaCepRes.ok) {
      const data = await viaCepRes.json();
      if (!data.erro) {
        return {
          cep: formatCep(data.cep || cleanCep),
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
          ibge: data.ibge || '',
          complemento: data.complemento || '',
          source: 'ViaCEP',
        };
      }
    }
  } catch (error) {
    console.warn('[cepService] ViaCEP falhou, acionando fallback AwesomeAPI...');
  }

  // 3. Fallback 2: AwesomeAPI CEP
  try {
    const apiKey = process.env.AWESOME_API_KEY || '23b7af563cd43bf96ccbfb7e253919fd9c08db31c4195d4cbd7cc5516be3f29c';
    const awesomeRes = await fetch(`https://cep.awesomeapi.com.br/json/${cleanCep}?token=${apiKey}`);
    if (awesomeRes.ok) {
      const data = await awesomeRes.json();
      if (data.address) {
        return {
          cep: formatCep(data.cep || cleanCep),
          logradouro: data.address || '',
          bairro: data.district || '',
          cidade: data.city || '',
          estado: data.state || '',
          ibge: data.city_ibge || '',
          source: 'AwesomeAPI',
        };
      }
    }
  } catch (error) {
    console.error('[cepService] Falha em todos os provedores de CEP:', error);
  }

  return null;
}
