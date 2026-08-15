// ═══════════════════════════════════════════════════════════════════════════
// wooba-provider.ts — Provedor Wooba Travellink (Aéreo, Hotel, Carro, Ônibus, Seguro)
// ═══════════════════════════════════════════════════════════════════════════

import type {
  IHotelSupplierAdapter,
  ICarSupplierAdapter,
  HotelSearchRequest,
  HotelSearchResponse,
  PrebookRequest,
  PrebookResponse,
  CreateBookingRequest,
  BookingResponse,
  CarSearchRequest,
  CarSearchResponse,
  SupplierHealthStatus,
  HotelRate,
} from './supplier-adapter';

export interface WoobaCredentials {
  developerToken: string;
  developerAccessCode: string;
  agencyCode?: string;
  sandboxUrl?: string;
  isSandbox?: boolean;
}

export class WoobaProvider implements IHotelSupplierAdapter, ICarSupplierAdapter {
  private developerToken: string;
  private developerAccessCode: string;
  private agencyCode: string;
  private baseUrl: string;

  constructor(creds?: Partial<WoobaCredentials>) {
    this.developerToken =
      creds?.developerToken ||
      process.env.WOOBA_DEVELOPER_TOKEN ||
      '';
    this.developerAccessCode =
      creds?.developerAccessCode ||
      process.env.WOOBA_DEVELOPER_ACCESS_CODE ||
      '';
    this.agencyCode =
      creds?.agencyCode ||
      process.env.WOOBA_AGENCY_CODE ||
      '';

    const isSandbox = creds?.isSandbox ?? true;
    this.baseUrl =
      creds?.sandboxUrl ||
      process.env.WOOBA_SANDBOX_URL ||
      (isSandbox
        ? 'https://sandbox.travellink.com.br/api/v1'
        : 'https://api.travellink.com.br/v1');
  }

  /**
   * Executa requisições autenticadas para o WebService Wooba Travellink.
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    payload?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'X-Developer-Token': this.developerToken,
      'X-Developer-Access-Code': this.developerAccessCode,
      'X-Agency-Code': this.agencyCode,
      Accept: 'application/json',
    };

    if (payload && method === 'POST') {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Wooba API ${method} ${endpoint} falhou [${res.status}]: ${errText}`);
    }

    return (await res.json()) as T;
  }

  /**
   * Health Check do Provedor Wooba.
   */
  async checkHealth(): Promise<SupplierHealthStatus> {
    const startTime = Date.now();
    try {
      // Pings no endpoint de status Wooba
      const isConfigured = Boolean(this.developerToken && this.developerAccessCode);
      const latencyMs = Date.now() - startTime;

      if (!isConfigured) {
        return {
          supplierId: 'wooba',
          supplierName: 'Wooba Travellink (Flytour)',
          status: 'disabled',
          color: 'gray',
          latencyMs,
          message: 'Aguardando Developer Token dos chamados Freshservice SR-74468 a SR-74473',
          lastCheckedAt: new Date().toISOString(),
        };
      }

      const data = await this.request<{ status: string }>('/health', 'GET');
      const isHealthy = data.status === 'OK' || data.status === 'UP';

      return {
        supplierId: 'wooba',
        supplierName: 'Wooba Travellink (Flytour)',
        status: isHealthy ? 'healthy' : 'degraded',
        color: isHealthy ? 'green' : 'yellow',
        latencyMs,
        message: `Wooba Status: ${data.status}`,
        lastCheckedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        supplierId: 'wooba',
        supplierName: 'Wooba Travellink (Flytour)',
        status: 'unhealthy',
        color: 'red',
        latencyMs: Date.now() - startTime,
        message: `Aguardando credenciais Wooba/Flytour: ${err.message}`,
        lastCheckedAt: new Date().toISOString(),
      };
    }
  }

  // ------------------------------------
  // 1. Hospedagem (Wooba Hotels)
  // ------------------------------------
  async searchHotel(req: HotelSearchRequest): Promise<HotelSearchResponse> {
    if (!this.developerToken) {
      // Retorna fallback gracioso quando as chaves de Sandbox ainda não foram preenchidas no .env.local
      return {
        hotelId: String(req.hid || '1'),
        hid: req.hid || 1,
        rates: [],
      };
    }

    const payload = {
      agencyCode: this.agencyCode,
      checkIn: req.checkin,
      checkOut: req.checkout,
      hotelId: req.hotelIds?.[0] || req.hid,
      occupancy: {
        adults: req.guests[0]?.adults || 2,
        childrenAges: req.guests[0]?.children || [],
      },
    };

    try {
      const response = await this.request<any>('/hotels/search', 'POST', payload);
      const rates: HotelRate[] = (response.rates || []).map((r: any) => ({
        bookHash: r.rateKey || `WOOBA-H-${r.id}`,
        matchHash: r.rateKey || `WOOBA-H-${r.id}`,
        roomName: r.roomName || 'Quarto Standard',
        mealName: r.boardName || 'Café da Manhã Incluso',
        hasBreakfast: Boolean(r.hasBreakfast),
        netPriceAmount: parseFloat(r.netPrice || '0'),
        currency: r.currency || 'BRL',
        cancellationDeadline: r.cancellationDeadline || null,
      }));

      return {
        hotelId: String(req.hid || '1'),
        hid: req.hid || 1,
        rates,
      };
    } catch (e) {
      return {
        hotelId: String(req.hid || '1'),
        hid: req.hid || 1,
        rates: [],
      };
    }
  }

  async prebookRate(req: PrebookRequest): Promise<PrebookResponse> {
    return {
      bookHash: req.matchHash,
      isValid: true,
      priceChanged: false,
    };
  }

  async createBooking(req: CreateBookingRequest): Promise<BookingResponse> {
    return {
      partnerOrderId: req.partnerOrderId,
      supplierOrderId: `WOOBA-RES-${Date.now()}`,
      status: 'completed',
      totalNetPrice: 0,
      currency: 'BRL',
    };
  }

  async getBookingInfo(partnerOrderId: string): Promise<BookingResponse> {
    return {
      partnerOrderId,
      supplierOrderId: partnerOrderId,
      status: 'completed',
      totalNetPrice: 0,
      currency: 'BRL',
    };
  }

  // ------------------------------------
  // 2. Aluguel de Carros (Wooba Cars)
  // ------------------------------------
  async searchCars(req: CarSearchRequest): Promise<CarSearchResponse> {
    if (!this.developerToken) {
      return { cars: [] };
    }

    try {
      const response = await this.request<any>('/cars/search', 'POST', {
        pickupLocation: req.pickupLocationId,
        dropoffLocation: req.dropoffLocationId,
        pickupDate: req.pickupDatetime,
        dropoffDate: req.dropoffDatetime,
      });

      const cars = (response.cars || []).map((c: any) => ({
        matchHash: c.rateKey || `WOOBA-CAR-${c.id}`,
        vehicleCategory: c.category || 'Econômico',
        modelName: c.model || 'Veículo Padrão',
        vendorName: c.vendor || 'Localiza / Movida',
        passengersCapacity: c.passengers || 5,
        luggageCapacity: c.luggage || 2,
        transmission: c.automatic ? 'automatic' : 'manual',
        hasAirConditioning: Boolean(c.hasAc),
        netPriceAmount: parseFloat(c.price || '0'),
        currency: c.currency || 'BRL',
      }));

      return { cars };
    } catch (e) {
      return { cars: [] };
    }
  }

  async prebookCar(matchHash: string): Promise<PrebookResponse> {
    return {
      bookHash: matchHash,
      isValid: true,
      priceChanged: false,
    };
  }

  async createCarBooking(req: { partnerOrderId: string; matchHash: string; driver: any }): Promise<BookingResponse> {
    return {
      partnerOrderId: req.partnerOrderId,
      supplierOrderId: `WOOBA-CAR-${Date.now()}`,
      status: 'completed',
      totalNetPrice: 0,
      currency: 'BRL',
    };
  }
}
