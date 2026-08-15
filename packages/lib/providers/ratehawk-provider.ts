// packages/lib/providers/ratehawk-provider.ts

import {
  BaseSupplierCredentials,
  IHotelSupplierAdapter,
  ICarSupplierAdapter,
  ITransferSupplierAdapter,
  HotelSearchRequest,
  HotelSearchResponse,
  PrebookRequest,
  PrebookResponse,
  CreateBookingRequest,
  BookingResponse,
  CarSearchRequest,
  CarSearchResponse,
  TransferSearchRequest,
  TransferSearchResponse,
  GuestInfo,
} from './supplier-adapter';

export class RateHawkProvider implements IHotelSupplierAdapter, ICarSupplierAdapter, ITransferSupplierAdapter {
  private credentials: BaseSupplierCredentials;

  constructor(credentials?: Partial<BaseSupplierCredentials>) {
    this.credentials = {
      keyId: credentials?.keyId || process.env.RATEHAWK_KEY_ID || '203',
      token: credentials?.token || process.env.RATEHAWK_TOKEN || '297ccc67-ef1d-4b0a-9421-43d4dce5423a',
      baseUrl: credentials?.baseUrl || (credentials?.isSandbox !== false 
        ? 'https://api-sandbox.worldota.net/api/b2b/v3' 
        : 'https://api.worldota.net/api/b2b/v3'),
      isSandbox: credentials?.isSandbox ?? true,
    };
  }

  private getAuthHeader(): string {
    const authString = `${this.credentials.keyId}:${this.credentials.token}`;
    const base64Auth = Buffer.from(authString).toString('base64');
    return `Basic ${base64Auth}`;
  }

  private async makeRequest<T>(endpoint: string, method: string = 'POST', payload?: any): Promise<T> {
    const url = `${this.credentials.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getAuthHeader(),
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`RateHawk API Error [${response.status}] ${endpoint}: ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  async checkHealth(): Promise<{ supplierId: string; supplierName: string; status: 'healthy' | 'degraded' | 'unhealthy' | 'disabled'; color: 'green' | 'yellow' | 'red' | 'gray'; latencyMs: number; message: string; lastCheckedAt: string }> {
    const startTime = Date.now();
    try {
      // Ping search endpoint with minimal payload or check auth
      await this.searchHotel({
        hid: 10004834,
        checkin: '2026-08-10',
        checkout: '2026-08-11',
        residency: 'uz',
        guests: [{ adults: 1 }],
      });
      const latencyMs = Date.now() - startTime;
      const isDegraded = latencyMs > 2500;
      return {
        supplierId: 'ratehawk',
        supplierName: 'RateHawk',
        status: isDegraded ? 'degraded' : 'healthy',
        color: isDegraded ? 'yellow' : 'green',
        latencyMs,
        message: isDegraded ? `High latency (${latencyMs}ms)` : `Operational (${latencyMs}ms)`,
        lastCheckedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        supplierId: 'ratehawk',
        supplierName: 'RateHawk',
        status: 'unhealthy',
        color: 'red',
        latencyMs: Date.now() - startTime,
        message: err.message || 'API connection failed',
        lastCheckedAt: new Date().toISOString(),
      };
    }
  }

  // ------------------------------------
  // 1. Hospedagem (Hotels)
  // ------------------------------------
  async searchHotel(req: HotelSearchRequest): Promise<HotelSearchResponse> {
    const payload = {
      hid: req.hid,
      id: req.hid ? undefined : req.hotelIds?.[0],
      checkin: req.checkin,
      checkout: req.checkout,
      residency: req.residency,
      language: req.language || 'en',
      guests: req.guests.map(g => ({
        adults: g.adults,
        children: g.children || [],
      })),
    };

    const res = await this.makeRequest<any>('/search/hp/', 'POST', payload);
    const hotel = res?.data?.hotels?.[0];

    if (!hotel) {
      return { hotelId: String(req.hid || req.hotelIds?.[0]), hid: req.hid || 0, rates: [] };
    }

    const rates = (hotel.rates || []).map((r: any) => ({
      bookHash: r.book_hash,
      matchHash: r.book_hash, // h- hash required by /hotel/prebook/
      roomName: r.room_name || 'Standard Room',
      mealName: r.meal_data?.value || r.meal || 'nomeal',
      hasBreakfast: r.meal_data?.has_breakfast || false,
      netPriceAmount: parseFloat(r.payment_options?.payment_types?.[0]?.amount || '0'),
      currency: r.payment_options?.payment_types?.[0]?.currency_code || 'USD',
    }));

    return {
      hotelId: hotel.id,
      hid: hotel.hid,
      rates,
    };
  }

  async prebookRate(req: PrebookRequest): Promise<PrebookResponse> {
    const payload = {
      hash: req.matchHash,
      price_increase_percent: req.priceIncreasePercent || 0,
    };

    const res = await this.makeRequest<any>('/hotel/prebook/', 'POST', payload);
    const hotel = res?.data?.hotels?.[0];
    const rate = hotel?.rates?.[0];

    if (!rate) {
      return { bookHash: '', isValid: false, priceChanged: false };
    }

    const newAmount = parseFloat(rate.payment_options?.payment_types?.[0]?.amount || '0');

    return {
      bookHash: rate.book_hash,
      isValid: true,
      priceChanged: false,
      newNetPriceAmount: newAmount,
    };
  }

  async createBooking(req: CreateBookingRequest): Promise<BookingResponse> {
    // A. Init Form
    const formPayload = {
      partner_order_id: req.partnerOrderId,
      book_hash: req.bookHash,
      language: 'en',
      user_ip: '127.0.0.1',
    };
    const formData = await this.makeRequest<any>('/hotel/order/booking/form/', 'POST', formPayload);
    const paymentInfo = formData?.data?.payment_types?.[0];

    // B. Finish Booking
    const finishPayload = {
      partner: {
        partner_order_id: req.partnerOrderId,
      },
      user: {
        email: req.userEmail,
        phone: req.userPhone,
      },
      language: 'en',
      rooms: req.rooms.map(r => ({
        guests: r.guests.map(g => ({
          first_name: g.firstName,
          last_name: g.lastName,
          is_child: g.isChild || false,
          age: g.age,
        })),
      })),
      payment_type: {
        type: paymentInfo?.type || 'deposit',
        amount: paymentInfo?.amount,
        currency_code: paymentInfo?.currency_code || 'USD',
      },
    };

    await this.makeRequest<any>('/hotel/order/booking/finish/', 'POST', finishPayload);

    // C. Poll Status
    let statusRes: any;
    for (let attempt = 0; attempt < 30; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      statusRes = await this.makeRequest<any>('/hotel/order/booking/finish/status/', 'POST', {
        partner_order_id: req.partnerOrderId,
      });

      if (statusRes?.status === 'ok') {
        break;
      }
      if (['error', 'soldout', 'cancelled', 'fail'].includes(statusRes?.status)) {
        throw new Error(`RateHawk Booking Failed with status: ${statusRes?.status}`);
      }
    }

    return {
      partnerOrderId: req.partnerOrderId,
      supplierOrderId: String(statusRes?.data?.order_id || formData?.data?.order_id || ''),
      status: 'completed',
      totalNetPrice: parseFloat(paymentInfo?.amount || '0'),
      currency: paymentInfo?.currency_code || 'USD',
    };
  }

  async getBookingInfo(partnerOrderId: string): Promise<BookingResponse> {
    const payload = {
      search: {
        partner_order_ids: [partnerOrderId],
      },
      ordering: {
        ordering_type: 'desc',
        ordering_by: 'created_at',
      },
      pagination: {
        page_size: 1,
        page_number: 1,
      },
    };

    const res = await this.makeRequest<any>('/hotel/order/info/', 'POST', payload);
    const order = res?.data?.orders?.[0];

    if (!order) {
      throw new Error(`Order not found for partner_order_id: ${partnerOrderId}`);
    }

    return {
      partnerOrderId,
      supplierOrderId: String(order.order_id),
      status: order.status === 'completed' ? 'completed' : 'processing',
      totalNetPrice: parseFloat(order.amount_payable?.amount || '0'),
      currency: order.amount_payable?.currency_code || 'USD',
    };
  }

  // ------------------------------------
  // 2. Aluguel de Carros (Car Rental)
  // ------------------------------------
  async searchCars(req: CarSearchRequest): Promise<CarSearchResponse> {
    const payload = {
      pickup_location_id: req.pickupLocationId,
      dropoff_location_id: req.dropoffLocationId,
      pickup_datetime: req.pickupDatetime,
      dropoff_datetime: req.dropoffDatetime,
      driver_age: req.driverAge,
      residency: req.residency,
      currency: req.currency || 'USD',
    };

    const res = await this.makeRequest<any>('/car/search/', 'POST', payload);
    const carsList = (res?.data?.cars || []).map((c: any) => ({
      matchHash: c.match_hash,
      vehicleCategory: c.category || 'Economy',
      modelName: c.model || 'Toyota Corolla or similar',
      vendorName: c.vendor || 'Hertz',
      passengersCapacity: c.passengers || 5,
      luggageCapacity: c.luggage || 2,
      transmission: c.transmission === 'automatic' ? 'automatic' : 'manual',
      hasAirConditioning: c.air_conditioning ?? true,
      netPriceAmount: parseFloat(c.amount || '0'),
      currency: c.currency || 'USD',
    }));

    return { cars: carsList };
  }

  async prebookCar(matchHash: string): Promise<PrebookResponse> {
    const res = await this.makeRequest<any>('/car/prebook/', 'POST', { match_hash: matchHash });
    return {
      bookHash: res?.data?.match_hash || matchHash,
      isValid: true,
      priceChanged: false,
      newNetPriceAmount: parseFloat(res?.data?.amount || '0'),
    };
  }

  async createCarBooking(req: { partnerOrderId: string; matchHash: string; driver: GuestInfo }): Promise<BookingResponse> {
    const payload = {
      match_hash: req.matchHash,
      partner_order_id: req.partnerOrderId,
      driver: {
        first_name: req.driver.firstName,
        last_name: req.driver.lastName,
      },
      payment_type: 'deposit',
    };

    const res = await this.makeRequest<any>('/car/order/book/', 'POST', payload);
    return {
      partnerOrderId: req.partnerOrderId,
      supplierOrderId: String(res?.data?.order_id || ''),
      status: 'completed',
      totalNetPrice: parseFloat(res?.data?.amount || '0'),
      currency: res?.data?.currency || 'USD',
    };
  }

  // ------------------------------------
  // 3. Traslados (Transfers)
  // ------------------------------------
  async searchTransfers(req: TransferSearchRequest): Promise<TransferSearchResponse> {
    const payload = {
      pickup_point: req.pickupPoint,
      dropoff_point: req.dropoffPoint,
      pickup_datetime: req.pickupDatetime,
      passengers: req.passengers,
      round_trip: req.roundTrip || false,
      currency: req.currency || 'USD',
    };

    const res = await this.makeRequest<any>('/transfer/search/', 'POST', payload);
    const list = (res?.data?.transfers || []).map((t: any) => ({
      matchHash: t.match_hash,
      vehicleType: t.vehicle_type || 'sedan',
      maxPassengers: t.max_passengers || 3,
      maxLuggage: t.max_luggage || 3,
      netPriceAmount: parseFloat(t.amount || '0'),
      currency: t.currency || 'USD',
      flightTrackingIncluded: t.flight_tracking ?? true,
    }));

    return { transfers: list };
  }

  async prebookTransfer(matchHash: string): Promise<PrebookResponse> {
    const res = await this.makeRequest<any>('/transfer/prebook/', 'POST', { match_hash: matchHash });
    return {
      bookHash: res?.data?.match_hash || matchHash,
      isValid: true,
      priceChanged: false,
      newNetPriceAmount: parseFloat(res?.data?.amount || '0'),
    };
  }

  async createTransferBooking(req: { partnerOrderId: string; matchHash: string; leadPassenger: GuestInfo; flightNumber?: string }): Promise<BookingResponse> {
    const payload = {
      match_hash: req.matchHash,
      partner_order_id: req.partnerOrderId,
      lead_passenger: {
        first_name: req.leadPassenger.firstName,
        last_name: req.leadPassenger.lastName,
      },
      flight_number: req.flightNumber,
      payment_type: 'deposit',
    };

    const res = await this.makeRequest<any>('/transfer/order/book/', 'POST', payload);
    return {
      partnerOrderId: req.partnerOrderId,
      supplierOrderId: String(res?.data?.order_id || ''),
      status: 'completed',
      totalNetPrice: parseFloat(res?.data?.amount || '0'),
      currency: res?.data?.currency || 'USD',
    };
  }
}
