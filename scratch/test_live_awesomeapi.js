const https = require('https');

const apiKey = '23b7af563cd43bf96ccbfb7e253919fd9c08db31c4195d4cbd7cc5516be3f29c';
const url = `https://economia.awesomeapi.com.br/json/last/USD-BRLPTAX,EUR-BRLPTAX?token=${apiKey}`;

console.log(`Querying AwesomeAPI PTAX live endpoint...`);
console.log(`URL: ${url}`);

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('\n=== AwesomeAPI Live PTAX Rates Response ===');
      console.log(JSON.stringify(parsed, null, 2));

      if (parsed.USDBRLPTAX) {
        const usdPtax = parseFloat(parsed.USDBRLPTAX.ask);
        const usdSpread = 3.5;
        const usdFinal = (usdPtax * (1 + usdSpread / 100)).toFixed(4);
        console.log(`\n🇺🇸 DÓLAR (USD):`);
        console.log(`- PTAX Oficial Venda (BCB): R$ ${usdPtax.toFixed(4)}`);
        console.log(`- Spread Master: ${usdSpread}%`);
        console.log(`- Dólar Turismo Final no Noro Guru: R$ ${usdFinal}`);
      }

      if (parsed.EURBRLPTAX) {
        const eurPtax = parseFloat(parsed.EURBRLPTAX.ask);
        const eurSpread = 4.0;
        const eurFinal = (eurPtax * (1 + eurSpread / 100)).toFixed(4);
        console.log(`\n🇪🇺 EURO (EUR):`);
        console.log(`- PTAX Oficial Venda (BCB): R$ ${eurPtax.toFixed(4)}`);
        console.log(`- Spread Master: ${eurSpread}%`);
        console.log(`- Euro Turismo Final no Noro Guru: R$ ${eurFinal}`);
      }
    } catch (e) {
      console.error('Error parsing JSON:', e, data);
    }
  });
}).on('error', (err) => {
  console.error('HTTPS error:', err.message);
});
