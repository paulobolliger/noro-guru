import fs from "fs";
import { createDatabaseClient } from "./packages/db/index";

function loadEnv() {
  const envPath = "./.env.local";
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      if (val.startsWith("'") && val.endsWith("'")) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

loadEnv();

async function main() {
  const { client, close } = createDatabaseClient();
  try {
    const tables = await client`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name = 'sites'
    `;
    console.log("All 'sites' tables in VPS database:");
    console.table(tables);
  } catch (err) {
    console.error("Error inspecting columns:", err);
  } finally {
    await close();
  }
}

main().catch(console.error);
