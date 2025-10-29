import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@lib/supabase/server';

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
  try {
    const token = params.token;
    const supabase = createServerSupabaseClient();
    const { data: tokenData, error: tokenError } = await supabase
      .from('noro_update_tokens')
      .select('*, cliente:noro_clientes(*)')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json({ success: false, error: 'Token inválido ou não encontrado.' }, { status: 404, headers: cors });
    }
    if (tokenData.used_at) {
      return NextResponse.json({ success: false, error: 'Este link já foi utilizado.' }, { status: 400, headers: cors });
    }
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'Este link expirou.' }, { status: 400, headers: cors });
    }

    return NextResponse.json({ success: true, data: tokenData.cliente }, { headers: cors });
  } catch (err) {
    console.error('Erro GET forms/cliente:', err);
    return NextResponse.json({ success: false, error: 'Erro interno.' }, { status: 500, headers: cors });
  }
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const cors = buildCorsHeaders(req.headers.get('origin'));
  try {
    const token = params.token;
    const payload = await req.json();
    const supabase = createServerSupabaseClient();

    const { data: tokenData, error: tokenError } = await supabase
      .from('noro_update_tokens')
      .select('cliente_id, expires_at, used_at')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json({ success: false, message: 'Token de atualização inválido.' }, { status: 400, headers: cors });
    }
    if (tokenData.used_at) {
      return NextResponse.json({ success: false, message: 'Este link de atualização já foi utilizado.' }, { status: 400, headers: cors });
    }
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: 'Este link de atualização expirou.' }, { status: 400, headers: cors });
    }

    const { cliente_id } = tokenData as { cliente_id: string };

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
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('noro_clientes')
      .update(updates)
      .eq('id', cliente_id);

    if (updateError) {
      console.error('Erro ao atualizar cliente via formulário público:', updateError);
      return NextResponse.json({ success: false, message: `Erro ao salvar os dados: ${updateError.message}` }, { status: 500, headers: cors });
    }

    await supabase
      .from('noro_update_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    return NextResponse.json({ success: true, message: 'Seus dados foram atualizados com sucesso!' }, { headers: cors });
  } catch (err) {
    console.error('Erro POST forms/cliente:', err);
    return NextResponse.json({ success: false, message: 'Erro interno.' }, { status: 500, headers: cors });
  }
}

