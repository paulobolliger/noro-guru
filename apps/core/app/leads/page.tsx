import MainLayout from '@/components/layout/MainLayout'
import LeadsClientPage from '@/components/admin/LeadsClientPage'
import { getLeads } from './actions'

export const dynamic = 'force-dynamic'

const mockUser = {
  email: 'dev@noro.com.br',
  nome: 'Desenvolvedor'
}

export default async function LeadsPage() {
  const leads = await getLeads()
  
  return (
    <MainLayout user={mockUser}>
      <LeadsClientPage leads={leads} />
    </MainLayout>
  )
}

