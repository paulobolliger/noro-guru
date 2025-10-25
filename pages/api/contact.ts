import type { NextApiRequest, NextApiResponse } from 'next'

type Data = { ok: boolean; message?: string }

async function sendViaResend(params: {
  from: string
  to: string
  subject: string
  html: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false as const, reason: 'missing_key' }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { ok: false as const, reason: `resend_error:${res.status}:${text}` }
  }
  return { ok: true as const }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, message: 'Method not allowed' })
  }

  const { nome, email, tipo, mensagem, company } = req.body || {}

  if (company) return res.status(400).json({ ok: false, message: 'Spam detected' })
  if (!nome || !email || !tipo) return res.status(400).json({ ok: false, message: 'Campos obrigatórios ausentes.' })

  const to = process.env.CONTACT_TO || 'owner@example.com'
  const from = process.env.CONTACT_FROM || 'NORO <no-reply@noro.guru>'

  const subject = `NORO • Novo contato (${tipo}) de ${nome}`
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;padding:16px">
      <h2>Novo contato NORO</h2>
      <p><strong>Nome:</strong> ${String(nome)}</p>
      <p><strong>E-mail:</strong> ${String(email)}</p>
      <p><strong>Tipo:</strong> ${String(tipo)}</p>
      <p><strong>Mensagem:</strong></p>
      <pre style="white-space:pre-wrap;background:#f3f4f8;padding:12px;border-radius:8px">${String(mensagem || '')}</pre>
    </div>
  `

  // Fire-and-forget to n8n webhook (Telegram/WhatsApp integration handled there)
  const n8nWebhook = process.env.N8N_CONTACT_WEBHOOK
  if (n8nWebhook) {
    try {
      const meta = {
        ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
        ua: req.headers['user-agent'] || '',
        ts: new Date().toISOString(),
        source: 'noro.guru/contact',
      }
      fetch(n8nWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, tipo, mensagem, meta }),
      }).catch(() => {})
    } catch (e) {
      console.warn('[contact] n8n webhook skipped:', e)
    }
  }

  // Try Resend; if not configured, just log and return ok
  try {
    const sent = await sendViaResend({ from, to, subject, html })
    if (!sent.ok) {
      console.log('[contact] Resend not used:', sent.reason)
    }
  } catch (e) {
    console.error('[contact] Error sending', e)
  }

  return res.status(200).json({ ok: true, message: 'Recebido' })
}
