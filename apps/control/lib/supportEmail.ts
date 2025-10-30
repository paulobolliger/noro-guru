import { headers } from "next/headers";

type SupportEmailPayload = {
  type: "ticket_created" | "ticket_updated" | "message_created";
  ticketId: string;
  messageId?: string;
  tenantId?: string;
};

function getFunctionUrl() {
  const explicit = process.env.SUPABASE_FUNCTION_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return supabaseUrl ? supabaseUrl.replace(".supabase.co", ".functions.supabase.co") : null;
}

export async function sendSupportEmail(payload: SupportEmailPayload) {
  const baseUrl = getFunctionUrl();
  const secret = process.env.SUPPORT_FUNCTION_SECRET;
  if (!baseUrl || !secret) return;
  const endpoint = `${baseUrl}/support-email`;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
        "x-forwarded-host": headers().get("host") ?? "",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.warn("support-email failed", res.status, errorText);
    }
  } catch (err) {
    console.warn("support-email fetch error", err);
  }
}

