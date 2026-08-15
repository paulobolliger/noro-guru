const https = require('https');

const apiKey = '23b7af563cd43bf96ccbfb7e253919fd9c08db31c4195d4cbd7cc5516be3f29c';
const url = `https://economia.awesomeapi.com.br/json/last/USD-BRL,USD-BRLPTAX,USD-BRLT,EUR-BRL,EUR-BRLPTAX,EUR-BRLT?token=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('=== INSAPECÇÃO COMPLETA AWESOMEAPI (RAW) ===');
      for (const [key, val] of Object.entries(parsed)) {
        console.log(`\nMoeda: ${key} (${val.name})`);
        console.log(`  - ask (Venda): ${val.ask}`);
        console.log(`  - bid (Compra): ${val.bid}`);
        console.log(`  - high (Máxima): ${val.high}`);
        console.log(`  - low (Mínima): ${val.low}`);
        console.log(`  - create_date: ${val.create_date}`);
      }
    } catch (e) {
      console.error(e);
    }
  });
});
