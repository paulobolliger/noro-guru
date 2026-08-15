const https = require('https');
const crypto = require('crypto');
const zlib = require('zlib');

function generateSignature(apiKey, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const data = apiKey + secret + timestamp;
  return crypto.createHash('sha256').update(data).digest('hex');
}

const apiKey = '2a4fd0b5f6daa8aa4f2e677319405c49';
const secret = '6fYowm58hB';

const paths = [
  '/activity-content-api/1.0/countries',
  '/activity-content-api/3.0/countries',
  '/activity-api/1.0/status',
  '/activity-api/1.0/activities/search',
  '/activity-api/3.0/activities'
];

async function testPath(path) {
  return new Promise((resolve) => {
    const signature = generateSignature(apiKey, secret);
    const options = {
      hostname: 'api.test.hotelbeds.com',
      path: path,
      method: 'GET',
      headers: {
        'Api-key': apiKey,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        let text = '';
        try {
          text = zlib.gunzipSync(buffer).toString('utf8');
        } catch (e) {
          text = buffer.toString('utf8');
        }
        console.log(`Path: ${path} -> Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('  SUCCESS Payload:', text.substring(0, 300));
        }
        resolve();
      });
    });
    req.on('error', () => resolve());
    req.end();
  });
}

async function main() {
  for (const p of paths) {
    await testPath(p);
  }
}

main();
