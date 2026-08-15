import { NextRequest, NextResponse } from 'next/server';
import { sendTransactionalEmail } from '@noro/lib';

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

// Define o tipo de dados esperado no corpo da requisição
interface RequestBody {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export async function POST(req: NextRequest) {
  try {
    const { nome, email, assunto, mensagem } = (await req.json()) as RequestBody;
    const cors = buildCorsHeaders(req.headers.get('origin'));

    // Validação simples dos dados recebidos
    if (!nome || !email || !assunto || !mensagem) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400, headers: cors });
    }

    // Envia o e-mail usando o webhook n8n + Brevo SMTP
    const result = await sendTransactionalEmail({
      project_slug: 'nomade_guru',
      template: 'contact_received',
      to: 'guru@nomade.guru',
      variables: {
        nome,
        email,
        assunto,
        mensagem,
      },
    });

    if (!result.success) {
      console.error('Erro de envio de email:', result.error);
      return NextResponse.json({ error: 'Erro ao enviar e-mail.' }, { status: 500, headers: cors });
    }

    return NextResponse.json({ message: 'E-mail enviado com sucesso!', messageId: result.messageId }, { headers: cors });

  } catch (err) {
    console.error('Erro no servidor:', err);
    const cors = buildCorsHeaders(req.headers.get('origin'));
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500, headers: cors });
  }
}

