import { createServerSupabaseClient } from "@lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
  throw new Error("Stripe env vars missing");
}
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient();
  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "signature required" }, { status: 400 });
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "invoice.created":
      case "invoice.finalized": {
        const inv = event.data.object as Stripe.Invoice;
        const amount = inv.amount_due ?? inv.amount_paid ?? 0;
        const currency = (inv.currency || "brl").toUpperCase();
        const stripe_invoice_id = inv.id;
        const tenant_id = (inv.metadata?.tenant_id as string) || null;
        await supabase
          .schema("cp")
          .from("invoices")
          .insert({
            tenant_id,
            subscription_id: null,
            amount_cents: amount,
            currency,
            status: inv.status ?? "open",
            issued_at: inv.created ? new Date(inv.created * 1000).toISOString() : null,
            due_at: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : null,
            stripe_invoice_id,
          }, { upsert: false });
        break;
      }
      case "invoice.paid": {
        const inv = event.data.object as Stripe.Invoice;
        const stripe_invoice_id = inv.id;
        const { data: updated } = await supabase
          .schema("cp")
          .from("invoices")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("stripe_invoice_id", stripe_invoice_id)
          .select("tenant_id, amount_cents").maybeSingle();

        // Insert minimal ledger entries (MVP): revenue and cash
        const tenant_id = (inv.metadata?.tenant_id as string) || updated?.tenant_id || null;
        const amount = updated?.amount_cents ?? (inv.amount_paid ?? 0);

        // Ensure default accounts exist
        const ensureAccount = async (code: string, name: string, type: string) => {
          const { data: acc } = await supabase.schema("cp").from("ledger_accounts").select("id").eq("code", code).maybeSingle();
          if (acc?.id) return acc.id as string;
          const { data: created } = await supabase.schema("cp").from("ledger_accounts").insert({ code, name, type }).select("id").maybeSingle();
          return created?.id as string;
        };
        const revenueId = await ensureAccount("4000", "Receita Plataforma", "revenue");
        const cashId = await ensureAccount("1000", "Caixa", "asset");

        await supabase.schema("cp").from("ledger_entries").insert([
          { account_id: revenueId, tenant_id, amount_cents: amount, memo: `Stripe invoice ${stripe_invoice_id}` },
          { account_id: cashId, tenant_id, amount_cents: amount, memo: `Stripe invoice ${stripe_invoice_id}` },
        ]);
        break;
      }
      default:
        break;
    }
  } catch (dbErr: any) {
    console.error("stripe webhook db error", dbErr);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

