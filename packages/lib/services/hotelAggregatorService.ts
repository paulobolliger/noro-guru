// packages/lib/services/hotelAggregatorService.ts

import {
  IHotelSupplierAdapter,
  HotelSearchRequest,
  HotelRate,
} from '../providers/supplier-adapter';
import { RateHawkProvider } from '../providers/ratehawk-provider';
import { LiteApiHotelProvider } from '../providers/liteapi-hotel-provider';
import { calculatePrice } from '../pricing-engine/engine';
import { createInMemoryDeps } from '../pricing-engine/in-memory-deps';

export interface AggregatedRate extends HotelRate {
  supplierId: 'ratehawk' | 'liteapi' | string;
  supplierName: string;
  calculatedPriceBrl?: {
    netPriceBrl: number;
    finalPriceBrl: number;
    markupAmountBrl: number;
  };
}

export interface AggregatedHotelResult {
  hotelId: string;
  hid?: number;
  cheapestSupplier: string;
  cheapestSupplierName: string;
  cheapestNetPrice: number;
  cheapestCurrency: string;
  totalRatesFound: number;
  rates: AggregatedRate[];
}

export class HotelAggregatorService {
  private providers: Array<{ id: string; name: string; adapter: IHotelSupplierAdapter }>;

  constructor(customProviders?: Array<{ id: string; name: string; adapter: IHotelSupplierAdapter }>) {
    this.providers = customProviders || [
      { id: 'ratehawk', name: 'RateHawk', adapter: new RateHawkProvider() },
      { id: 'liteapi', name: 'LiteAPI (Nuitee)', adapter: new LiteApiHotelProvider() },
    ];
  }

  async checkAllSuppliersHealth() {
    const healthPromises = this.providers.map(async p => {
      if (p.adapter.checkHealth) {
        return p.adapter.checkHealth();
      }
      return {
        supplierId: p.id,
        supplierName: p.name,
        status: 'healthy' as const,
        color: 'green' as const,
        latencyMs: 0,
        message: 'Operational',
        lastCheckedAt: new Date().toISOString(),
      };
    });

    const results = await Promise.all(healthPromises);
    return results;
  }

  async searchAndAggregate(req: HotelSearchRequest, pricingOptions?: {
    exchangeRateUsdToBrl?: number;
    tenantMarkupPercent?: number;
  }): Promise<AggregatedHotelResult> {
    const exchangeRate = pricingOptions?.exchangeRateUsdToBrl || 5.60;
    const deps = createInMemoryDeps({
      exchangeRates: {
        USD: exchangeRate,
      },
    });

    // 1. Run parallel searches across all enabled supplier adapters
    const searchPromises = this.providers.map(p =>
      p.adapter.searchHotel(req).then(res => ({ supplierId: p.id, supplierName: p.name, res }))
    );

    const results = await Promise.allSettled(searchPromises);

    const allRates: AggregatedRate[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { supplierId, supplierName, res } = result.value;
        for (const r of res.rates || []) {
          try {
            const pricingRes = await calculatePrice({
              tenantId: 'default_tenant',
              netPrice: r.netPriceAmount,
              netCurrency: (r.currency as 'USD' | 'BRL') || 'USD',
              category: 'hotel',
              acquirer: 'asaas',
              paymentMethod: 'credit_master',
              installments: 1,
            }, deps);

            allRates.push({
              ...r,
              supplierId,
              supplierName,
              calculatedPriceBrl: {
                netPriceBrl: r.netPriceAmount * exchangeRate,
                finalPriceBrl: pricingRes.finalPrice,
                markupAmountBrl: pricingRes.markupAmount,
              },
            });
          } catch (e) {
            allRates.push({
              ...r,
              supplierId,
              supplierName,
              calculatedPriceBrl: {
                netPriceBrl: r.netPriceAmount * exchangeRate,
                finalPriceBrl: r.netPriceAmount * exchangeRate * 1.12,
                markupAmountBrl: r.netPriceAmount * exchangeRate * 0.12,
              },
            });
          }
        }
      } else {
        console.warn(`[HotelAggregatorService] Supplier search failed:`, result.reason);
      }
    }

    // 2. Sort rates by net price ascending to find the absolute cheapest rate
    allRates.sort((a, b) => a.netPriceAmount - b.netPriceAmount);

    const cheapestRate = allRates[0];

    return {
      hotelId: String(req.hid || req.hotelIds?.[0] || 'aggregated_hotel'),
      hid: req.hid,
      cheapestSupplier: cheapestRate?.supplierId || 'none',
      cheapestSupplierName: cheapestRate?.supplierName || 'None',
      cheapestNetPrice: cheapestRate?.netPriceAmount || 0,
      cheapestCurrency: cheapestRate?.currency || 'USD',
      totalRatesFound: allRates.length,
      rates: allRates,
    };
  }
}
