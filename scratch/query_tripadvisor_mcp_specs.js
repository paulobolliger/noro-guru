const https = require('https');

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
          // Parse SSE format (data: {...})
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
  console.log("=== Listing TripAdvisor OpenAPI Specs ===");
  const specs = await callMcpTool('list-specs', {});
  console.log(JSON.stringify(specs, null, 2));

  console.log("\n=== Searching All Endpoints ===");
  const searchResults = await callMcpTool('search-endpoints', { pattern: "location" });
  console.log(JSON.stringify(searchResults, null, 2).substring(0, 3000));
}

main().catch(console.error);
