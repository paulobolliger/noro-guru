import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { message } = req.body || {}
  const text: string = String(message || '').toLowerCase()

  // Lightweight rule-based replies (works without API keys)
  let reply = 'Posso ajudar com serviços, prazos e orçamento.'
  if (text.includes('preço') || text.includes('valor') || text.includes('quanto')) {
    reply = 'Trabalhamos com três planos: Start, Pro e Elite. Envie seu contexto no formulário para estimarmos com precisão.'
  } else if (text.includes('prazo') || text.includes('tempo')) {
    reply = 'Prazos típicos: Start 7-10 dias, Pro 2-4 semanas, Elite 4-8 semanas, dependendo do escopo.'
  } else if (text.includes('contato') || text.includes('email')) {
    reply = 'Deixe seu e-mail no formulário de contato e retornamos rapidamente.'
  } else if (text.includes('crm') || text.includes('automação') || text.includes('automation')) {
    reply = 'Integramos CRM, formulários e analytics. O plano Elite cobre automação avançada com monitoramento.'
  }

  // Optional: forward to n8n first (can return a reply)
  const n8nWebhook = process.env.N8N_CHAT_WEBHOOK
  if (n8nWebhook) {
    try {
      const meta = {
        ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
        ua: req.headers['user-agent'] || '',
        ts: new Date().toISOString(),
        source: 'noro.guru/chat',
      }
      const r = await fetch(n8nWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: req.body?.history || [], meta }),
      })
      if (r.ok) {
        const j = await r.json().catch(() => ({}))
        if (j && typeof j.reply === 'string' && j.reply.trim()) {
          reply = j.reply
        }
      }
    } catch {
      // ignore
    }
  }

  // Optional: use OpenAI if configured
  const apiKey = process.env.OPENAI_API_KEY
  if (apiKey) {
    try {
      const sys = 'Você é o assistente da NORO. Seja conciso, técnico e humano.'
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: String(message || '') },
          ],
          temperature: 0.4,
          max_tokens: 200,
        }),
      })
      if (r.ok) {
        const j = await r.json()
        reply = j.choices?.[0]?.message?.content || reply
      }
    } catch {
      // fallback to rule-based
    }
  }

  return res.status(200).json({ reply })
}
