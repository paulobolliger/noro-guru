const https = require('https');

const apiKey = 'f6abb31a-7b05-4d04-bc27-21aa63507efa';

const catalogEndpoints = [
  `/catalog/locations/search?searchQuery=Paris&key=${apiKey}`,
  `/catalog/locations/nearby?searchCenter=48.8566,2.3522&key=${apiKey}`,
  `/agentic/recommendations?key=${apiKey}`
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `https://api.content.tripadvisor.com/api/v1${endpoint}`;
    console.log(`\nQuerying: ${url}`);

    https.get(url, { headers: { 'accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`HTTP ${res.statusCode} ${res.statusMessage}`);
        console.log('PAYLOAD:', data.substring(0, 300));
        resolve();
      });
    }).on('error', err => {
      console.error('Error:', err.message);
      resolve();
    });
  });
}

async function main() {
  for (const ep of catalogEndpoints) {
    await testEndpoint(ep);
  }
}

main();
