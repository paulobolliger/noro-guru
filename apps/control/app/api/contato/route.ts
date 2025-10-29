import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializa o Resend com a chave da API das variáveis de ambiente
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

    // Envia o e-mail usando a biblioteca Resend
    const { data, error } = await resend.emails.send({
      from: 'Contato Nomade Guru <contato@nomade.guru>', // Domínio verificado no Resend
      to: ['guru@nomade.guru'],
      replyTo: email,
      subject: `Nova mensagem de ${nome}: ${assunto}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Nova Mensagem do Site</h2>
          <p>Você recebeu uma nova mensagem através do formulário de contato.</p>
          <hr>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${assunto}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${mensagem.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Erro do Resend:', error);
      return NextResponse.json({ error: 'Erro ao enviar e-mail.' }, { status: 500, headers: cors });
    }

    return NextResponse.json({ message: 'E-mail enviado com sucesso!', data }, { headers: cors });

  } catch (err) {
    console.error('Erro no servidor:', err);
    const cors = buildCorsHeaders(req.headers.get('origin'));
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500, headers: cors });
  }
}

