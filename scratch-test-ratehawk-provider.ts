import { RateHawkProvider } from './packages/lib/providers/ratehawk-provider';

async function main() {
  console.log("🚀 Testing RateHawkProvider TypeScript integration...");

  const provider = new RateHawkProvider({
    keyId: '203',
    token: '297ccc67-ef1d-4b0a-9421-43d4dce5423a',
    isSandbox: true,
  });

  // 1. Search
  console.log("\n[1/3] Executing searchHotel...");
  const searchRes = await provider.searchHotel({
    hid: 10004834,
    checkin: '2026-07-29',
    checkout: '2026-08-01',
    residency: 'uz',
    guests: [
      { adults: 2, children: [5] },
      { adults: 2, children: [] },
    ],
  });

  console.log(`Found ${searchRes.rates.length} rates for hotel ${searchRes.hotelId} (HID ${searchRes.hid})`);
  if (!searchRes.rates.length) {
    console.error("No rates found!");
    return;
  }

  const rate = searchRes.rates[0];
  console.log(`Selected Rate NET: ${rate.netPriceAmount} ${rate.currency}`);

  // 2. Prebook
  console.log("\n[2/3] Executing prebookRate...");
  const prebookRes = await provider.prebookRate({
    matchHash: rate.matchHash,
    priceIncreasePercent: 0,
  });
  console.log(`Prebook result: isValid=${prebookRes.isValid}, bookHash=${prebookRes.bookHash}`);

  // 3. Create Booking
  console.log("\n[3/3] Executing createBooking (Form -> Finish -> Status Polling)...");
  const partnerOrderId = `NORO-TS-${Math.floor(100000 + Math.random() * 900000)}`;
  const bookingRes = await provider.createBooking({
    partnerOrderId,
    bookHash: prebookRes.bookHash,
    userEmail: 'corporate-agency@noroguru.com',
    userPhone: '+5511999999999',
    rooms: [
      {
        guests: [
          { firstName: 'Paulo', lastName: 'Bolliger' },
          { firstName: 'Maria', lastName: 'Bolliger' },
          { firstName: 'Pedro', lastName: 'Bolliger', isChild: true, age: 5 },
        ],
      },
      {
        guests: [
          { firstName: 'Jose', lastName: 'Silva' },
          { firstName: 'Ana', lastName: 'Silva' },
        ],
      },
    ],
  });

  console.log("\n🎉 BOOKING COMPLETE VIA RateHawkProvider!");
  console.log(`Partner Order ID: ${bookingRes.partnerOrderId}`);
  console.log(`Supplier Order ID: ${bookingRes.supplierOrderId}`);
  console.log(`Total Net Price: ${bookingRes.totalNetPrice} ${bookingRes.currency}`);
}

main().catch(err => {
  console.error("Test failed:", err);
});
