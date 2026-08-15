const https = require('https');

const apiKey = 'f6abb31a-7b05-4d04-bc27-21aa63507efa';

const testUrls = [
  `https://api.content.tripadvisor.com/api/v1/location/search?key=${apiKey}&searchQuery=Paris&language=pt_BR`,
  `https://api.terra.tripadvisor.com/v1/location/search?key=${apiKey}&searchQuery=Paris`,
  `https://api.tripadvisor.com/api/partner/2.0/location/search?key=${apiKey}&searchQuery=Paris`
];

async function testUrl(url) {
  return new Promise((resolve) => {
    console.log(`Testing URL: ${url}`);
    const req = https.get(url, {
      headers: {
        'Accept': 'application/json',
        'X-TripAdvisor-API-Key': apiKey,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
        if (res.statusCode === 200) {
          console.log('SUCCESS PAYLOAD:', data.substring(0, 500));
        } else {
          console.log('ERROR PAYLOAD:', data.substring(0, 300));
        }
        resolve();
      });
    });
    req.on('error', err => {
      console.error('Error:', err.message);
      resolve();
    });
  });
}

async function main() {
  for (const u of testUrls) {
    await testUrl(u);
  }
}

main();
