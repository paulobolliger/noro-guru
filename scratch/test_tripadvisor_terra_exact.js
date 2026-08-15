const https = require('https');

const apiKey = 'f6abb31a-7b05-4d04-bc27-21aa63507efa';

function testExactTerra(endpoint) {
  return new Promise((resolve) => {
    const url = `https://api.content.tripadvisor.com/api/v1${endpoint}&key=${apiKey}`;
    console.log(`\n========================================`);
    console.log(`Querying: ${url}`);

    const options = {
      headers: {
        'accept': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`HTTP ${res.statusCode} ${res.statusMessage}`);
        try {
          const parsed = JSON.parse(data);
          console.log('PAYLOAD:', JSON.stringify(parsed, null, 2).substring(0, 800));
        } catch (e) {
          console.log('RAW:', data.substring(0, 400));
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
  await testExactTerra('/location/search?searchQuery=Paris&language=pt');
}

main();
