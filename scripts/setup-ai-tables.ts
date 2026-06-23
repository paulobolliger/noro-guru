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
    console.log("Creating public.noro_ai_wallets table...");
    await sql`
      CREATE TABLE IF NOT EXISTS public.noro_ai_wallets (
        tenant_id uuid PRIMARY KEY REFERENCES platform.tenants(id) ON DELETE CASCADE,
        balance_cents bigint NOT NULL DEFAULT 0,
        updated_at timestamptz DEFAULT now()
      )
    `;

    console.log("Creating public.noro_ai_transactions table...");
    await sql`
      CREATE TABLE IF NOT EXISTS public.noro_ai_transactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id uuid NOT NULL REFERENCES platform.tenants(id) ON DELETE CASCADE,
        amount_cents bigint NOT NULL,
        type text NOT NULL,
        description text,
        metadata jsonb,
        created_at timestamptz DEFAULT now()
      )
    `;

    console.log("Creating index for noro_ai_transactions...");
    await sql`
      CREATE INDEX IF NOT EXISTS idx_noro_ai_trans_tenant ON public.noro_ai_transactions(tenant_id)
    `;

    console.log("Creating or replacing update_ai_wallet_balance trigger function...");
    await sql`
      CREATE OR REPLACE FUNCTION public.update_ai_wallet_balance()
      RETURNS TRIGGER AS $$
      BEGIN
          INSERT INTO public.noro_ai_wallets (tenant_id, balance_cents)
          VALUES (NEW.tenant_id, NEW.amount_cents)
          ON CONFLICT (tenant_id)
          DO UPDATE SET 
              balance_cents = noro_ai_wallets.balance_cents + NEW.amount_cents,
              updated_at = now();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER
    `;

    console.log("Creating trigger...");
    await sql`
      DROP TRIGGER IF EXISTS tr_update_ai_wallet ON public.noro_ai_transactions
    `;
    await sql`
      CREATE TRIGGER tr_update_ai_wallet
      AFTER INSERT ON public.noro_ai_transactions
      FOR EACH ROW
      EXECUTE FUNCTION public.update_ai_wallet_balance()
    `;

    console.log("AI tables setup successfully!");

    // Verify
    const tables = await sql`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_name LIKE 'noro_ai%'
    `;
    console.log("Verification - found tables:", tables);

  } catch (err) {
    console.error("Error setting up tables:", err);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
