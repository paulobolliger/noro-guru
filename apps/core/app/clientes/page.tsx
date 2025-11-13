import MainLayout from '@/components/layout/MainLayout'
import ClientesClientPage from '@/components/admin/ClientesClientPage'
import { getClientes } from './actions'

export const dynamic = 'force-dynamic'

export default async function ClientesPage() {
  const clientes = await getClientes()
  const mockUser = { email: 'dev@noro.com.br', nome: 'Desenvolvedor' }
  
  return (
    <MainLayout user={mockUser}>
      <ClientesClientPage clientes={clientes} />
    </MainLayout>
  )
}
