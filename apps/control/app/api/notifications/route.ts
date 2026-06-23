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

interface NotificationData {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  metadata?: Record<string, any>;
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

    const body = (await req.json().catch(() => null)) as NotificationData | null;
    if (!body) {
      return NextResponse.json(
        { error: 'Corpo da requisição inválido' },
        { status: 400, headers: cors }
      );
    }

    const { title, message, type, userId, metadata } = body;

    // Validação básica
    if (!title || !message) {
      return NextResponse.json(
        { error: 'title e message são obrigatórios' },
        { status: 400, headers: cors }
      );
    }

    const { client, close } = createDatabaseClient();
    try {
      // Se não houver userId específico, buscar usuários admin
      let targetUserIds: string[] = [];

      if (userId) {
        targetUserIds = [userId];
      } else {
        // Buscar user_id de usuários com role admin ou owner no platform.user_tenant_roles
        const adminUsers = await client`
          SELECT DISTINCT user_id 
          FROM platform.user_tenant_roles 
          WHERE role IN ('admin', 'owner')
          LIMIT 10
        `;

        if (adminUsers && adminUsers.length > 0) {
          targetUserIds = adminUsers
            .filter((u: any) => u.user_id)
            .map((u: any) => u.user_id as string);
        }
      }

      // Se não encontrou nenhum usuário, apenas loga
      if (targetUserIds.length === 0) {
        return NextResponse.json(
          {
            success: true,
            message: 'Nenhum usuário encontrado para notificar',
          },
          { status: 200, headers: cors }
        );
      }

      // Criar notificações para cada usuário
      let createdCount = 0;
      for (const authUserId of targetUserIds) {
        await client`
          INSERT INTO comunicacao.notificacoes (user_id, titulo, mensagem, tipo, lida, link)
          VALUES (
            ${authUserId}, 
            ${title}, 
            ${message}, 
            ${type || 'info'}, 
            false, 
            ${metadata?.link || metadata?.href || null}
          )
        `;
        createdCount++;
      }

      return NextResponse.json(
        {
          success: true,
          notificationsCreated: createdCount,
          message: 'Notificações criadas com sucesso',
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
      // Buscar notificações recentes
      const notifications = await client`
        SELECT *
        FROM comunicacao.notificacoes
        ORDER BY created_at DESC
        LIMIT 50
      `;

      const mapped = (notifications || []).map((n: any) => ({
        id: n.id,
        user_id: n.user_id,
        title: n.titulo,
        message: n.mensagem,
        type: n.tipo,
        read: n.lida,
        created_at: n.created_at,
        link: n.link,
        tenant_id: n.tenant_id
      }));

      return NextResponse.json(
        { notifications: mapped },
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
