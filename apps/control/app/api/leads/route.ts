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

    const body = (await req.json().catch(() => null)) as LeadData | null;
    if (!body) {
      return NextResponse.json(
        { error: 'Corpo da requisição inválido' },
        { status: 400, headers: cors }
      );
    }

    const { name, email, phone, company, source } = body;

    // Validação básica
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400, headers: cors }
      );
    }

    const { client, close } = createDatabaseClient();
    try {
      // Verificar se já existe lead com este email
      const [existingLead] = await client`
        SELECT id
        FROM platform_crm.leads
        WHERE email = ${email}
        LIMIT 1
      `;

      let leadId: string;

      if (existingLead) {
        // Atualizar lead existente
        const [updatedLead] = await client`
          UPDATE platform_crm.leads
          SET
            organization_name = ${company || name},
            phone = ${phone || null},
            source = ${source || 'website'},
            updated_at = NOW()
          WHERE id = ${existingLead.id}
          RETURNING id
        `;
        leadId = updatedLead.id;
      } else {
        // Criar novo lead
        const [newLead] = await client`
          INSERT INTO platform_crm.leads (
            organization_name,
            email,
            phone,
            source,
            stage
          ) VALUES (
            ${company || name},
            ${email},
            ${phone || null},
            ${source || 'website'},
            'new'
          )
          RETURNING id
        `;
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
    } finally {
      await close();
    }
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

    const { client, close } = createDatabaseClient();
    try {
      const leads = await client`
        SELECT *
        FROM platform_crm.leads
        ORDER BY created_at DESC
        LIMIT 100
      `;

      return NextResponse.json(
        { leads: leads || [] },
        { status: 200, headers: cors }
      );
    } finally {
      await close();
    }
  } catch (err) {
    console.error('Erro no servidor:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500, headers: cors }
    );
  }
}
