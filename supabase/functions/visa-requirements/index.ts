// Deno Deploy / Supabase Edge Function: visa-requirements
// GET /?from=BR&to=CA[&purpose=&duration=]
// Auth: x-api-key header mapped to cp.api_keys

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type ApiKeyRow = { id: string; tenant_id: string; hash: string; last4: string; expires_at: string | null; scope: string[] };

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
}

function jsonMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (v && typeof v === "object" && !Array.isArray(v) && a && typeof a[k] === "object" && !Array.isArray(a[k])) {
      out[k] = jsonMerge(a[k] as Record<string, unknown>, v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-api-key, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders } });
  }

  const url = new URL(req.url);
  // Health/monitoring
  if (url.searchParams.get("ping")) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json", ...corsHeaders } });
  }

  const from = url.searchParams.get("from")?.toUpperCase() || "";
  const to = url.searchParams.get("to")?.toUpperCase() || "";
  // Treat empty as '' to match unique key shape
  const purpose = ((url.searchParams.get("purpose") || "").trim()) || "";
  const duration = ((url.searchParams.get("duration") || "").trim()) || "";

  if (!from || !to) {
    return new Response(JSON.stringify({ error: "Missing required params 'from' and 'to'" }), {
      status: 400,
      headers: { "content-type": "application/json", ...corsHeaders },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), { status: 500, headers: { "content-type": "application/json", ...corsHeaders } });
    }
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    // API key auth
    const apiKey = req.headers.get("x-api-key")?.trim();
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing x-api-key" }), { status: 401, headers: { "content-type": "application/json", ...corsHeaders } });
    }

    // Hash compare (matches cp.api_keys.hash as hex sha256)
    const hash = await sha256Hex(apiKey);
    const { data: keyRow, error: keyErr } = await supabase
      .from("cp.api_keys")
      .select("id, tenant_id, hash, last4, expires_at, scope")
      .eq("hash", hash)
      .maybeSingle();

    if (keyErr || !keyRow) {
      return new Response(JSON.stringify({ error: "Invalid API key" }), { status: 401, headers: { "content-type": "application/json", ...corsHeaders } });
    }
    if (keyRow.expires_at && new Date(keyRow.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "API key expired" }), { status: 401, headers: { "content-type": "application/json", ...corsHeaders } });
    }

    const { tenant_id } = keyRow as ApiKeyRow;

    // Fetch base requirement
    let { data: reqBase, error: reqErr } = await supabase
      .from("visa_requirements")
      .select("id, country_from, country_to, purpose, duration, requirement, updated_at, last_checked_at")
      .eq("country_from", from)
      .eq("country_to", to)
      .eq("purpose", purpose)
      .eq("duration", duration)
      .maybeSingle();

    if (reqErr) {
      return new Response(JSON.stringify({ error: "Query error", details: reqErr.message }), { status: 500, headers: { "content-type": "application/json", ...corsHeaders } });
    }

    // Fallback: if not found and purpose/duration provided, try with both as ''
    if (!reqBase && (purpose || duration)) {
      const fb = await supabase
        .from("visa_requirements")
        .select("id, country_from, country_to, purpose, duration, requirement, updated_at, last_checked_at")
        .eq("country_from", from)
        .eq("country_to", to)
        .eq("purpose", "")
        .eq("duration", "")
        .maybeSingle();
      if (!fb.error) reqBase = fb.data as typeof reqBase;
    }

    // Fetch tenant override
    const tStart = performance.now();
    const { data: ov, error: ovErr } = await supabase
      .from("visa_overrides")
      .select("override, updated_at")
      .eq("tenant_id", tenant_id)
      .eq("country_from", from)
      .eq("country_to", to)
      .eq("purpose", purpose)
      .eq("duration", duration)
      .maybeSingle();

    if (ovErr) {
      return new Response(JSON.stringify({ error: "Override query error", details: ovErr.message }), { status: 500, headers: { "content-type": "application/json", ...corsHeaders } });
    }

    if (!reqBase && !ov) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "content-type": "application/json", ...corsHeaders } });
    }

    const requirement = (reqBase?.requirement ?? {}) as Record<string, unknown>;
    const merged = ov?.override ? jsonMerge(requirement, ov.override as Record<string, unknown>) : requirement;

    const payload = {
      country_from: from,
      country_to: to,
      purpose,
      duration,
      requirement: merged,
      updated_at: reqBase?.updated_at ?? ov?.updated_at ?? null,
      last_checked_at: reqBase?.last_checked_at ?? null,
      source: {
        base: Boolean(reqBase),
        override: Boolean(ov),
      },
    };

    const elapsed = Math.round(performance.now() - tStart);
    // Fire-and-forget log (no await)
    supabase.schema('cp').from("api_key_logs").insert({
      key_id: (keyRow as any).id,
      tenant_id,
      route: "visa-requirements",
      country_from: from,
      country_to: to,
      purpose,
      duration,
      status: 200,
      elapsed_ms: elapsed,
    });

    return new Response(JSON.stringify(payload), { status: 200, headers: { "content-type": "application/json", ...corsHeaders } });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unhandled", details: String(e) }), { status: 500, headers: { "content-type": "application/json", ...corsHeaders } });
  }
});
