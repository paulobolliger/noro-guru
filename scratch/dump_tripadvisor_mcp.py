import urllib.request
import json
import ssl

url = "https://docs.terra.tripadvisor.com/mcp"

# Try MCP JSON-RPC 2.0 initialize / tools list
req_data = json.dumps({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
}).encode('utf-8')

headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream"
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")
    with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
        body = resp.read().decode('utf-8')
        print("RESPONSE STATUS:", resp.status)
        print("RESPONSE BODY:", body[:2000])
except Exception as e:
    print("POST ERROR:", e)

# Try GET / SSE
try:
    req_get = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req_get, context=ctx, timeout=10) as resp:
        body_get = resp.read().decode('utf-8')
        print("GET RESPONSE STATUS:", resp.status)
        print("GET RESPONSE BODY:", body_get[:2000])
except Exception as e:
    print("GET ERROR:", e)
