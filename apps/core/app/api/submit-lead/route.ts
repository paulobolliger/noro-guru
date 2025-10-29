import { NextRequest, NextResponse } from 'next/server';

function buildCorsHeaders(origin: string | null) {
  const allowed = (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes('*') ? '*' : (origin && allowed.includes(origin) ? origin : '');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
  if (allowOrigin) headers['Access-Control-Allow-Origin'] = allowOrigin;
  return headers;
}

export async function OPTIONS(req: NextRequest) {
  const cors = buildCorsHeaders(req.headers.get('origin'));
  return new NextResponse(null, { status: 204, headers: cors });
}

// Handler principal com CORS habilitado
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cors = buildCorsHeaders(req.headers.get('origin'));

    console.log('=== NOVO LEAD RECEBIDO (App Router) ===');
    console.log('Dados:', body);

    // Enviar para o Google Sheets (sem esperar a resposta)
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          nome: body.nome || '',
          email: body.email || '',
          destino: body.destino || '',
          duracao: body.duracao || '',
          interesses: body.interesses || ''
        }),
      }).catch(err => console.error('Erro ao enviar para Google Sheets:', err));
    }

    // Enviar para Telegram (sem esperar a resposta)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `Novo Lead (Site V2)\n\nNome: ${body.nome}\nEmail: ${body.email}\nDestino: ${body.destino}\nDuracao: ${body.duracao} dias\nInteresses: ${body.interesses}`;
      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }).catch(err => console.error('Erro ao enviar para Telegram:', err));
    }

    return NextResponse.json({ success: true, message: 'Lead recebido.' }, { headers: cors });

  } catch (error) {
    console.error('Erro geral na API submit-lead:', error);
    const cors = buildCorsHeaders(req.headers.get('origin'));
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500, headers: cors }
    );
  }
}

