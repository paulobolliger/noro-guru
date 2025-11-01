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

    const body = await req.json() as NotificationData;
    const { title, message, type, userId, metadata } = body;

    // Validação básica
    if (!title || !message) {
      return NextResponse.json(
        { error: 'title e message são obrigatórios' },
        { status: 400, headers: cors }
      );
    }

    const supabase = await createClient();

    // Se não houver userId específico, buscar usuários admin
    let targetUserIds: string[] = [];

    if (userId) {
      targetUserIds = [userId];
    } else {
      // Buscar auth_user_id de usuários com role admin ou owner
      const { data: adminUsers } = await supabase
        .from('users')
        .select('auth_user_id, user_tenants!inner(role)')
        .in('user_tenants.role', ['admin', 'owner'])
        .eq('user_tenants.ativo', true)
        .limit(10);

      if (adminUsers && adminUsers.length > 0) {
        targetUserIds = adminUsers
          .filter(u => u.auth_user_id)
          .map(u => u.auth_user_id as string);
      }
    }

    // Se não encontrou nenhum usuário, apenas loga
    if (targetUserIds.length === 0) {
      console.log('Nenhum usuário encontrado para notificar:', { title, message });
      return NextResponse.json(
        {
          success: true,
          message: 'Nenhum usuário encontrado para notificar',
        },
        { status: 200, headers: cors }
      );
    }

    // Criar notificações para cada usuário (usar auth_user_id)
    const notifications = targetUserIds.map(authUserId => ({
      user_id: authUserId,
      title,
      message,
      type: type || 'info',
      metadata: metadata || {},
      read: false,
    }));

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) {
      console.error('Erro ao criar notificações:', error);
      return NextResponse.json(
        { error: 'Erro ao criar notificações' },
        { status: 500, headers: cors }
      );
    }

    return NextResponse.json(
      {
        success: true,
        notificationsCreated: data?.length || 0,
        message: 'Notificações criadas com sucesso',
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

    // Buscar notificações recentes
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Erro ao buscar notificações:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar notificações' },
        { status: 500, headers: cors }
      );
    }

    return NextResponse.json(
      { notifications },
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
