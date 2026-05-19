import 'server-only';
import { ServerActionReturn } from '../pedidos-actions';
import { PedidoComRelacionamentos } from '@/types/pedidos';

// ================================================================
// CONFIGURAÇÃO DE AMBIENTE
// ================================================================

const IS_SANDBOX = process.env.EREDE_SANDBOX === 'true';

// URLs confirmadas pela collection Postman oficial e.Rede (Sandboxe.Rede.postman_collection.json)
// base_url  → transações  (v1/transactions, v1/transactions/{tid}/refunds, etc.)
// urlToken  → OAuth 2.0   (apenas para geração de token)
const EREDE_BASE_URL = IS_SANDBOX
  ? 'https://sandbox-erede.useredecloud.com.br'
  : 'https://api.userede.com.br/redelabs';

const EREDE_OAUTH_URL = IS_SANDBOX
  ? 'https://rl7-sandbox-api.useredecloud.com.br/oauth2/token'
  : 'https://api.userede.com.br/redelabs/oauth2/token';

// ================================================================
// COMPONENTE 1: GERENCIADOR DE TOKEN OAUTH 2.0
// ----------------------------------------------------------------
// Token TTL: 1440 segundos (24 minutos).
// Renovação disparada quando restam < 120 segundos (2 minutos).
// Cache em módulo: persiste em invocações warm no mesmo processo.
// Em produção com muitas instâncias cold-start, considere persistir
// o token no Supabase (tabela noro_integrations_cache) ou Redis.
// ================================================================

interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp em segundos
}

let tokenCache: TokenCache | null = null;

async function getERedeToken(): Promise<string> {
  const clientId = process.env.EREDE_CLIENT_ID;
  const clientSecret = process.env.EREDE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('e.Rede: EREDE_CLIENT_ID ou EREDE_CLIENT_SECRET não configurados.');
  }

  const nowSeconds = Math.floor(Date.now() / 1000);

  // Reutiliza cache se ainda tiver mais de 120s de validade
  if (tokenCache && tokenCache.expiresAt - nowSeconds > 120) {
    return tokenCache.accessToken;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(EREDE_OAUTH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    // Desabilita cache do Next.js para esta chamada crítica de autenticação
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`e.Rede OAuth falhou (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  // TTL declarado pela e.Rede: 1440 segundos (24 minutos)
  tokenCache = {
    accessToken: data.access_token,
    expiresAt: nowSeconds + 1440,
  };

  return tokenCache.accessToken;
}

// ================================================================
// COMPONENTE 2: SANITIZADOR DE ENTRADA
// ----------------------------------------------------------------
// A e.Rede rejeita qualquer campo com caracteres especiais.
// Remove acentos, cedilhas e símbolos, mantendo apenas
// alfanuméricos, espaços e hífens.
// ================================================================

function sanitize(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove diacríticos (acentos)
    .replace(/[^a-zA-Z0-9\s\-]/g, '') // Remove tudo que não é alfanumérico, espaço ou hífen
    .trim();
}

function toCents(value: number): number {
  if (value <= 0) throw new Error('Valor da transação deve ser superior a zero.');
  return Math.round(value * 100);
}

// Trunca referência ao máximo de 16 caracteres (limite e.Rede)
function buildReference(pedidoId: string): string {
  return pedidoId.replace(/-/g, '').slice(0, 16).toUpperCase();
}

// ================================================================
// HELPER: REQUISIÇÕES AUTENTICADAS
// ================================================================

async function eredeRequest<T = any>(
  method: 'GET' | 'POST' | 'PUT',
  path: string,
  body?: Record<string, unknown>
): Promise<{ status: number; data: T }> {
  const token = await getERedeToken();
  const url = `${EREDE_BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  let data: T;
  try {
    data = await response.json();
  } catch {
    data = {} as T;
  }

  return { status: response.status, data };
}

// ================================================================
// COMPONENTE 3: PROCESSADOR DE RESPOSTAS
// ----------------------------------------------------------------
// Códigos de retorno aprovados pela e.Rede:
//   "00"  → Aprovado
//   "359" → Aprovado (valor parcial)
//   "360" → Aprovado (contagem de parcelas alterada)
//   "220" → Requer autenticação 3DS (redirect para URL)
// ================================================================

function processERedeReturnCode(data: any): {
  approved: boolean;
  requires3DS: boolean;
  redirectUrl?: string;
  message: string;
} {
  const code = String(data?.returnCode ?? '');

  if (['00', '359', '360'].includes(code)) {
    return { approved: true, requires3DS: false, message: 'Transação aprovada.' };
  }

  if (code === '220') {
    return {
      approved: false,
      requires3DS: true,
      redirectUrl: data?.threeDSecure?.url,
      message: 'Autenticação 3DS necessária. Redirecionando o cliente.',
    };
  }

  const msg = data?.returnMessage || 'Transação recusada pela adquirente.';
  return { approved: false, requires3DS: false, message: `e.Rede (${code}): ${msg}` };
}

// ================================================================
// TIPOS PÚBLICOS
// ================================================================

export interface ERedeCardPayload {
  pedido: PedidoComRelacionamentos;
  /** Nome do portador exatamente como no cartão */
  cardholderName: string;
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  securityCode: string;
  /** 'credit' ou 'debit'. Padrão: 'credit' */
  kind?: 'credit' | 'debit';
  /** Número de parcelas (1–12). Padrão: 1 */
  installments?: number;
  /** Texto que aparece na fatura (máx 13 chars) */
  softDescriptor?: string;
  /** Metadados do dispositivo para 3DS 2.0 (opcional) */
  threeDSecure?: ThreeDSecureData;
}

export interface ThreeDSecureData {
  userAgent: string;
  ipAddress: string;
  device: {
    colorDepth: string;
    javaEnabled: boolean;
    language: string;
    screenHeight: string;
    screenWidth: string;
    timeZoneOffset: string;
  };
  billing?: {
    address: string;
    city: string;
    postalCode: string;
    state: string;
    country: string;
    emailAddress: string;
    phoneNumber: string;
  };
  /** URL para redirecionar após autenticação bem-sucedida */
  successUrl?: string;
  /** URL para redirecionar após falha ou cancelamento */
  cancelUrl?: string;
  /** Comportamento em caso de falha 3DS. Padrão: 'continue' */
  onFailure?: 'continue' | 'decline';
}

export interface ERedePixPayload {
  pedido: PedidoComRelacionamentos;
  /** Validade do QR Code em segundos. Padrão: 3600 (1 hora) */
  expirationSeconds?: number;
}

export interface ERedeRefundPayload {
  tid: string;
  /** Valor a estornar em reais. Se omitido, estorna o total. */
  amountBRL?: number;
  /** URL de callback para receber resultado assíncrono do estorno */
  callbackUrl?: string;
}

// ================================================================
// AÇÃO: COBRANÇA POR CARTÃO (CRÉDITO OU DÉBITO)
// ================================================================

export async function createERedeCardCharge(
  payload: ERedeCardPayload
): Promise<ServerActionReturn & { tid?: string; nsu?: string; redirectUrl?: string }> {
  const {
    pedido,
    cardholderName,
    cardNumber,
    expirationMonth,
    expirationYear,
    securityCode,
    kind = 'credit',
    installments = 1,
    softDescriptor,
    threeDSecure,
  } = payload;

  if (!pedido.valor_total || pedido.valor_total <= 0) {
    return { success: false, message: 'Valor do pedido inválido.' };
  }

  const reference = buildReference(pedido.id);
  const amountCents = toCents(pedido.valor_total);

  const body: Record<string, unknown> = {
    capture: true,
    kind,
    reference,
    amount: amountCents,
    cardholderName: sanitize(cardholderName),
    cardNumber: cardNumber.replace(/\D/g, ''),
    expirationMonth,
    expirationYear,
    securityCode,
    ...(kind === 'credit' && installments > 1 ? { installments } : {}),
    ...(softDescriptor ? { softDescriptor: softDescriptor.slice(0, 13) } : {}),
  };

  // 3DS 2.0 — só envia se os dados de dispositivo foram fornecidos
  if (threeDSecure) {
    const { successUrl, cancelUrl, onFailure = 'continue', ...rest } = threeDSecure;
    body.threeDSecure = {
      embedded: true,
      onFailure,
      ...rest,
      ...(successUrl || cancelUrl
        ? {
            urls: [
              ...(successUrl ? [{ kind: 'threeDSSuccess', url: successUrl }] : []),
              ...(cancelUrl ? [{ kind: 'threeDSFailure', url: cancelUrl }] : []),
            ],
          }
        : {}),
    };
  }

  try {
    const { status, data } = await eredeRequest('POST', '/v1/transactions', body);

    if (status !== 200 && status !== 201) {
      return {
        success: false,
        message: `e.Rede HTTP ${status}: ${data?.returnMessage || 'Erro desconhecido.'}`,
        data,
      };
    }

    const result = processERedeReturnCode(data);

    if (result.requires3DS) {
      return {
        success: false, // Não falhou — mas exige ação do cliente
        message: result.message,
        data: { requiresRedirect: true, redirectUrl: result.redirectUrl, tid: data?.tid, nsu: data?.nsu },
        redirectUrl: result.redirectUrl,
        tid: data?.tid,
        nsu: data?.nsu,
      };
    }

    if (!result.approved) {
      return { success: false, message: result.message, data };
    }

    return {
      success: true,
      message: `Pagamento aprovado! TID: ${data.tid}`,
      data: {
        tid: data.tid,
        nsu: data.nsu,
        authorizationCode: data.authorization?.code,
        returnCode: data.returnCode,
      },
      tid: data.tid,
      nsu: data.nsu,
    };
  } catch (error: any) {
    return { success: false, message: `Falha de comunicação com e.Rede: ${error.message}` };
  }
}

// ================================================================
// AÇÃO: COBRANÇA PIX
// ================================================================

export async function createERedePixCharge(
  payload: ERedePixPayload
): Promise<ServerActionReturn & { qrCode?: string; qrCodeUrl?: string; tid?: string }> {
  const { pedido, expirationSeconds = 3600 } = payload;

  if (!pedido.valor_total || pedido.valor_total <= 0) {
    return { success: false, message: 'Valor do pedido inválido para PIX.' };
  }

  const reference = buildReference(pedido.id);
  const amountCents = toCents(pedido.valor_total);

  const body: Record<string, unknown> = {
    capture: true,
    kind: 'pix',
    reference,
    amount: amountCents,
    expirationSeconds,
  };

  try {
    const { status, data } = await eredeRequest('POST', '/v1/transactions', body);

    if (status !== 200 && status !== 201) {
      return {
        success: false,
        message: `e.Rede PIX HTTP ${status}: ${data?.returnMessage || 'Erro desconhecido.'}`,
        data,
      };
    }

    // Para PIX, o QR Code estático e EMV são retornados no objeto pix
    const pixData = data?.pix;
    if (!pixData) {
      return {
        success: false,
        message: 'e.Rede não retornou dados PIX. Verifique se o PV está habilitado para PIX.',
        data,
      };
    }

    return {
      success: true,
      message: 'QR Code PIX gerado com sucesso.',
      data: {
        tid: data.tid,
        qrCode: pixData.emvqrcps,        // Copia e cola (EMV)
        qrCodeUrl: pixData.qrCodeUrl,    // Imagem do QR Code (base64 ou URL)
        expirationDate: pixData.expirationDate,
      },
      qrCode: pixData.emvqrcps,
      qrCodeUrl: pixData.qrCodeUrl,
      tid: data.tid,
    };
  } catch (error: any) {
    return { success: false, message: `Falha de comunicação com e.Rede (PIX): ${error.message}` };
  }
}

// ================================================================
// AÇÃO: CAPTURA MANUAL (para transações com capture: false)
// ================================================================

export async function captureERedeTransaction(
  tid: string,
  amountBRL?: number
): Promise<ServerActionReturn> {
  try {
    const body: Record<string, unknown> = {};
    if (amountBRL !== undefined) {
      body.amount = toCents(amountBRL);
    }

    const { status, data } = await eredeRequest('PUT', `/v1/transactions/${tid}`, body);

    if (status !== 200 && status !== 201) {
      return { success: false, message: `Captura falhou (HTTP ${status}): ${data?.returnMessage}`, data };
    }

    return {
      success: true,
      message: `Transação ${tid} capturada com sucesso.`,
      data,
    };
  } catch (error: any) {
    return { success: false, message: `Erro na captura e.Rede: ${error.message}` };
  }
}

// ================================================================
// AÇÃO: CONSULTA DE TRANSAÇÃO
// ================================================================

export async function queryERedeTransaction(
  tid: string
): Promise<ServerActionReturn & { returnCode?: string }> {
  try {
    const { status, data } = await eredeRequest('GET', `/v1/transactions/${tid}`);

    if (status === 404) {
      return { success: false, message: `Transação ${tid} não encontrada na e.Rede.` };
    }

    if (status !== 200) {
      return { success: false, message: `Consulta falhou (HTTP ${status}).`, data };
    }

    return {
      success: true,
      message: 'Transação encontrada.',
      data,
      returnCode: data?.returnCode,
    };
  } catch (error: any) {
    return { success: false, message: `Erro na consulta e.Rede: ${error.message}` };
  }
}

// ================================================================
// AÇÃO: ESTORNO / CANCELAMENTO
// ================================================================

// Mensagens de erro de estorno traduzidas para pt-BR
const REFUND_ERROR_MESSAGES: Record<string, string> = {
  '358': 'O valor acumulado de estornos supera o total original da transação.',
  '359': 'O saldo disponível para estorno é menor que o valor solicitado.',
  '362': 'Identificador de reembolso não encontrado.',
  '363': 'A URL de callback excede 500 caracteres.',
  '365': 'O cartão utilizado não permite estorno parcial.',
  '369': 'Estorno não encontrado na adquirente.',
  '370': 'Falha interna no estorno. Entre em contato com a Rede (4001 4433).',
};

export async function createERedeRefund(
  payload: ERedeRefundPayload
): Promise<ServerActionReturn> {
  const { tid, amountBRL, callbackUrl } = payload;

  if (!tid) {
    return { success: false, message: 'TID da transação é obrigatório para estorno.' };
  }

  if (callbackUrl && callbackUrl.length > 500) {
    return { success: false, message: 'URL de callback excede 500 caracteres (limite e.Rede).' };
  }

  const body: Record<string, unknown> = {};

  if (amountBRL !== undefined) {
    body.amount = toCents(amountBRL);
  }

  if (callbackUrl) {
    body.urls = [{ kind: 'callback', url: callbackUrl }];
  }

  try {
    const { status, data } = await eredeRequest('POST', `/v1/transactions/${tid}/refunds`, body);

    // 200/201 = sucesso imediato
    if (status === 200 || status === 201) {
      return {
        success: true,
        message: `Estorno de ${amountBRL ? `R$ ${amountBRL.toFixed(2)}` : '100%'} solicitado com sucesso. ID: ${data?.refundId || 'N/A'}`,
        data,
      };
    }

    // Trata erros de negócio com mensagens claras
    const errorCode = String(data?.returnCode ?? data?.errorCode ?? status);
    const humanMessage = REFUND_ERROR_MESSAGES[errorCode] || data?.returnMessage || `Erro ${errorCode} no estorno.`;

    return { success: false, message: humanMessage, data };
  } catch (error: any) {
    return { success: false, message: `Falha de comunicação com e.Rede (estorno): ${error.message}` };
  }
}
