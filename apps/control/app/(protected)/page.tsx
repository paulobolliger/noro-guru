// app/admin/(protected)/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession, getSessionClaims } from '@/lib/session';
import { createDatabaseClient } from '@noro/db';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const userId = ctx.claims?.sub;
  
  if (!userId) {
    return redirect('/auth/sign-in'); 
  }
  
  const { client, close } = createDatabaseClient();

  try {
    const rows = await client`
      SELECT id 
      FROM noro_auth.users_legado
      WHERE id = ${userId}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      const email = ctx.claims?.email || '';
      const nomePadrao = ctx.claims?.name || email.split('@')[0] || 'Novo Admin';
      
      await client`
        INSERT INTO noro_auth.users_legado (id, email, nome, role, created_at)
        VALUES (${userId}, ${email}, ${nomePadrao}, 'admin', NOW())
      `;
    }
  } catch (error: any) {
    console.error('❌ Erro ao criar/verificar perfil:', error);
  } finally {
    await close();
  }
  
  return redirect('/control');
}
    

