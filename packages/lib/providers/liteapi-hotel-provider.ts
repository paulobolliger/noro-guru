// packages/lib/providers/liteapi-hotel-provider.ts

import {
  BaseSupplierCredentials,
  IHotelSupplierAdapter,
  HotelSearchRequest,
  HotelSearchResponse,
  PrebookRequest,
  PrebookResponse,
  CreateBookingRequest,
  BookingResponse,
  HotelRate,
} from './supplier-adapter';

export class LiteApiHotelProvider implements IHotelSupplierAdapter {
  private credentials: BaseSupplierCredentials;

  constructor(credentials?: Partial<BaseSupplierCredentials>) {
    this.credentials = {
      keyId: credentials?.keyId || process.env.LITEAPI_KEY || 'prod_b5135814-dda3-495c-856b-af03a55bd0a6',
      token: credentials?.token || '',
      baseUrl: credentials?.baseUrl || 'https://api.liteapi.travel/v3.0',
      isSandbox: credentials?.isSandbox ?? false,
    };
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.credentials.keyId,
    };
  }

  private async makeRequest<T>(endpoint: string, method: string = 'POST', payload?: any): Promise<T> {
    const url = `${this.credentials.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: this.getHeaders(),
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LiteAPI Error [${response.status}] ${endpoint}: ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  async checkHealth(): Promise<{ supplierId: string; supplierName: string; status: 'healthy' | 'degraded' | 'unhealthy' | 'disabled'; color: 'green' | 'yellow' | 'red' | 'gray'; latencyMs: number; message: string; lastCheckedAt: string }> {
    const startTime = Date.now();
    try {
      // Ping currencies endpoint for super fast response
      await this.makeRequest<any>('/data/currencies', 'GET');
      const latencyMs = Date.now() - startTime;
      const isDegraded = latencyMs > 2000;
      return {
        supplierId: 'liteapi',
        supplierName: 'LiteAPI (Nuitee)',
        status: isDegraded ? 'degraded' : 'healthy',
        color: isDegraded ? 'yellow' : 'green',
        latencyMs,
        message: isDegraded ? `High latency (${latencyMs}ms)` : `Operational (${latencyMs}ms)`,
        lastCheckedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        supplierId: 'liteapi',
        supplierName: 'LiteAPI (Nuitee)',
        status: 'unhealthy',
        color: 'red',
        latencyMs: Date.now() - startTime,
        message: err.message || 'API connection failed',
        lastCheckedAt: new Date().toISOString(),
      };
    }
  }

  async searchHotel(req: HotelSearchRequest): Promise<HotelSearchResponse> {
    // If searching by location or hotelIds
    let targetHotelIds = req.hotelIds || [];

    if (!targetHotelIds.length && req.hid) {
      targetHotelIds = [`hid_${req.hid}`];
    }

    if (!targetHotelIds.length) {
      return { hotelId: '', hid: req.hid || 0, rates: [] };
    }

    const payload = {
      hotelIds: targetHotelIds,
      checkin: req.checkin,
      checkout: req.checkout,
      currency: req.currency || 'USD',
      guestNationality: (req.residency || 'BR').toUpperCase(),
      occupancies: req.guests.map(g => ({
        adults: g.adults,
        children: g.children || [],
      })),
    };

    const res = await this.makeRequest<any>('/hotels/rates', 'POST', payload);
    const hotels = res?.data || [];

    if (!hotels.length) {
      return { hotelId: targetHotelIds[0], hid: req.hid || 0, rates: [] };
    }

    const firstHotel = hotels[0];
    const extractedRates: HotelRate[] = [];

    for (const roomType of firstHotel.roomTypes || []) {
      const rName = roomType.name || 'Standard Room';
      for (const rateObj of roomType.rates || []) {
        const board = rateObj.boardName || rateObj.meal || 'No Meal';
        const hasBreakfast = Boolean(
          rateObj.hasBreakfast ||
          board.toLowerCase().includes('breakfast') ||
          board.toLowerCase().includes('café')
        );

        const netObj = rateObj.netRate?.total?.[0] || {};
        const amount = parseFloat(netObj.amount || rateObj.price || rateObj.amount || '0');
        const currency = netObj.currency || rateObj.currency || 'USD';

        extractedRates.push({
          bookHash: rateObj.rateId || rateObj.offerId || rateObj.bookHash || '',
          matchHash: rateObj.rateId || rateObj.offerId || '',
          roomName: rName,
          mealName: board,
          hasBreakfast,
          netPriceAmount: amount,
          currency,
          cancellationDeadline: rateObj.cancellationPolicies?.cancelPolicyInfos?.[0]?.cancelTime || null,
        });
      }
    }

    return {
      hotelId: firstHotel.hotelId,
      hid: req.hid || 0,
      rates: extractedRates,
    };
  }

  async prebookRate(req: PrebookRequest): Promise<PrebookResponse> {
    const payload = {
      offerId: req.matchHash,
      usePaymentSdk: false,
    };

    const res = await this.makeRequest<any>('/rates/prebook', 'POST', payload);
    const data = res?.data || res;

    const newAmount = parseFloat(data?.netRate?.total?.[0]?.amount || data?.price || '0');

    return {
      bookHash: data?.prebookId || req.matchHash,
      isValid: true,
      priceChanged: false,
      newNetPriceAmount: newAmount > 0 ? newAmount : undefined,
    };
  }

  async createBooking(req: CreateBookingRequest): Promise<BookingResponse> {
    const firstRoom = req.rooms?.[0];
    const holder = firstRoom?.guests?.[0];

    const payload = {
      prebookId: req.bookHash,
      clientReference: req.partnerOrderId,
      holder: {
        firstName: holder?.firstName || 'Guest',
        lastName: holder?.lastName || 'NoroGuru',
        email: req.userEmail,
        phone: req.userPhone,
      },
      guests: req.rooms.flatMap(r =>
        r.guests.map(g => ({
          firstName: g.firstName,
          lastName: g.lastName,
        }))
      ),
    };

    const res = await this.makeRequest<any>('/rates/book', 'POST', payload);
    const booking = res?.data || res;

    return {
      partnerOrderId: req.partnerOrderId,
      supplierOrderId: String(booking?.bookingId || booking?.id || ''),
      status: 'completed',
      totalNetPrice: parseFloat(booking?.netRate?.total?.[0]?.amount || booking?.amount || '0'),
      currency: booking?.currency || 'USD',
    };
  }

  async getBookingInfo(partnerOrderId: string): Promise<BookingResponse> {
    const res = await this.makeRequest<any>(`/bookings/${partnerOrderId}`, 'GET');
    const booking = res?.data || res;

    return {
      partnerOrderId,
      supplierOrderId: String(booking?.bookingId || partnerOrderId),
      status: booking?.status === 'confirmed' || booking?.status === 'completed' ? 'completed' : 'processing',
      totalNetPrice: parseFloat(booking?.netRate?.total?.[0]?.amount || '0'),
      currency: booking?.currency || 'USD',
    };
  }
}
