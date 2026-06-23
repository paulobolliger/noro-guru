import fs from "fs";
import postgres from "postgres";

function loadEnv() {
  const envPath = ".env.local";
  if (fs.existsSync(envPath)) {
    console.log("Loading environment from:", envPath);
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

loadEnv();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing");
  }

  const sql = postgres(url);
  try {
    console.log("Searching for tables/views named 'pedidos' or 'cobrancas'...");
    const tables = await sql`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_name LIKE '%pedido%' OR table_name LIKE '%cobranca%'
      ORDER BY table_schema, table_name
    `;
    console.log("Matching tables found:", tables);

  } catch (err) {
    console.error("Error inspecting database:", err);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
