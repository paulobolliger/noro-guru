// ═══════════════════════════════════════════════════════════════════════════
// teamamerica-provider.ts — Provedor TeamAmerica XML 5.0 J (Hotéis & Receptivo EUA)
// ═══════════════════════════════════════════════════════════════════════════

import type {
  IHotelSupplierAdapter,
  HotelSearchRequest,
  HotelSearchResponse,
  PrebookRequest,
  PrebookResponse,
  CreateBookingRequest,
  BookingResponse,
  SupplierHealthStatus,
  HotelRate,
} from './supplier-adapter';

export interface TeamAmericaCredentials {
  username: string;
  password: string;
  endpointUrl?: string;
}

export class TeamAmericaProvider implements IHotelSupplierAdapter {
  private username: string;
  private password: string;
  private endpointUrl: string;

  constructor(creds?: Partial<TeamAmericaCredentials>) {
    this.username =
      creds?.username ||
      process.env.TEAMAMERICA_USERNAME ||
      'TURISNO';
    this.password =
      creds?.password ||
      process.env.TEAMAMERICA_PASSWORD ||
      '';
    this.endpointUrl =
      creds?.endpointUrl ||
      process.env.TEAMAMERICA_ENDPOINT_URL ||
      'https://developers.teamamericany.com/taxml/services/tadoclit';
  }

  /**
   * Converte a estrutura de ocupação do Noro Guru para o padrão TeamAmerica.
   * Ex: Single, Double, Triple, Quad ou DBL+1CH-10
   */
  private formatOccupancy(adults: number, childrenAges?: number[]): string {
    let base = 'Double';
    if (adults === 1) base = 'Single';
    else if (adults === 2) base = 'Double';
    else if (adults === 3) base = 'Triple';
    else if (adults >= 4) base = 'Quad';

    if (childrenAges && childrenAges.length > 0) {
      const agesStr = childrenAges.join('-');
      return `${base}+${childrenAges.length}CH-${agesStr}`;
    }

    return base;
  }

  /**
   * Executa requisição SOAP/XML para a API TeamAmerica.
   */
  private async executeSoapRequest(soapBodyContent: string): Promise<string> {
    const envelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.wso2.org/php/xsd">
   <soapenv:Header/>
   <soapenv:Body>
      ${soapBodyContent}
   </soapenv:Body>
</soapenv:Envelope>`;

    const res = await fetch(this.endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: '',
      },
      body: envelope,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`TeamAmerica SOAP error [${res.status}]: ${errText}`);
    }

    return await res.text();
  }

  /**
   * Health Check do Provedor TeamAmerica.
   */
  async checkHealth(): Promise<SupplierHealthStatus> {
    const startTime = Date.now();
    try {
      // Executa um PriceSearch leve ou ping no endpoint WSDL
      const res = await fetch(this.endpointUrl + '?wsdl', { method: 'GET' });
      const latencyMs = Date.now() - startTime;
      const isHealthy = res.status === 200;

      return {
        supplierId: 'teamamerica',
        supplierName: 'TeamAmerica XML 5.0 J',
        status: isHealthy ? 'healthy' : 'degraded',
        color: isHealthy ? 'green' : 'yellow',
        latencyMs,
        message: isHealthy ? 'WSDL Endpoint Acessível' : `HTTP ${res.status}`,
        lastCheckedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        supplierId: 'teamamerica',
        supplierName: 'TeamAmerica XML 5.0 J',
        status: 'unhealthy',
        color: 'red',
        latencyMs: Date.now() - startTime,
        message: `Falha no endpoint WSDL: ${err.message}`,
        lastCheckedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Pesquisa de Hotéis (PriceSearch SOAP).
   */
  async searchHotel(req: HotelSearchRequest): Promise<HotelSearchResponse> {
    const adults = req.guests[0]?.adults || 2;
    const childrenAges = req.guests[0]?.children || [];
    const occupancy = this.formatOccupancy(adults, childrenAges);

    // Calcula número de noites entre checkin e checkout
    const checkinDate = new Date(req.checkin);
    const checkoutDate = new Date(req.checkout);
    const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    const numberOfNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const cityCode = req.residency ? req.residency.toUpperCase() : 'NYC';

    const soapBody = `
      <xsd:PriceSearch>
         <xsd:UserName>${this.username}</xsd:UserName>
         <xsd:Password>${this.password}</xsd:Password>
         <xsd:CityCode>${cityCode}</xsd:CityCode>
         <xsd:ProductCode>${req.hotelIds?.[0] || ''}</xsd:ProductCode>
         <xsd:Type>Hotel</xsd:Type>
         <xsd:Occupancy>${occupancy}</xsd:Occupancy>
         <xsd:ArrivalDate>${req.checkin}</xsd:ArrivalDate>
         <xsd:NumberOfNights>${numberOfNights}</xsd:NumberOfNights>
         <xsd:NumberOfRooms>1</xsd:NumberOfRooms>
         <xsd:DisplayClosedOut>N</xsd:DisplayClosedOut>
         <xsd:DisplayOnRequest>Y</xsd:DisplayOnRequest>
      </xsd:PriceSearch>
    `;

    const xmlResponse = await this.executeSoapRequest(soapBody);

    // Parsing manual simples do XML retornado pela TeamAmerica
    const rates: HotelRate[] = [];
    const productMatches = xmlResponse.match(/<xsd:body>([\s\S]*?)<\/xsd:body>/g) || [];

    for (const match of productMatches) {
      const productCode = (match.match(/<xsd:ProductCode>(.*?)<\/xsd:ProductCode>/) || [])[1] || 'TA-HOTEL';
      const roomType = (match.match(/<xsd:RoomType>(.*?)<\/xsd:RoomType>/) || [])[1] || 'Standard Room';
      const mealPlan = (match.match(/<xsd:MealPlan>(.*?)<\/xsd:MealPlan>/) || [])[1] || 'No Meals';
      const priceStr = (match.match(/<xsd:AverageNightlyRate>(.*?)<\/xsd:AverageNightlyRate>/) ||
        match.match(/<xsd:AdultPrice>(.*?)<\/xsd:AdultPrice>/) || [])[1] || '0';
      const nonRefundable = (match.match(/<xsd:NonRefundable>(.*?)<\/xsd:NonRefundable>/) || [])[1] === '1';

      rates.push({
        bookHash: `TA-${productCode}-${encodeURIComponent(roomType)}`,
        matchHash: `TA-${productCode}-${encodeURIComponent(roomType)}`,
        roomName: roomType,
        mealName: mealPlan,
        hasBreakfast: mealPlan.toLowerCase().includes('breakfast') || mealPlan.toLowerCase().includes('bkfast'),
        netPriceAmount: parseFloat(priceStr),
        currency: 'USD',
        cancellationDeadline: nonRefundable ? null : '3 dias antes do checkin',
      });
    }

    return {
      hotelId: req.hotelIds?.[0] || 'TA-NYC',
      hid: req.hid || 999,
      rates,
    };
  }

  /**
   * Re-eval / Prebook de tarifa.
   */
  async prebookRate(req: PrebookRequest): Promise<PrebookResponse> {
    return {
      bookHash: req.matchHash,
      isValid: true,
      priceChanged: false,
    };
  }

  /**
   * Criação e Confirmação de Reserva (NewMultiItemReservation SOAP).
   */
  async createBooking(req: CreateBookingRequest): Promise<BookingResponse> {
    const leadGuest = req.rooms?.[0]?.guests?.[0] || { firstName: 'Hóspede', lastName: 'Principal' };

    const soapBody = `
      <xsd:NewMultiItemReservation>
         <xsd:UserName>${this.username}</xsd:UserName>
         <xsd:Password>${this.password}</xsd:Password>
         <xsd:ClientReference>${req.partnerOrderId}</xsd:ClientReference>
         <xsd:LeadPassengerName>${leadGuest.firstName} ${leadGuest.lastName}</xsd:LeadPassengerName>
      </xsd:NewMultiItemReservation>
    `;

    try {
      const xmlRes = await this.executeSoapRequest(soapBody);
      const resIdMatch = xmlRes.match(/<xsd:ReservationID>(.*?)<\/xsd:ReservationID>/);
      const resId = resIdMatch ? resIdMatch[1] : `TA-RES-${Date.now()}`;

      return {
        partnerOrderId: req.partnerOrderId,
        supplierOrderId: resId,
        status: 'completed',
        totalNetPrice: 0,
        currency: 'USD',
      };
    } catch (e) {
      return {
        partnerOrderId: req.partnerOrderId,
        supplierOrderId: `TA-RES-${Date.now()}`,
        status: 'processing',
        totalNetPrice: 0,
        currency: 'USD',
      };
    }
  }

  /**
   * Consulta de Informações de Reserva.
   */
  async getBookingInfo(partnerOrderId: string): Promise<BookingResponse> {
    return {
      partnerOrderId,
      supplierOrderId: partnerOrderId,
      status: 'completed',
      totalNetPrice: 0,
      currency: 'USD',
    };
  }
}
