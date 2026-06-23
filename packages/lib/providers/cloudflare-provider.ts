function getCloudflareConfig() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;

  if (!apiToken || !zoneId) {
    throw new Error('CLOUDFLARE_API_TOKEN ou CLOUDFLARE_ZONE_ID não configurados.');
  }

  return { apiToken, zoneId };
}

export type CloudflareHostnameStatus = 'active' | 'pending' | 'moved' | 'deleted' | 'unknown';

export interface CloudflareCustomHostname {
  id: string;
  hostname: string;
  status: CloudflareHostnameStatus;
  sslStatus: string;
  ownershipValidationName?: string;
  ownershipValidationValue?: string;
  sslValidationName?: string;
  sslValidationValue?: string;
}

interface CloudflareApiResponse<T> {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  messages: string[];
  result: T;
}

interface CloudflareCustomHostnameResult {
  id: string;
  hostname: string;
  status: string;
  ownership_verification?: {
    type: string;
    name: string;
    value: string;
  };
  ownership_verification_status?: string;
  ssl?: {
    id: string;
    type: string;
    method: string;
    status: string;
    validation_records?: Array<{
      txt_name?: string;
      txt_value?: string;
      cname?: string;
      cname_target?: string;
    }>;
  };
}

async function cloudflareFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { apiToken, zoneId } = getCloudflareConfig();
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`,
      ...(options.headers ?? {}),
    },
  });

  const body = await res.json() as CloudflareApiResponse<T>;

  if (!res.ok || !body.success) {
    const errorMsg = body.errors?.map((e) => `[Code ${e.code}] ${e.message}`).join(', ') || 'Erro desconhecido';
    throw new Error(`Cloudflare API error ${res.status}: ${errorMsg}`);
  }

  return body.result;
}

function mapResultToCustomHostname(res: CloudflareCustomHostnameResult): CloudflareCustomHostname {
  const ownership = res.ownership_verification;
  const ssl = res.ssl;
  const sslRecord = ssl?.validation_records?.[0];

  let status: CloudflareHostnameStatus = 'unknown';
  if (res.status === 'active') status = 'active';
  else if (res.status === 'pending') status = 'pending';
  else if (res.status === 'moved') status = 'moved';
  else if (res.status === 'deleted') status = 'deleted';

  return {
    id: res.id,
    hostname: res.hostname,
    status,
    sslStatus: ssl?.status ?? 'unknown',
    ownershipValidationName: ownership?.name,
    ownershipValidationValue: ownership?.value,
    sslValidationName: sslRecord?.txt_name || sslRecord?.cname,
    sslValidationValue: sslRecord?.txt_value || sslRecord?.cname_target,
  };
}

/**
 * Cria uma nova entrada de Custom Hostname na Cloudflare.
 */
export async function createCustomHostname(hostname: string): Promise<CloudflareCustomHostname> {
  console.log(`[Cloudflare] Criando Custom Hostname para: ${hostname}`);
  const data = await cloudflareFetch<CloudflareCustomHostnameResult>('/custom_hostnames', {
    method: 'POST',
    body: JSON.stringify({
      hostname,
      ssl: {
        method: 'http',
        type: 'dv',
      },
    }),
  });

  return mapResultToCustomHostname(data);
}

/**
 * Recupera os detalhes de um Custom Hostname na Cloudflare.
 */
export async function getCustomHostname(customHostnameId: string): Promise<CloudflareCustomHostname> {
  console.log(`[Cloudflare] Buscando Custom Hostname ID: ${customHostnameId}`);
  const data = await cloudflareFetch<CloudflareCustomHostnameResult>(`/custom_hostnames/${customHostnameId}`);
  return mapResultToCustomHostname(data);
}

/**
 * Exclui um Custom Hostname na Cloudflare.
 */
export async function deleteCustomHostname(customHostnameId: string): Promise<void> {
  console.log(`[Cloudflare] Deletando Custom Hostname ID: ${customHostnameId}`);
  await cloudflareFetch<unknown>(`/custom_hostnames/${customHostnameId}`, {
    method: 'DELETE',
  });
}

/**
 * Procura um Custom Hostname pelo nome de domínio exato.
 */
export async function findCustomHostnameByDomain(hostname: string): Promise<CloudflareCustomHostname | null> {
  console.log(`[Cloudflare] Procurando Custom Hostname por domínio: ${hostname}`);
  const data = await cloudflareFetch<CloudflareCustomHostnameResult[]>(
    `/custom_hostnames?hostname=${encodeURIComponent(hostname)}`,
  );

  if (!data || data.length === 0) {
    return null;
  }

  return mapResultToCustomHostname(data[0]);
}
