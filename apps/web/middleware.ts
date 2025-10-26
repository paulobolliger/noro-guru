// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Esta função middleware será executada para cada requisição que corresponda ao 'matcher'
export function middleware(request: NextRequest) {
  // Clona os cabeçalhos da requisição atual para que possamos modificá-los
  const requestHeaders = new Headers(request.headers);

  // Adiciona o pathname da URL atual ao cabeçalho 'x-pathname'
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Retorna a resposta, permitindo que a requisição continue com os novos cabeçalhos
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// O 'matcher' define em quais rotas o middleware deve ser executado.
// Esta configuração padrão executa em todas as rotas, exceto em arquivos estáticos e de API.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};