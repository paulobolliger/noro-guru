import ClientesClientPage from '@/components/admin/ClientesClientPage';
import { getClientes } from '@/app/clientes/actions';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  const dbClientes = await getClientes();
  const clientes = dbClientes.map((c) => ({
    id: c.id,
    nome: c.nome,
    email: c.email || null,
    telefone: c.phone || null,
    whatsapp: c.whatsapp || null,
    status: c.status || 'ativo',
    tipo: c.tipo || 'pessoa_fisica',
    segmento: c.segmento || null,
    nivel: c.nivel || 'standard',
    total_viagens: 0,
    total_gasto: 0,
    ticket_medio: 0,
    data_ultimo_contato: null,
    created_at: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
    updated_at: c.updatedAt ? c.updatedAt.toISOString() : new Date().toISOString(),
  }));

  return <ClientesClientPage clientes={clientes} />;
}
