import fs from "fs";
import { createDatabaseClient } from "./packages/db";
import { eq } from "drizzle-orm";

function loadEnv() {
  const envPath = "./.env.local";
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
      if (val.startsWith("'") && val.endsWith("'")) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  } else {
    console.warn("Env file not found at:", envPath);
  }
}

loadEnv();

async function run() {
  const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET || "any-test-token";

  const { db, client, close } = createDatabaseClient();
  try {
    // 1. Search for a pending or draft charge in noro.payment_charges that was created for Asaas
    console.log("Looking up payment charge in database...");
    const { paymentCharges } = await import("./packages/db/schema");
    
    const [charge] = await db
      .select()
      .from(paymentCharges)
      .where(eq(paymentCharges.provider, "asaas"))
      .orderBy(paymentCharges.createdAt)
      .limit(1);

    if (!charge) {
      console.log("\n[WARNING] No Asaas payment charge found in database.");
      console.log("Please go to the Portal (/core) at http://localhost:3004/pedidos");
      console.log("and create an order, then click 'Emitir Cobrança' choosing Asaas to create a charge.");
      return;
    }

    console.log(`Found charge ID: ${charge.id}`);
    console.log(`Provider Payment ID: ${charge.providerPaymentId}`);
    console.log(`Current Status: ${charge.status}`);
    console.log(`Order ID (Proposal ID): ${charge.proposalId}`);

    if (!charge.providerPaymentId) {
      console.log("[WARNING] The charge does not have a providerPaymentId. Webhook requires a valid providerPaymentId.");
      return;
    }

    // 2. Mock Asaas Webhook event payload
    const eventId = `evt_test_${Date.now()}`;
    const payload = {
      event: "PAYMENT_CONFIRMED",
      payment: {
        id: charge.providerPaymentId,
        customer: charge.paymentCustomerId || "cus_test_12345",
        value: Number(charge.amountCents) / 100,
        netValue: (Number(charge.amountCents) / 100) - 1.99,
        status: "CONFIRMED",
        confirmedDate: new Date().toISOString().substring(0, 10),
      }
    };

    console.log("\nSimulating PAYMENT_CONFIRMED webhook post...");
    console.log(`Event ID: ${eventId}`);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    // 3. Post to the local control plane route handler
    const url = "http://localhost:3001/api/webhooks/asaas";
    console.log(`Posting to: ${url}`);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "asaas-access-token": webhookSecret,
      },
      body: JSON.stringify({
        id: eventId,
        event: payload.event,
        payment: payload.payment,
      }),
    });

    console.log(`Response Status: ${res.status}`);
    const bodyText = await res.text();
    console.log("Response Body:", bodyText);

    // 4. Verify DB updates
    if (res.ok) {
      console.log("\nVerifying DB updates after webhook execution...");
      const [updatedCharge] = await db
        .select()
        .from(paymentCharges)
        .where(eq(paymentCharges.id, charge.id))
        .limit(1);

      console.log(`Updated Charge Status: ${updatedCharge?.status} (Expected: confirmed)`);

      if (charge.proposalId) {
        const [updatedOrder] = await client`
          SELECT id, status 
          FROM sales.orders 
          WHERE id = ${charge.proposalId}
        `;
        console.log(`Updated Order Status: ${updatedOrder?.status} (Expected: CONCLUIDO)`);
      }
    }
  } catch (err) {
    console.error("Error during webhook test simulation:", err);
  } finally {
    await close();
  }
}

run();
