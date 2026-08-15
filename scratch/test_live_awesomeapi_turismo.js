const https = require('https');

const apiKey = '23b7af563cd43bf96ccbfb7e253919fd9c08db31c4195d4cbd7cc5516be3f29c';
const url = `https://economia.awesomeapi.com.br/json/last/USD-BRLT,EUR-BRLT?token=${apiKey}`;

console.log(`Querying AwesomeAPI Dólar Turismo & Euro Turismo (USD-BRLT, EUR-BRLT)...`);

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('\n=== AwesomeAPI Live TURISMO Response ===');
      console.log(JSON.stringify(parsed, null, 2));

      if (parsed.USDBRLT) {
        const usdTurismoVenda = parseFloat(parsed.USDBRLT.ask);
        const usdSpread = 1.0; // 1% spread master
        const usdFinal = (usdTurismoVenda * (1 + usdSpread / 100)).toFixed(4);
        console.log(`\n🇺🇸 DÓLAR TURISMO (USD-BRLT):`);
        console.log(`- Venda Mercado (ask): R$ ${usdTurismoVenda.toFixed(4)}`);
        console.log(`- Spread Master: ${usdSpread}%`);
        console.log(`- Dólar Final no Noro Guru: R$ ${usdFinal} (Meta Mobility: R$ 5,3900)`);
      }

      if (parsed.EURBRLT) {
        const eurTurismoVenda = parseFloat(parsed.EURBRLT.ask);
        const eurSpread = 1.0;
        const eurFinal = (eurTurismoVenda * (1 + eurSpread / 100)).toFixed(4);
        console.log(`\n🇪🇺 EURO TURISMO (EUR-BRLT):`);
        console.log(`- Venda Mercado (ask): R$ ${eurTurismoVenda.toFixed(4)}`);
        console.log(`- Spread Master: ${eurSpread}%`);
        console.log(`- Euro Final no Noro Guru: R$ ${eurFinal} (Meta Mobility: R$ 6,1600)`);
      }
    } catch (e) {
      console.error('Error parsing JSON:', e, data);
    }
  });
}).on('error', (err) => {
  console.error('HTTPS error:', err.message);
});
