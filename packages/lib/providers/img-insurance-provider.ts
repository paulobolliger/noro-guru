// ═══════════════════════════════════════════════════════════════════════════
// img-insurance-provider.ts — Provedor IMG (International Medical Group) Seguro Viagem
// ═══════════════════════════════════════════════════════════════════════════

import type { SupplierHealthStatus } from './supplier-adapter';

export interface ImgCredentials {
  producerNumber: string;
  username: string;
  password: string;
  isSandbox?: boolean;
  apiBaseUrl?: string;
  tokenUrl?: string;
}

export interface InsuranceQuoteRequest {
  originCountry: string; // Ex: 'BRA'
  destinationCountries: string[]; // Ex: ['USA', 'FRA']
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  travelerBirthDates: string[]; // ['1990-05-15', '1995-10-20']
  maximumLimit?: number; // Ex: 50000, 100000, 500000
  deductible?: number; // Ex: 0, 100, 250
}

export interface InsurancePlanOption {
  productCode: string; // Ex: 'PATAI' ou 'PATII'
  planName: string; // Ex: 'Patriot America Lite' ou 'Patriot International Lite'
  coverageLimitAmount: number; // Ex: 50000 USD
  deductibleAmount: number; // Ex: 250 USD
  netPriceAmountUSD: number; // Preço líquido em Dólares
  provider: 'img';
}

export class ImgInsuranceProvider {
  private producerNumber: string;
  private username: string;
  private password: string;
  private apiBaseUrl: string;
  private tokenUrl: string;
  private cachedToken: { token: string; expiresAt: number } | null = null;

  constructor(creds?: Partial<ImgCredentials>) {
    this.producerNumber =
      creds?.producerNumber ||
      process.env.IMG_PRODUCER_NUMBER ||
      '';
    this.username =
      creds?.username ||
      process.env.IMG_API_USERNAME ||
      '';
    this.password =
      creds?.password ||
      process.env.IMG_API_PASSWORD ||
      '';

    const isSandbox = creds?.isSandbox ?? (process.env.IMG_API_ENV !== 'production');
    this.apiBaseUrl =
      creds?.apiBaseUrl ||
      (isSandbox
        ? 'https://beta-services.imglobal.com/API'
        : 'https://services.imglobal.com/API');
    this.tokenUrl =
      creds?.tokenUrl ||
      (isSandbox
        ? 'https://beta-services.imglobal.com/oAuth/token'
        : 'https://services.imglobal.com/oAuth/token');
  }

  /**
   * Obtém o Token de Acesso OAuth 2.0 (Password Grant).
   */
  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60000) {
      return this.cachedToken.token;
    }

    const body = new URLSearchParams({
      grant_type: 'password',
      username: this.username,
      password: this.password,
    });

    const res = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`IMG OAuth falhou [${res.status}]: ${errText}`);
    }

    const data = await res.json();
    const token = typeof data === 'string' ? data : data.access_token;
    if (!token) throw new Error('IMG OAuth não retornou o access_token.');

    const expiresInSeconds = typeof data === 'string' ? 1800 : data.expires_in || 1800;
    this.cachedToken = { token, expiresAt: now + expiresInSeconds * 1000 };
    return token;
  }

  /**
   * Health Check do Provedor IMG.
   */
  async checkHealth(): Promise<SupplierHealthStatus> {
    const startTime = Date.now();
    try {
      const isConfigured = Boolean(this.username && this.password && this.producerNumber);
      const latencyMs = Date.now() - startTime;

      if (!isConfigured) {
        return {
          supplierId: 'img_insurance',
          supplierName: 'IMG (International Medical Group)',
          status: 'disabled',
          color: 'gray',
          latencyMs,
          message: 'Credenciais IMG_PRODUCER_NUMBER / IMG_API_USERNAME pendentes no .env.local',
          lastCheckedAt: new Date().toISOString(),
        };
      }

      await this.getAccessToken();
      return {
        supplierId: 'img_insurance',
        supplierName: 'IMG (International Medical Group)',
        status: 'healthy',
        color: 'green',
        latencyMs: Date.now() - startTime,
        message: 'Conexão OAuth 2.0 estabelecida com sucesso',
        lastCheckedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        supplierId: 'img_insurance',
        supplierName: 'IMG (International Medical Group)',
        status: 'unhealthy',
        color: 'red',
        latencyMs: Date.now() - startTime,
        message: `Falha OAuth IMG: ${err.message}`,
        lastCheckedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Escolhe o código do produto Patriot Lite adequado conforme o destino.
   * PATAI: Inclui EUA / PATII: Destinos fora dos EUA.
   */
  private chooseProductCode(destinations: string[]): { code: string; name: string } {
    const includesUsa = destinations.some(
      (d) => d.toUpperCase() === 'USA' || d.toUpperCase() === 'UNITED STATES' || d.toUpperCase() === 'EUA'
    );
    return includesUsa
      ? { code: 'PATAI', name: 'Patriot America Lite (Inclui EUA)' }
      : { code: 'PATII', name: 'Patriot International Lite (Mundo exceto EUA)' };
  }

  /**
   * Cotador de Seguro Viagem IMG (POST /Quotes/GetQuote).
   */
  async quote(req: InsuranceQuoteRequest): Promise<InsurancePlanOption[]> {
    if (!this.producerNumber || !this.username) {
      return [];
    }

    const token = await this.getAccessToken();
    const product = this.chooseProductCode(req.destinationCountries);

    const payload = {
      producerNumber: this.producerNumber,
      productCode: product.code,
      appType: '1025',
      travelInfo: {
        startDate: req.startDate,
        endDate: req.endDate,
        destinations: req.destinationCountries,
      },
      policyInfo: {
        deductible: req.deductible || 250,
        maximumLimit: req.maximumLimit || 50000,
        currencyCode: 'USD',
        fulfillmentMethod: 'Online',
      },
      families: [
        {
          insureds: req.travelerBirthDates.map((dob, idx) => ({
            dateOfBirth: dob,
            citizenship: req.originCountry,
            residence: req.originCountry,
            travelerType: idx === 0 ? 'Primary' : 'Child',
          })),
        },
      ],
    };

    const res = await fetch(`${this.apiBaseUrl}/Quotes/GetQuote`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const totalPrice = data.totalPremium ? parseFloat(data.totalPremium) : 0;

    return [
      {
        productCode: product.code,
        planName: product.name,
        coverageLimitAmount: req.maximumLimit || 50000,
        deductibleAmount: req.deductible || 250,
        netPriceAmountUSD: totalPrice,
        provider: 'img',
      },
    ];
  }

  /**
   * Emissão de Apólice / Certificado de Seguro Viagem (POST /Purchases/GetCertificate).
   */
  async purchaseCertificate(payload: Record<string, unknown>): Promise<any> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.apiBaseUrl}/Purchases/GetCertificate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`IMG Purchase Certificate falhou [${res.status}]: ${errText}`);
    }

    return await res.json();
  }
}
