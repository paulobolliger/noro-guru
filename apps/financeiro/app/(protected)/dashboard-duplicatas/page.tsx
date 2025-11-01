import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import DashboardDuplicatasClient from './dashboard-duplicatas-client'

export default async function DashboardDuplicatasPage() {
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
    duplicatasReceberRes,
    duplicatasPagarRes,
    adiantamentosRes,
    creditosRes,
    agingReceberRes,
    agingPagarRes,
  ] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/duplicatas-receber?tenant_id=${tenantId}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/duplicatas-pagar?tenant_id=${tenantId}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adiantamentos?tenant_id=${tenantId}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creditos?tenant_id=${tenantId}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    }),
    // Views de aging analysis
    supabase
      .from('vw_aging_receber')
      .select('*')
      .eq('tenant_id', tenantId),
    supabase
      .from('vw_aging_pagar')
      .select('*')
      .eq('tenant_id', tenantId),
  ])

  const duplicatasReceber = duplicatasReceberRes.ok ? await duplicatasReceberRes.json() : []
  const duplicatasPagar = duplicatasPagarRes.ok ? await duplicatasPagarRes.json() : []
  const adiantamentos = adiantamentosRes.ok ? await adiantamentosRes.json() : []
  const creditos = creditosRes.ok ? await creditosRes.json() : []
  const agingReceber = agingReceberRes.data || []
  const agingPagar = agingPagarRes.data || []

  return (
    <div className="container mx-auto py-6">
      <DashboardDuplicatasClient
        duplicatasReceber={duplicatasReceber}
        duplicatasPagar={duplicatasPagar}
        adiantamentos={adiantamentos}
        creditos={creditos}
        agingReceber={agingReceber}
        agingPagar={agingPagar}
        tenantId={tenantId}
      />
    </div>
  )
}
