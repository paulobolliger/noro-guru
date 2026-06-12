/**
 * ROTA TEMPORÁRIA — remover após capturar o PLATFORM_OWNER_LOGTO_SUB.
 *
 * GET /auth/whoami
 * Retorna os claims Logto da sessão atual como JSON.
 * Use após /auth/sign-in para capturar o campo "sub".
 */
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';
import { NextResponse } from 'next/server';

export async function GET() {
  const ctx = await getLogtoContext(logtoConfig);

  if (!ctx.isAuthenticated || !ctx.claims) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    sub: ctx.claims.sub,
    email: ctx.claims.email,
    name: ctx.claims.name,
  });
}
