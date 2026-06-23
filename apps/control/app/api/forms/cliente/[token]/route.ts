import { NextRequest, NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';

function buildCorsHeaders(origin: string | null) {
  const allowed = (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes('*') ? '*' : (origin && allowed.includes(origin) ? origin : '');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const cors = buildCorsHeaders(req.headers.get('origin'));
  const { client, close } = createDatabaseClient();
  try {
    const token = params.token;
    
    const rows = await client`
      SELECT 
        t.*,
        c.id as client_id,
        c.nome as client_nome,
        c.email as client_email,
        c.telefone as client_telefone,
        c.whatsapp as client_whatsapp,
        c.cpf as client_cpf,
        c.passaporte as client_passaporte,
        c.data_nascimento as client_data_nascimento,
        c.nacionalidade as client_nacionalidade,
        c.profissao as client_profissao
      FROM noro_auth.update_tokens t
      LEFT JOIN crm.clients c ON c.id = t.cliente_id
      WHERE t.token = ${token}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Token inválido ou não encontrado.' }, { status: 404, headers: cors });
    }
    const tokenData = rows[0];

    if (tokenData.used_at) {
      return NextResponse.json({ success: false, error: 'Este link já foi utilizado.' }, { status: 400, headers: cors });
    }
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Este link expirou.' }, { status: 400, headers: cors });
    }

    const cliente = tokenData.client_id ? {
      id: tokenData.client_id,
      nome: tokenData.client_nome,
      email: tokenData.client_email,
      telefone: tokenData.client_telefone,
      whatsapp: tokenData.client_whatsapp,
      cpf: tokenData.client_cpf,
      passaporte: tokenData.client_passaporte,
      data_nascimento: tokenData.client_data_nascimento,
      nacionalidade: tokenData.client_nacionalidade,
      profissao: tokenData.client_profissao
    } : null;

    return NextResponse.json({ success: true, data: cliente }, { headers: cors });
  } catch (err) {
    console.error('Erro GET forms/cliente:', err);
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500, headers: cors });
  } finally {
    await close();
  }
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const cors = buildCorsHeaders(req.headers.get('origin'));
  const { client, close } = createDatabaseClient();
  try {
    const token = params.token;
    const payload = await req.json();

    const rows = await client`
      SELECT cliente_id, expires_at, used_at
      FROM noro_auth.update_tokens
      WHERE token = ${token}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Token de atualização inválido.' }, { status: 400, headers: cors });
    }
    const tokenData = rows[0];

    if (tokenData.used_at) {
      return NextResponse.json({ success: false, message: 'Este link de atualização já foi utilizado.' }, { status: 400, headers: cors });
    }
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: 'Este link de atualização expirou.' }, { status: 400, headers: cors });
    }

    const { cliente_id } = tokenData;

    const updates = {
      nome: payload.nome as string,
      email: payload.email as string,
      telefone: payload.telefone as string,
      whatsapp: payload.whatsapp as string,
      cpf: payload.cpf as string,
      passaporte: payload.passaporte as string,
      data_nascimento: payload.data_nascimento as string,
      nacionalidade: payload.nacionalidade as string,
      profissao: payload.profissao as string,
      updated_at: new Date(),
    };

    await client`
      UPDATE crm.clients
      SET ${client(updates)}
      WHERE id = ${cliente_id}
    `;

    await client`
      UPDATE noro_auth.update_tokens
      SET used_at = NOW()
      WHERE token = ${token}
    `;

    return NextResponse.json({ success: true, message: 'Seus dados foram atualizados com sucesso!' }, { headers: cors });
  } catch (err: any) {
    console.error('Erro POST forms/cliente:', err);
    return NextResponse.json({ success: false, message: err.message || 'Erro interno.' }, { status: 500, headers: cors });
  } finally {
    await close();
  }
}

