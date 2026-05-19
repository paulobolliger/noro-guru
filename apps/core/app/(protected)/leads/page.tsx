import LeadsClientPage from '@/components/admin/LeadsClientPage'
import { getLeads } from './actions'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const leads = await getLeads()
  return <LeadsClientPage leads={leads} />
}
