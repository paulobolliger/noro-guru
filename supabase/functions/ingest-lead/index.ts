// Supabase Edge Function: ingest-lead
// Purpose: Validate + dedupe + insert lead and activity, with optional CAPTCHA.

// Deno/Edge runtime
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Json = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

function json(res: Json, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(res), { ...init, headers });
}

function getEnvBoolean(name: string, def = false): boolean {
  const v = (Deno.env.get(name) || "").trim().toLowerCase();
  if (!v) return def;
  return v === "1" || v === "true" || v === "yes";
}

async function verifyCaptcha(opts: { token?: string | null; ip?: string | null }): Promise<boolean> {
  const enabled = getEnvBoolean("CAPTCHA_ENABLED", false);
  const mock = getEnvBoolean("CAPTCHA_MOCK", false);
  if (!enabled) return true;
  if (mock) return true;

  const provider = (Deno.env.get("CAPTCHA_PROVIDER") || "recaptcha").toLowerCase();
  const secret = Deno.env.get("CAPTCHA_SECRET") || "";
  const token = opts.token || "";
  const remoteip = opts.ip || undefined;
  if (!secret || !token) return false;

  try {
    if (provider === "hcaptcha") {
      const form = new URLSearchParams();
      form.set("secret", secret);
      form.set("response", token);
      if (remoteip) form.set("remoteip", remoteip);
      const r = await fetch("https://hcaptcha.com/siteverify", { method: "POST", body: form });
      const data = await r.json();
      return Boolean((data as any)?.success);
    } else {
      // Google reCAPTCHA v2/v3
      const form = new URLSearchParams();
      form.set("secret", secret);
      form.set("response", token);
      if (remoteip) form.set("remoteip", remoteip);
      const r = await fetch("https://www.google.com/recaptcha/api/siteverify", { method: "POST", body: form });
      const data = await r.json();
      return Boolean((data as any)?.success);
    }
  } catch (_e) {
    return false;
  }
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Missing service configuration" }, { status: 500 });

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  let payload: any;
  try {
    payload = await req.json();
  } catch (_e) {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Basic validation / normalization
  const tenantSlug = String(payload?.tenant_slug || "").trim();
  const organizationName = String(payload?.organization_name || "").trim();
  const email = String(payload?.email || "").trim().toLowerCase();
  const contactName = payload?.contact_name ? String(payload.contact_name).trim() : null;
  const phone = payload?.phone ? String(payload.phone).trim() : null;
  const message = payload?.message ? String(payload.message).trim() : null;
  const source = payload?.source ? String(payload.source).trim().toLowerCase() : null;
  const utm_source = payload?.utm_source ? String(payload.utm_source).trim() : null;
  const utm_medium = payload?.utm_medium ? String(payload.utm_medium).trim() : null;
  const utm_campaign = payload?.utm_campaign ? String(payload.utm_campaign).trim() : null;
  const utm_content = payload?.utm_content ? String(payload.utm_content).trim() : null;
  const utm_term = payload?.utm_term ? String(payload.utm_term).trim() : null;
  const page_url = payload?.page_url ? String(payload.page_url).trim() : null;
  const referrer = payload?.referrer ? String(payload.referrer).trim() : null;
  const consent = Boolean(payload?.consent || false);
  const captchaToken = payload?.captcha_token ? String(payload.captcha_token) : null;

  if (!tenantSlug) return json({ error: "tenant_slug is required" }, { status: 400 });
  if (!organizationName) return json({ error: "organization_name is required" }, { status: 400 });
  if (!email || !isEmail(email)) return json({ error: "email is invalid" }, { status: 400 });
  if ((source === "web" || source === "ads") && !consent) {
    return json({ error: "consent required for web/ads" }, { status: 400 });
  }

  // CAPTCHA
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const captchaOk = await verifyCaptcha({ token: captchaToken, ip: forwardedFor });
  if (!captchaOk) return json({ error: "captcha_failed" }, { status: 429 });

  // Resolve tenant
  const { data: tenant, error: tErr } = await supabase
    .from("tenants")
    .select("id, slug")
    .eq("slug", tenantSlug)
    .single();
  if (tErr || !tenant) return json({ error: "tenant_not_found" }, { status: 400 });

  // Dedupe 72h
  const { data: dup } = await supabase
    .schema("cp")
    .from("leads")
    .select("id, created_at")
    .eq("tenant_id", tenant.id)
    .ilike("email", email)
    .gt("created_at", new Date(Date.now() - 72 * 3600 * 1000).toISOString())
    .limit(1)
    .maybeSingle();
  if (dup?.id) return json({ strategy: "dedupe", lead_id: dup.id }, { status: 409 });

  // Insert lead
  const leadInsert = {
    tenant_id: tenant.id,
    organization_name: organizationName,
    email,
    phone,
    source,
    capture_channel: source ? "web" : null,
    consent,
    page_url,
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  } as Record<string, unknown>;

  const { data: created, error: cErr } = await supabase
    .schema("cp")
    .from("leads")
    .insert(leadInsert)
    .select("id")
    .single();
  if (cErr || !created) return json({ error: "insert_failed", details: cErr?.message }, { status: 500 });

  // Activity
  await supabase
    .schema("cp")
    .from("lead_activity")
    .insert({
      lead_id: created.id,
      action: "created",
      details: {
        contact_name: contactName,
        message,
        source,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        page_url,
        referrer,
      },
    });

  return json({ id: created.id, status: "queued" }, { status: 202 });
});

