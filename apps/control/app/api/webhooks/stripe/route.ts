import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createDatabaseClient } from "@noro/db";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe env vars missing" }, { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "signature required" }, { status: 400 });
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  const { client, close } = createDatabaseClient();
  try {
    switch (event.type) {
      case "invoice.created":
      case "invoice.finalized": {
        const inv = event.data.object as Stripe.Invoice;
        const amount = inv.amount_due ?? inv.amount_paid ?? 0;
        const currency = (inv.currency || "brl").toUpperCase();
        const stripe_invoice_id = inv.id;
        const tenant_id = (inv.metadata?.tenant_id as string) || null;

        await client`
          INSERT INTO platform.invoices (
            tenant_id, subscription_id, amount_cents, currency, status, issued_at, due_at, stripe_invoice_id
          ) VALUES (
            ${tenant_id}, NULL, ${amount}, ${currency}, ${inv.status ?? "open"},
            ${inv.created ? new Date(inv.created * 1000).toISOString() : null},
            ${inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null},
            ${stripe_invoice_id}
          )
        `;
        break;
      }
      case "invoice.paid": {
        const inv = event.data.object as Stripe.Invoice;
        const stripe_invoice_id = inv.id;

        let tenant_id = (inv.metadata?.tenant_id as string) || null;
        let amount = inv.amount_paid ?? 0;

        await client.begin(async (sql) => {
          const [updated] = await sql`
            UPDATE platform.invoices
            SET status = 'paid', paid_at = ${new Date().toISOString()}
            WHERE stripe_invoice_id = ${stripe_invoice_id}
            RETURNING tenant_id, amount_cents
          `;

          if (updated) {
            tenant_id = updated.tenant_id || tenant_id;
            amount = updated.amount_cents ?? amount;
          }

          // Ensure default accounts exist
          const ensureAccount = async (code: string, name: string, type: string) => {
            const [acc] = await sql`
              SELECT id
              FROM platform.ledger_accounts
              WHERE code = ${code}
              LIMIT 1
            `;
            if (acc?.id) return acc.id as string;

            const [created] = await sql`
              INSERT INTO platform.ledger_accounts (code, name, type)
              VALUES (${code}, ${name}, ${type})
              RETURNING id
            `;
            return created?.id as string;
          };

          const revenueId = await ensureAccount("4000", "Receita Plataforma", "revenue");
          const cashId = await ensureAccount("1000", "Caixa", "asset");

          await sql`
            INSERT INTO platform.ledger_entries (account_id, tenant_id, amount_cents, memo)
            VALUES 
              (${revenueId}, ${tenant_id}, ${amount}, ${`Stripe invoice ${stripe_invoice_id}`}),
              (${cashId}, ${tenant_id}, ${amount}, ${`Stripe invoice ${stripe_invoice_id}`})
          `;
        });
        break;
      }
      default:
        break;
    }
  } catch (dbErr: any) {
    console.error("stripe webhook db error", dbErr);
    return NextResponse.json({ ok: false }, { status: 500 });
  } finally {
    await close();
  }
  return NextResponse.json({ ok: true });
}
