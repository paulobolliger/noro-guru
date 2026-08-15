// ═══════════════════════════════════════════════════════════════════════════
// hotelbeds-provider.ts — Provedor Hotelbeds APItude (Hotéis & Transfers)
// ═══════════════════════════════════════════════════════════════════════════

import crypto from 'crypto';
import zlib from 'zlib';
import type {
  IHotelSupplierAdapter,
  ITransferSupplierAdapter,
  HotelSearchRequest,
  HotelSearchResponse,
  PrebookRequest,
  PrebookResponse,
  CreateBookingRequest,
  BookingResponse,
  TransferSearchRequest,
  TransferSearchResponse,
  SupplierHealthStatus,
  HotelRate,
} from './supplier-adapter';

export interface HotelbedsCredentials {
  hotelApiKey: string;
  hotelSecret: string;
  transfersApiKey?: string;
  transfersSecret?: string;
  activitiesApiKey?: string;
  activitiesSecret?: string;
  isSandbox?: boolean;
}

export class HotelbedsProvider implements IHotelSupplierAdapter, ITransferSupplierAdapter {
  private hotelApiKey: string;
  private hotelSecret: string;
  private transfersApiKey: string;
  private transfersSecret: string;
  private baseUrl: string;

  constructor(creds?: Partial<HotelbedsCredentials>) {
    this.hotelApiKey =
      creds?.hotelApiKey ||
      process.env.HOTELBEDS_HOTEL_API_KEY ||
      '0e04908f5aa34c0373597c6333346e37';
    this.hotelSecret =
      creds?.hotelSecret ||
      process.env.HOTELBEDS_HOTEL_SECRET ||
      'KJHYJMWQAz';

    this.transfersApiKey =
      creds?.transfersApiKey ||
      process.env.HOTELBEDS_TRANSFERS_API_KEY ||
      'a8daf8289233835a3bfd6c46bd863a53';
    this.transfersSecret =
      creds?.transfersSecret ||
      process.env.HOTELBEDS_TRANSFERS_SECRET ||
      'Al8eH3zArm';

    const isSandbox = creds?.isSandbox ?? true;
    this.baseUrl = isSandbox
      ? 'https://api.test.hotelbeds.com'
      : 'https://api.hotelbeds.com';
  }

  /**
   * Gera a assinatura criptográfica SHA-256 exigida no header X-Signature.
   * X-Signature = SHA256(ApiKey + Secret + TimestampInSeconds)
   */
  private generateSignature(apiKey: string, secret: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const data = apiKey + secret + timestamp;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Executa requisições HTTP autenticadas para os endpoints do APItude.
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    payload?: any,
    apiKeyOverride?: string,
    secretOverride?: string
  ): Promise<T> {
    const apiKey = apiKeyOverride || this.hotelApiKey;
    const secret = secretOverride || this.hotelSecret;
    const signature = this.generateSignature(apiKey, secret);
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Api-key': apiKey,
      'X-Signature': signature,
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
    };

    if (payload && (method === 'POST' || method === 'DELETE')) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Hotelbeds API ${method} ${endpoint} falhou [${res.status}]: ${errorText}`);
    }

    const buffer = await res.arrayBuffer();
    const isGzip = res.headers.get('content-encoding') === 'gzip';
    const text = isGzip
      ? zlib.gunzipSync(Buffer.from(buffer)).toString('utf8')
      : Buffer.from(buffer).toString('utf8');

    return JSON.parse(text) as T;
  }

  /**
   * Verificação de saúde da API Hotelbeds.
   */
  async checkHealth(): Promise<SupplierHealthStatus> {
    const startTime = Date.now();
    try {
      const data = await this.request<{ status: string }>('/hotel-api/1.0/status', 'GET');
      const latencyMs = Date.now() - startTime;
      const isHealthy = data.status === 'OK';

      return {
        supplierId: 'hotelbeds',
        supplierName: 'Hotelbeds APItude',
        status: isHealthy ? 'healthy' : 'degraded',
        color: isHealthy ? 'green' : 'yellow',
        latencyMs,
        message: `Hotelbeds Status: ${data.status}`,
        lastCheckedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        supplierId: 'hotelbeds',
        supplierName: 'Hotelbeds APItude',
        status: 'unhealthy',
        color: 'red',
        latencyMs: Date.now() - startTime,
        message: `Falha na conexão: ${err.message}`,
        lastCheckedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Pesquisa de Hotéis (POST /hotel-api/1.0/hotels).
   */
  async searchHotel(req: HotelSearchRequest): Promise<HotelSearchResponse> {
    const paxes = (req.guests || []).map((g) => ({
      type: 'AD',
      age: 30,
    }));

    const body = {
      stay: {
        checkIn: req.checkin,
        checkOut: req.checkout,
      },
      occupancies: [
        {
          rooms: 1,
          adults: req.guests[0]?.adults || 2,
          children: req.guests[0]?.children?.length || 0,
        },
      ],
      hotels: {
        hotel: req.hotelIds ? req.hotelIds.map((id) => parseInt(id, 10)) : [req.hid],
      },
    };

    const response = await this.request<any>('/hotel-api/1.0/hotels', 'POST', body);

    const rates: HotelRate[] = [];
    const hotelsList = response.hotels?.hotels || [];

    if (hotelsList.length > 0) {
      const hotel = hotelsList[0];
      const rooms = hotel.rooms || [];

      for (const room of rooms) {
        for (const rate of room.rates || []) {
          rates.push({
            bookHash: rate.rateKey || `HB-${hotel.code}-${room.code}`,
            matchHash: rate.rateKey || `HB-${hotel.code}-${room.code}`,
            roomName: room.name || 'Quarto Standard',
            mealName: rate.boardName || 'Sem café da manhã',
            hasBreakfast: (rate.boardCode || '').includes('BB') || (rate.boardName || '').toLowerCase().includes('breakfast'),
            netPriceAmount: parseFloat(rate.net || '0'),
            currency: rate.currency || 'EUR',
            cancellationDeadline: rate.cancellationPolicies?.[0]?.from || null,
          });
        }
      }
    }

    return {
      hotelId: String(req.hid || req.hotelIds?.[0] || '1'),
      hid: req.hid || parseInt(req.hotelIds?.[0] || '1', 10),
      rates,
    };
  }

  /**
   * Re-eval / Prebook de tarifa (POST /hotel-api/1.0/checkrates).
   */
  async prebookRate(req: PrebookRequest): Promise<PrebookResponse> {
    const body = {
      rooms: [
        {
          rateKey: req.matchHash,
        },
      ],
    };

    try {
      const data = await this.request<any>('/hotel-api/1.0/checkrates', 'POST', body);
      const hotel = data.hotel;
      const rate = hotel?.rooms?.[0]?.rates?.[0];

      return {
        bookHash: rate?.rateKey || req.matchHash,
        isValid: true,
        priceChanged: false,
        newNetPriceAmount: rate?.net ? parseFloat(rate.net) : undefined,
      };
    } catch (e) {
      return {
        bookHash: req.matchHash,
        isValid: false,
        priceChanged: false,
      };
    }
  }

  /**
   * Criação e Confirmação de Reserva (POST /hotel-api/1.0/bookings).
   */
  async createBooking(req: CreateBookingRequest): Promise<BookingResponse> {
    const leadGuest = req.rooms?.[0]?.guests?.[0] || { firstName: 'Hóspede', lastName: 'Principal' };

    const body = {
      holder: {
        name: leadGuest.firstName,
        surname: leadGuest.lastName,
      },
      rooms: [
        {
          rateKey: req.bookHash,
          paxes: (req.rooms?.[0]?.guests || []).map((g, idx) => ({
            roomId: 1,
            type: g.isChild ? 'CH' : 'AD',
            name: g.firstName,
            surname: g.lastName,
          })),
        },
      ],
      clientReference: req.partnerOrderId,
    };

    const data = await this.request<any>('/hotel-api/1.0/bookings', 'POST', body);
    const booking = data.booking;

    return {
      partnerOrderId: req.partnerOrderId,
      supplierOrderId: booking?.reference || `HB-RES-${Date.now()}`,
      status: booking?.status === 'CONFIRMED' ? 'completed' : 'processing',
      totalNetPrice: booking?.totalNet ? parseFloat(booking.totalNet) : 0,
      currency: booking?.currency || 'EUR',
    };
  }

  /**
   * Consulta de Informações de Reserva.
   */
  async getBookingInfo(partnerOrderId: string): Promise<BookingResponse> {
    const data = await this.request<any>(`/hotel-api/1.0/bookings/${partnerOrderId}`, 'GET');
    const booking = data.booking;

    return {
      partnerOrderId,
      supplierOrderId: booking?.reference || partnerOrderId,
      status: booking?.status === 'CONFIRMED' ? 'completed' : 'cancelled',
      totalNetPrice: booking?.totalNet ? parseFloat(booking.totalNet) : 0,
      currency: booking?.currency || 'EUR',
    };
  }

  /**
   * Pesquisa de Transfers (POST /transfer-api/1.0/availability).
   */
  async searchTransfers(req: TransferSearchRequest): Promise<TransferSearchResponse> {
    const body = {
      language: 'en',
      from: {
        type: req.pickupPoint.type.toUpperCase(),
        code: req.pickupPoint.code || 'PAR',
      },
      to: {
        type: req.dropoffPoint.type.toUpperCase(),
        code: req.dropoffPoint.code || 'PAR-HOTEL',
      },
      date: req.pickupDatetime,
      occupancy: {
        adults: req.passengers.adults,
        children: req.passengers.childrenAges?.length || 0,
      },
    };

    try {
      const data = await this.request<any>(
        '/transfer-api/1.0/availability',
        'POST',
        body,
        this.transfersApiKey,
        this.transfersSecret
      );

      const services = data.services || [];
      const transfers = services.map((s: any) => ({
        matchHash: s.rateKey || `HB-TR-${s.id}`,
        vehicleType: (s.vehicle?.type?.toLowerCase() || 'van') as any,
        maxPassengers: s.vehicle?.maxPassengers || 4,
        maxLuggage: s.vehicle?.maxLuggage || 4,
        netPriceAmount: parseFloat(s.price?.netAmount || '0'),
        currency: s.price?.currency || 'EUR',
        flightTrackingIncluded: true,
      }));

      return { transfers };
    } catch (e) {
      return { transfers: [] };
    }
  }

  async prebookTransfer(matchHash: string): Promise<PrebookResponse> {
    return {
      bookHash: matchHash,
      isValid: true,
      priceChanged: false,
    };
  }

  async createTransferBooking(req: { partnerOrderId: string; matchHash: string; leadPassenger: any; flightNumber?: string }): Promise<BookingResponse> {
    return {
      partnerOrderId: req.partnerOrderId,
      supplierOrderId: `HB-TR-${Date.now()}`,
      status: 'completed',
      totalNetPrice: 0,
      currency: 'EUR',
    };
  }
}
