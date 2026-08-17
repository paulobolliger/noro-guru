import { headers } from "next/headers";

type SupportEmailPayload = {
  type: "ticket_created" | "ticket_updated" | "message_created";
  ticketId: string;
  messageId?: string;
  tenantId?: string;
};

function getFunctionUrl() {
  return process.env.SUPPORT_FUNCTION_URL || process.env.INTERNAL_SERVICES_URL || null;
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
