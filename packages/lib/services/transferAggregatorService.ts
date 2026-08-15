// packages/lib/services/transferAggregatorService.ts

import {
  ITransferSupplierAdapter,
  TransferSearchRequest,
  TransferOption,
} from '../providers/supplier-adapter';
import { RateHawkProvider } from '../providers/ratehawk-provider';

export interface AggregatedTransferOption extends TransferOption {
  supplierId: string;
  supplierName: string;
}

export interface AggregatedTransferResult {
  pickupPointName?: string;
  dropoffPointName?: string;
  cheapestSupplier: string;
  cheapestNetPrice: number;
  totalTransfersFound: number;
  transfers: AggregatedTransferOption[];
}

export class TransferAggregatorService {
  private providers: Array<{ id: string; name: string; adapter: ITransferSupplierAdapter }>;

  constructor(customProviders?: Array<{ id: string; name: string; adapter: ITransferSupplierAdapter }>) {
    this.providers = customProviders || [
      { id: 'ratehawk', name: 'RateHawk', adapter: new RateHawkProvider() },
    ];
  }

  async searchAndAggregate(req: TransferSearchRequest): Promise<AggregatedTransferResult> {
    const searchPromises = this.providers.map(p =>
      p.adapter.searchTransfers(req).then(res => ({ supplierId: p.id, supplierName: p.name, res }))
    );

    const results = await Promise.allSettled(searchPromises);
    const allTransfers: AggregatedTransferOption[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { supplierId, supplierName, res } = result.value;
        for (const tr of res.transfers || []) {
          allTransfers.push({
            ...tr,
            supplierId,
            supplierName,
          });
        }
      }
    }

    allTransfers.sort((a, b) => a.netPriceAmount - b.netPriceAmount);
    const cheapest = allTransfers[0];

    return {
      pickupPointName: req.pickupPoint.name || req.pickupPoint.code,
      dropoffPointName: req.dropoffPoint.name || req.dropoffPoint.code,
      cheapestSupplier: cheapest?.supplierId || 'none',
      cheapestNetPrice: cheapest?.netPriceAmount || 0,
      totalTransfersFound: allTransfers.length,
      transfers: allTransfers,
    };
  }
}
