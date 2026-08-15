const https = require('https');

const apiKey = 'f6abb31a-7b05-4d04-bc27-21aa63507efa';

function testTripAdvisorHeaders() {
  return new Promise((resolve) => {
    const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${apiKey}&searchQuery=Paris&language=pt_BR`;

    const options = {
      headers: {
        'Accept': 'application/json',
        'Referer': 'https://noro.guru/',
        'Origin': 'https://noro.guru',
        'User-Agent': 'NoroGuru/1.0'
      }
    };

    console.log(`Querying TripAdvisor API with headers...`);
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
        console.log('RESPONSE:', data.substring(0, 300));
        resolve();
      });
    }).on('error', err => {
      console.error('Error:', err.message);
      resolve();
    });
  });
}

testTripAdvisorHeaders();
