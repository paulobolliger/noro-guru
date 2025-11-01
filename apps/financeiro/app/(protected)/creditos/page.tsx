import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import CreditosClient from './creditos-client'

export default async function CreditosPage() {
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
    creditosRes,
    fornecedoresRes,
    saldosRes,
    duplicatasPagarRes,
  ] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creditos?tenant_id=${tenantId}`, {
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creditos/saldos?tenant_id=${tenantId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/duplicatas-pagar?tenant_id=${tenantId}&status=pendente,parcialmente_paga`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ])

  const creditos = creditosRes.ok ? await creditosRes.json() : []
  const fornecedores = fornecedoresRes.ok ? await fornecedoresRes.json() : []
  const saldos = saldosRes.ok ? await saldosRes.json() : []
  const duplicatasPagar = duplicatasPagarRes.ok ? await duplicatasPagarRes.json() : []

  return (
    <div className="container mx-auto py-6">
      <CreditosClient
        creditos={creditos}
        fornecedores={fornecedores}
        saldos={saldos}
        duplicatasPagar={duplicatasPagar}
        tenantId={tenantId}
      />
    </div>
  )
}
