import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Payload = {
  type: "ticket_created" | "ticket_updated" | "message_created";
  ticketId: string;
  messageId?: string;
  tenantId?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function unauthorized(msg: string) {
  return jsonResponse({ error: msg }, 401);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const secret = Deno.env.get("SUPPORT_FUNCTION_SECRET") ?? "";
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!secret || token !== secret) {
    return unauthorized("invalid authorization");
  }

  let payload: Payload;
  try {
    payload = await req.json() as Payload;
  } catch {
    return jsonResponse({ error: "invalid payload" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY");
    return jsonResponse({ error: "server misconfigured" }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .select("id, subject, requester_email, status, priority, tenant_id")
    .eq("id", payload.ticketId)
    .maybeSingle();

  if (ticketError || !ticket) {
    console.error("Ticket not found", ticketError);
    return jsonResponse({ error: "ticket not found" }, 404);
  }

  let messageBody = "";
  if (payload.type === "message_created" && payload.messageId) {
    const { data: msg, error: msgError } = await supabase
      .from("support_messages")
      .select("body, internal, sender_role")
      .eq("id", payload.messageId)
      .maybeSingle();
    if (!msgError && msg) {
      messageBody = msg.body;
    }
  }

  const recipient = ticket.requester_email;
  if (!recipient) {
    console.info("No recipient email for ticket", ticket.id);
    return jsonResponse({ ok: true, skipped: "no-recipient" });
  }

  let subject = `[NORO Support] Atualização do ticket ${ticket.id}`;
  let text = "Seu ticket foi atualizado.";

  if (payload.type === "ticket_created") {
    subject = `[NORO Support] Ticket criado: ${ticket.subject ?? ticket.id}`;
    text = "Recebemos o seu pedido e começaremos a trabalhar nele em breve.";
  } else if (payload.type === "ticket_updated") {
    subject = `[NORO Support] Ticket atualizado: ${ticket.subject ?? ticket.id}`;
    text = `Status atual: ${ticket.status}`;
  } else if (payload.type === "message_created") {
    subject = `[NORO Support] Nova mensagem em: ${ticket.subject ?? ticket.id}`;
    text = messageBody || "Há uma nova mensagem no seu ticket.";
  }

  const fromAddress = Deno.env.get("SUPPORT_EMAIL_FROM") ?? Deno.env.get("SMTP_FROM") ?? "suporte@noro.guru";
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (resendKey) {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipient],
        subject,
        html: `<p>${text.replace(/\n/g, '<br/>')}</p>`,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error", emailRes.status, errText);
      return jsonResponse({ error: "email failed" }, 500);
    }
  } else {
    console.info("RESEND_API_KEY missing; skipping email", { recipient, subject });
  }

  return jsonResponse({ ok: true });
});
