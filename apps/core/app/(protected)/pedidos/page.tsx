import { getPedidos } from "./pedidos-actions";
import { PedidosList } from "@/components/admin/pedidos/PedidosList";
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function PedidosPage() {
  const pedidos = await getPedidos();

  return (
    <main className="flex-1 space-y-8">
      <header className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 font-sans">Gerenciamento de Pedidos</h1>
      </header>
      
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
          <PedidosList pedidos={pedidos} />
        </Suspense>
      </section>
    </main>
  );
}