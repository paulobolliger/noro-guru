// app/admin/(protected)/clientes/page.tsx
import ClientesClientPage from "@/components/ClientesClientPage";
import { getClientes } from './actions';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  // Buscar todos os clientes (leads com status 'ganho')
  const clientes = await getClientes();

  return <ClientesClientPage clientes={clientes} />;
}