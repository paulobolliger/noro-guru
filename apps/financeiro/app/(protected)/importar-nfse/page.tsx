import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import ImportarNFSeClient from './importar-nfse-client'

export default async function ImportarNFSePage() {
  const supabase = createClient()

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

  return (
    <div className="container mx-auto py-6">
      <ImportarNFSeClient tenantId={tenantId} />
    </div>
  )
}
