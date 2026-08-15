const https = require('https');

const apiKey = 'f6abb31a-7b05-4d04-bc27-21aa63507efa';

function testTripAdvisorSearch(query) {
  return new Promise((resolve) => {
    const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${apiKey}&searchQuery=${encodeURIComponent(query)}&language=pt_BR`;
    console.log(`Querying TripAdvisor API: ${url}`);

    https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
        try {
          const parsed = JSON.parse(data);
          console.log('TRIPADVISOR LOCATIONS FOUND:', JSON.stringify(parsed, null, 2).substring(0, 1000));
        } catch (e) {
          console.log('RAW RESPONSE:', data.substring(0, 400));
        }
        resolve();
      });
    }).on('error', err => {
      console.error('Error:', err.message);
      resolve();
    });
  });
}

async function main() {
  await testTripAdvisorSearch('Copacabana Palace Rio de Janeiro');
}

main();
