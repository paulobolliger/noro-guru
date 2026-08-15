const https = require('https');

function testCnpj(cnpj) {
  return new Promise((resolve) => {
    const url = `https://publica.cnpj.ws/cnpj/${cnpj}`;
    console.log(`Querying CNPJ.ws endpoint: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          console.log(`HTTP ${res.statusCode}:`);
          const parsed = JSON.parse(data);
          console.log(`Razão Social: ${parsed.razao_social}`);
          console.log(`Nome Fantasia: ${parsed.estabelecimento?.nome_fantasia || parsed.razao_social}`);
          console.log(`Cidade/UF: ${parsed.estabelecimento?.cidade?.nome}/${parsed.estabelecimento?.estado?.sigla}`);
          console.log(`CEP: ${parsed.estabelecimento?.cep}`);
        } catch (e) {
          console.log('Raw response snippet:', data.substring(0, 300));
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
  await testCnpj('11111227000120'); // Nomade Guru TAC Ltda
}

main();
