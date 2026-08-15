// packages/lib/services/flightAggregatorService.ts

export interface FlightLeg {
  origin: string;
  destination: string;
  date: string; // YYYY-MM-DD
}

export interface FlightSearchQuery {
  legs: FlightLeg[];
  adults: number;
  children?: number;
  infants?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  currency?: string;
}

export interface AggregatedFlightOffer {
  supplierId: string;
  supplierName: string;
  offerId: string;
  expiration: string;
  pricing: {
    netPriceUsd: number;
    basePriceUsd: number;
    taxesUsd: number;
    finalPriceBrl?: number;
  };
  baggage: {
    hasCarryOnBag: boolean;
    hasCheckedBag: boolean;
    details: any[];
  };
}

export interface AggregatedFlightResult {
  route: string;
  cheapestSupplier: string;
  cheapestSupplierName: string;
  cheapestNetPriceUsd: number;
  totalOffersFound: number;
  offers: AggregatedFlightOffer[];
}

export class FlightAggregatorService {
  // Flight aggregator ready to plug LiteAPI, Travelfusion & Amadeus providers
  async searchAndAggregate(query: FlightSearchQuery, exchangeRateUsdToBrl: number = 5.60): Promise<AggregatedFlightResult> {
    const routeStr = query.legs.map(l => `${l.origin}->${l.destination}`).join(' | ');

    return {
      route: routeStr,
      cheapestSupplier: 'liteapi',
      cheapestSupplierName: 'LiteAPI (Nuitee)',
      cheapestNetPriceUsd: 0,
      totalOffersFound: 0,
      offers: [],
    };
  }
}
