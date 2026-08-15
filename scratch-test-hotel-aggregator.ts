import { HotelAggregatorService } from './packages/lib/services/hotelAggregatorService';

async function main() {
  console.log("🚀 Testing Multi-Supplier HotelAggregatorService (RateHawk + LiteAPI Production)...");

  const aggregator = new HotelAggregatorService();

  console.log("\n[1/2] Dispatching parallel search to RateHawk & LiteAPI...");
  const result = await aggregator.searchAndAggregate({
    hid: 10004834, // Conrad Los Angeles
    checkin: '2026-08-10',
    checkout: '2026-08-15',
    residency: 'uz',
    guests: [
      { adults: 2, children: [] }
    ]
  }, {
    exchangeRateUsdToBrl: 5.60,
  });

  console.log("\n=== MULTI-SUPPLIER AGGREGATION RESULT ===");
  console.log(`Total Rates Found Across All Suppliers: ${result.totalRatesFound}`);
  console.log(`🏆 WINNING SUPPLIER (Cheapest Rate): ${result.cheapestSupplierName} (${result.cheapestSupplier})`);
  console.log(`🏆 CHEAPEST NET PRICE: $${result.cheapestNetPrice} ${result.cheapestCurrency}`);

  console.log("\n--- Top 5 Lowest Rates Across Suppliers ---");
  result.rates.slice(0, 5).forEach((r, idx) => {
    console.log(`\nOption #${idx + 1} [Supplier: ${r.supplierName}]`);
    console.log(`  Room: ${r.roomName}`);
    console.log(`  Meal Plan: ${r.mealName} (Breakfast: ${r.hasBreakfast ? 'YES' : 'NO'})`);
    console.log(`  NET Price (USD): $${r.netPriceAmount} ${r.currency}`);
    if (r.calculatedPriceBrl) {
      console.log(`  NET Price (BRL): R$ ${r.calculatedPriceBrl.netPriceBrl.toFixed(2)}`);
      console.log(`  Final Client Price BRL (via Pricing Engine): R$ ${r.calculatedPriceBrl.finalPriceBrl.toFixed(2)}`);
      console.log(`  Tenant Profit Margin: R$ ${r.calculatedPriceBrl.markupAmountBrl.toFixed(2)}`);
    }
  });
}

main().catch(err => {
  console.error("Test failed:", err);
});
