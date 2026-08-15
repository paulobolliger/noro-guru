const https = require('https');

const apiKey = 'f6abb31a-7b05-4d04-bc27-21aa63507efa';

const authHeaders = [
  { 'Authorization': `Bearer ${apiKey}` },
  { 'X-TripAdvisor-API-Key': apiKey },
  { 'x-api-key': apiKey },
  { 'Authorization': apiKey }
];

async function testAuth(headerObj) {
  return new Promise((resolve) => {
    const url = 'https://api.content.tripadvisor.com/api/v1/location/search?searchQuery=Paris&language=pt';
    console.log(`\nTesting Auth Header:`, headerObj);

    const options = {
      headers: {
        'accept': 'application/json',
        ...headerObj
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`HTTP ${res.statusCode} ${res.statusMessage}`);
        if (res.statusCode === 200) {
          console.log('SUCCESS PAYLOAD:', data.substring(0, 500));
        } else {
          console.log('PAYLOAD:', data.substring(0, 200));
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
  for (const h of authHeaders) {
    await testAuth(h);
  }
}

main();
