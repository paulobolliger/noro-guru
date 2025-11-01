import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import AdiantamentosClient from './adiantamentos-client'

export default async function AdiantamentosPage() {
  const supabase = createServerComponentClient({ cookies })

  // Verificar autenticação
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Buscar tenant do usuário
  const { data: userTenant } = await supabase
    .from('user_tenants')
    .select('tenant_id')
    .eq('user_id', session.user.id)
    .single()

  if (!userTenant) {
    redirect('/login')
  }

  const tenantId = userTenant.tenant_id

  // Buscar dados em paralelo
  const [
    adiantamentosRes,
    fornecedoresRes,
    saldosRes,
  ] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adiantamentos?tenant_id=${tenantId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fornecedores?tenant_id=${tenantId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adiantamentos/saldos?tenant_id=${tenantId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ])

  const adiantamentos = adiantamentosRes.ok ? await adiantamentosRes.json() : []
  const fornecedores = fornecedoresRes.ok ? await fornecedoresRes.json() : []
  const saldos = saldosRes.ok ? await saldosRes.json() : []

  return (
    <div className="container mx-auto py-6">
      <AdiantamentosClient
        adiantamentos={adiantamentos}
        fornecedores={fornecedores}
        saldos={saldos}
        tenantId={tenantId}
      />
    </div>
  )
}
