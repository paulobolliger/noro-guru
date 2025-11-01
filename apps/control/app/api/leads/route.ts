import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

// Validação de API key
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

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  interest?: string;
  message?: string;
  source?: string;
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

    const body = await req.json() as LeadData;
    const { name, email, phone, company, interest, message, source } = body;

    // Validação básica
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400, headers: cors }
      );
    }

    // Criar cliente Supabase
    const supabase = await createClient();

    // Verificar se já existe lead com este email
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single();

    let leadId: string;

    if (existingLead) {
      // Atualizar lead existente
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          name,
          phone,
          company,
          interest,
          message,
          source: source || 'website',
          last_contact_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar lead:', updateError);
        return NextResponse.json(
          { error: 'Erro ao atualizar lead' },
          { status: 500, headers: cors }
        );
      }

      leadId = updatedLead.id;
    } else {
      // Criar novo lead
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert({
          name,
          email,
          phone,
          company,
          interest,
          message,
          source: source || 'website',
          status: 'new',
          last_contact_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar lead:', insertError);
        return NextResponse.json(
          { error: 'Erro ao criar lead' },
          { status: 500, headers: cors }
        );
      }

      leadId = newLead.id;
    }

    return NextResponse.json(
      {
        success: true,
        leadId,
        message: 'Lead salvo com sucesso',
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

export async function GET(req: NextRequest) {
  const cors = buildCorsHeaders(req.headers.get('origin'));

  try {
    // Validar API key
    if (!validateApiKey(req)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401, headers: cors }
      );
    }

    const supabase = await createClient();

    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Erro ao buscar leads:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar leads' },
        { status: 500, headers: cors }
      );
    }

    return NextResponse.json(
      { leads },
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
