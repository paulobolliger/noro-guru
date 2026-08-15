const https = require('https');
const fs = require('fs');

function callMcpTool(toolName, args) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args
      }
    });

    const options = {
      hostname: 'docs.terra.tripadvisor.com',
      port: 443,
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const lines = body.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const parsed = JSON.parse(line.substring(6));
              resolve(parsed);
              return;
            }
          }
          resolve(JSON.parse(body));
        } catch (err) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log("Fetching endpoints for Partner API...");
  const listResp = await callMcpTool('list-endpoints', { title: "Partner API" });
  let textContent = listResp.result.content[0].text;
  const parsedMap = JSON.parse(textContent);

  const fullDetails = [];

  for (const [pathStr, methodMap] of Object.entries(parsedMap)) {
    for (const [methodStr, summaryStr] of Object.entries(methodMap)) {
      console.log(`Getting endpoint details for ${methodStr.toUpperCase()} ${pathStr}...`);
      try {
        const detailResp = await callMcpTool('get-endpoint', {
          title: "Partner API",
          path: pathStr,
          method: methodStr.toUpperCase()
        });
        fullDetails.push({
          method: methodStr.toUpperCase(),
          path: pathStr,
          summary: summaryStr,
          schema: detailResp.result.content[0].text
        });
      } catch (e) {
        console.error(`Error fetching ${pathStr}:`, e.message);
      }
    }
  }

  const outputPath = 'c:/Users/paulo/0-dev/02-aplicacoes/04 noro-guru/noro-guru/docs/suppliers/tripadvisor-mcp-spec.json';
  fs.writeFileSync(outputPath, JSON.stringify(fullDetails, null, 2));
  console.log(`Successfully saved ${fullDetails.length} complete endpoint schemas to ${outputPath}`);
}

main().catch(console.error);
