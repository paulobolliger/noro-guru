import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

function validateApiKey(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const apiKey = process.env.CONTROL_PLANE_API_KEY;
  
  if (!apiKey) {
    console.warn('CONTROL_PLANE_API_KEY não configurada');
    return false;
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === apiKey;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function POST(req: NextRequest) {
  const cors = buildCorsHeaders(req.headers.get('origin'));

  try {
    // Validar API key
    if (!validateApiKey(req)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401, headers: cors }
      );
    }

    const body = await req.json() as EmailData;
    const { to, subject, html, from, replyTo } = body;

    // Validação básica
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'to, subject e html são obrigatórios' },
        { status: 400, headers: cors }
      );
    }

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: from || 'NORO <contato@noro.guru>',
      to: [to],
      subject,
      html,
      replyTo: replyTo || 'contato@noro.guru',
    });

    if (error) {
      console.error('Erro do Resend:', error);
      return NextResponse.json(
        { error: 'Erro ao enviar email' },
        { status: 500, headers: cors }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messageId: data?.id,
        message: 'Email enviado com sucesso',
      },
      { status: 200, headers: cors }
    );

  } catch (err) {
    console.error('Erro no servidor:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500, headers: cors }
    );
  }
}
