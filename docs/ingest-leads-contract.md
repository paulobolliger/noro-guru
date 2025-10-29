# Ingest Leads — Contract

Target: Supabase Edge Function `ingest-lead` (or Next route handler), returns 202/409/429.

## Endpoint
- `POST /ingest/lead`
- Auth: none (captcha required) or tenant public key; rate limited per IP/domain.

## Payload (JSON)
```
{
  "tenant_slug": "noro",                // required
  "organization_name": "Acme Ltd",      // required
  "contact_name": "Jane Doe",           // optional
  "email": "jane@acme.com",            // required
  "phone": "+55 11 99999-0000",        // optional
  "message": "...",                      // optional
  "source": "web|landing|ads|referral|other",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "brnd",
  "utm_content": "hero",
  "utm_term": "vistos",
  "consent": true,                       // required for web/ads
  "page_url": "https://noro.guru/..",
  "referrer": "https://...",
  "gclid": "...",                       // optional
  "fbclid": "...",                      // optional
  "captcha_token": "..."                // required if public
}
```

## Validation
- `tenant_slug`, `organization_name`, `email` required.
- RFC 5322 email check; normalize case/space.
- `consent` required if `source in ('web','ads')`.
- `utm_*` optional; truncate long strings; strip control chars.

## Dedupe Strategy
- Window: 72h per `(tenant_id, email)`.
- Behavior: `merge` (default) → return 409 with `{ strategy: "dedupe", lead_id }`.

## Anti‑Spam
- hCaptcha/reCAPTCHA token verification.
- Honeypot field; IP/domain rate limit; UA sanity checks.

## Responses
- 202 Accepted `{ id: <uuid>, status: "queued" }`.
- 400 ValidationError `{ field, reason }`.
- 409 Conflict `{ strategy: "dedupe", lead_id }`.
- 429 TooManyRequests.
- 500 InternalError `{ request_id }`.

## Processing Steps
1. Resolve tenant by `tenant_slug` or domain.
2. Validate+normalize payload; verify captcha.
3. Dedupe; if new → insert `cp.leads` with capture fields; set `owner_id = auth.uid()` if present, else null.
4. Insert `cp.lead_activity` (action: `created`, details: payload summary).
5. Optionally enqueue notification/webhook.

## Storage Mapping
- `cp.leads`: source, utm_*, capture_channel='web', consent, page_url, referrer, tags[] (empty initially).
- `cp.lead_activity`: link by lead_id; details stores minimal structured context.

## Observability
- Log: `ip_hash`, `user_agent`, `referrer`, `latency_ms`, captcha `score`.
- Metrics: daily new leads, by stage/source; dedupe rate.

## Security
- RLS enforced for Control UI; Edge function uses service key and validates tenant.
