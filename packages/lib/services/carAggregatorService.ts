// packages/lib/services/carAggregatorService.ts

import {
  ICarSupplierAdapter,
  CarSearchRequest,
  CarRate,
} from '../providers/supplier-adapter';
import { RateHawkProvider } from '../providers/ratehawk-provider';

export interface AggregatedCarRate extends CarRate {
  supplierId: string;
  supplierName: string;
}

export interface AggregatedCarResult {
  pickupLocationId: string;
  dropoffLocationId: string;
  cheapestSupplier: string;
  cheapestNetPrice: number;
  totalCarsFound: number;
  cars: AggregatedCarRate[];
}

export class CarAggregatorService {
  private providers: Array<{ id: string; name: string; adapter: ICarSupplierAdapter }>;

  constructor(customProviders?: Array<{ id: string; name: string; adapter: ICarSupplierAdapter }>) {
    this.providers = customProviders || [
      { id: 'ratehawk', name: 'RateHawk', adapter: new RateHawkProvider() },
    ];
  }

  async searchAndAggregate(req: CarSearchRequest): Promise<AggregatedCarResult> {
    const searchPromises = this.providers.map(p =>
      p.adapter.searchCars(req).then(res => ({ supplierId: p.id, supplierName: p.name, res }))
    );

    const results = await Promise.allSettled(searchPromises);
    const allCars: AggregatedCarRate[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { supplierId, supplierName, res } = result.value;
        for (const car of res.cars || []) {
          allCars.push({
            ...car,
            supplierId,
            supplierName,
          });
        }
      }
    }

    allCars.sort((a, b) => a.netPriceAmount - b.netPriceAmount);
    const cheapest = allCars[0];

    return {
      pickupLocationId: req.pickupLocationId,
      dropoffLocationId: req.dropoffLocationId,
      cheapestSupplier: cheapest?.supplierId || 'none',
      cheapestNetPrice: cheapest?.netPriceAmount || 0,
      totalCarsFound: allCars.length,
      cars: allCars,
    };
  }
}
