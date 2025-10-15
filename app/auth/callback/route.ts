// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Rota de callback Server-Side para autenticação OAuth (Google).
 * Ela troca o 'code' de autorização por uma sessão do Supabase (salvando-a em cookies).
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // Captura o destino final (e.g., /admin)
  const redirectTo = requestUrl.searchParams.get('redirect') || '/';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Troca o código por uma sessão. A sessão é salva no cookie.
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
        console.error('❌ Erro ao trocar código de autorização:', error);
        // Redireciona para o login com a mensagem de erro.
        return NextResponse.redirect(`${requestUrl.origin}/admin/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  // Redireciona o usuário para o destino final (por exemplo, /admin)
  return NextResponse.redirect(requestUrl.origin + redirectTo);
}