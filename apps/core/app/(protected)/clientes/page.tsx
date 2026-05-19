import ClientesClientPage from '@/components/admin/ClientesClientPage'
import { getClientes } from './actions'

export const dynamic = 'force-dynamic'

export default async function ClientesPage() {
  const clientes = await getClientes()
  return <ClientesClientPage clientes={clientes} />
}
