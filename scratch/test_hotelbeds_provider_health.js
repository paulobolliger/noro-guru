const { HotelbedsProvider } = require('../packages/lib/dist');

async function main() {
  console.log('Testing HotelbedsProvider.checkHealth()...');
  const provider = new HotelbedsProvider();
  const health = await provider.checkHealth();
  console.log('=== HotelbedsProvider Health Status ===');
  console.log(JSON.stringify(health, null, 2));
}

main().catch(console.error);
