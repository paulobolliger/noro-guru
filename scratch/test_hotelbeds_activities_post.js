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

const postData = JSON.stringify({
  filters: [
    {
      searchFilterItems: [
        {
          type: "DESTINATION",
          value: "PAR"
        }
      ]
    }
  ],
  from: "2026-08-10",
  to: "2026-08-15"
});

function testActivitiesPost() {
  return new Promise((resolve) => {
    const signature = generateSignature(apiKey, secret);
    const options = {
      hostname: 'api.test.hotelbeds.com',
      path: '/activity-api/3.0/activities',
      method: 'POST',
      headers: {
        'Api-key': apiKey,
        'X-Signature': signature,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log(`Testing POST /activity-api/3.0/activities...`);

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
        console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
        try {
          console.log('PAYLOAD:', JSON.stringify(JSON.parse(text), null, 2).substring(0, 1000));
        } catch (e) {
          console.log('RAW:', text.substring(0, 500));
        }
        resolve();
      });
    });

    req.on('error', err => {
      console.error('Error:', err.message);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

testActivitiesPost();
