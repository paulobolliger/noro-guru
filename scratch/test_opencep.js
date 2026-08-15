const https = require('https');

function testOpenCep(cep) {
  return new Promise((resolve) => {
    const url = `https://opencep.com/v1/${cep}.json`;
    console.log(`Testing OpenCEP endpoint: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          console.log(`HTTP ${res.statusCode}:`);
          console.log(JSON.stringify(JSON.parse(data), null, 2));
        } catch (e) {
          console.log('Raw response:', data);
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
  await testOpenCep('15050305');
  await testOpenCep('01310930');
}

main();
