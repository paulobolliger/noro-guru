const https = require('https');
const crypto = require('crypto');
const zlib = require('zlib');

function generateSignature(apiKey, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const data = apiKey + secret + timestamp;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return { signature: hash, timestamp };
}

function testHotelbedsStatus(alias, apiKey, secret, path) {
  return new Promise((resolve) => {
    const { signature } = generateSignature(apiKey, secret);
    const host = 'api.test.hotelbeds.com';

    const options = {
      hostname: host,
      path: path,
      method: 'GET',
      headers: {
        'Api-key': apiKey,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip'
      }
    };

    console.log(`\n==================================================`);
    console.log(`Testing Hotelbeds APItude [${alias}]`);
    console.log(`URL: https://${host}${path}`);

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        let text = '';
        if (res.headers['content-encoding'] === 'gzip') {
          try {
            text = zlib.gunzipSync(buffer).toString('utf8');
          } catch (e) {
            text = buffer.toString('utf8');
          }
        } else {
          text = buffer.toString('utf8');
        }

        console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
        try {
          const parsed = JSON.parse(text);
          console.log('RESPONSE:', JSON.stringify(parsed, null, 2).substring(0, 800));
        } catch (e) {
          console.log('RESPONSE RAW:', text.substring(0, 500));
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error(`Error [${alias}]:`, err.message);
      resolve();
    });

    req.end();
  });
}

async function main() {
  // 1. Hotel Status
  await testHotelbedsStatus(
    'HOTEL',
    '0e04908f5aa34c0373597c6333346e37',
    'KJHYJMWQAz',
    '/hotel-api/1.0/status'
  );

  // 2. Hotel Search (PARIS - 1 night test)
  await testHotelbedsStatus(
    'HOTEL_CONTENT',
    '0e04908f5aa34c0373597c6333346e37',
    'KJHYJMWQAz',
    '/hotel-content-api/1.0/types/languages?fields=all'
  );

  // 3. Activities Status (v3.0)
  await testHotelbedsStatus(
    'ACTIVITIES',
    '2a4fd0b5f6daa8aa4f2e677319405c49',
    '6fYowm58hB',
    '/activity-api/3.0/status'
  );

  // 4. Transfers
  await testHotelbedsStatus(
    'TRANSFERS',
    'a8daf8289233835a3bfd6c46bd863a53',
    'Al8eH3zArm',
    '/transfer-cache-api/1.0/locations/countries?fields=ALL&language=en'
  );
}

main();
