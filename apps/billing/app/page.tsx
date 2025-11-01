import { headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import BillingPortal from "@/components/BillingPortal";

export const metadata: Metadata = {
  title: 'Faturamento | Noro Guru',
  description: 'Gerencie sua assinatura e métodos de pagamento',
};

export default async function RootPage() {
  const headersList = headers();
  const supabase = createServerComponentClient({ 
    headers: () => headersList 
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Buscar dados do tenant
  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, email, billing_email')
    .single();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Faturamento</h1>
        <p className="text-gray-600">Gerencie seus planos e pagamentos</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/plans" 
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Planos</h2>
              <p className="text-gray-600">Gerencie os planos disponíveis</p>
            </Link>

            <Link 
              href="/subscriptions" 
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Assinaturas</h2>
              <p className="text-gray-600">Visualize e gerencie assinaturas ativas</p>
            </Link>

            <Link 
              href="/invoices" 
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Faturas</h2>
              <p className="text-gray-600">Histórico de faturas e pagamentos</p>
            </Link>

            <Link 
              href="/reports" 
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Relatórios</h2>
              <p className="text-gray-600">Análise e relatórios financeiros</p>
            </Link>
          </div>
        </div>

        <div className="md:col-span-1">
          {tenant && (
            <BillingPortal
              tenantId={tenant.id}
              customerEmail={tenant.billing_email || tenant.email}
            />
          )}
          <Link 
            href="/settings" 
            className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors block"
          >
            <h2 className="text-xl font-semibold mb-2">Configurações</h2>
            <p className="text-gray-600">Configure integrações e preferências</p>
          </Link>
        </div>
      </div>
    </div>
  );
}