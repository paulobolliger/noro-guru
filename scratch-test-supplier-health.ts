import { HotelAggregatorService } from './packages/lib/services/hotelAggregatorService';

async function main() {
  console.log("🚦 Testing Supplier Health Check & Color Status Indicators...");

  const aggregator = new HotelAggregatorService();
  const healthResults = await aggregator.checkAllSuppliersHealth();

  console.log("\n=== SUPPLIER HEALTH STATUS SEMÁFORO ===");
  healthResults.forEach(h => {
    const indicator = h.color === 'green' ? '🟢 GREEN' : h.color === 'yellow' ? '🟡 YELLOW' : h.color === 'red' ? '🔴 RED' : '⚪ GRAY';
    console.log(`[${indicator}] ${h.supplierName} (${h.supplierId})`);
    console.log(`  Status: ${h.status.toUpperCase()}`);
    console.log(`  Latency: ${h.latencyMs} ms`);
    console.log(`  Message: ${h.message}`);
    console.log(`  Last Checked: ${h.lastCheckedAt}\n`);
  });
}

main().catch(err => {
  console.error("Health test failed:", err);
});
