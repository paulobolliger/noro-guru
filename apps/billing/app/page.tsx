import Link from 'next/link';
import { Metadata } from 'next';
import BillingPortal from '@/components/BillingPortal';
import { getTenantBillingEmail } from '@noro/lib/services/billingService';
import { tenantsService } from '@noro/lib/services/tenantService';

export const metadata: Metadata = {
  title: 'Faturamento | Noro Guru',
  description: 'Gerencie sua assinatura e métodos de pagamento',
};

interface RootPageProps {
  searchParams: {
    tenantId?: string;
  };
}

export default async function RootPage({ searchParams }: RootPageProps) {
  const tenant = searchParams.tenantId
    ? await tenantsService.getById(searchParams.tenantId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Faturamento</h1>
        <p className="text-gray-600">Gerencie planos e pagamentos pelo Stripe.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/plans"
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Planos</h2>
              <p className="text-gray-600">Planos são gerenciados no Stripe.</p>
            </Link>

            <Link
              href="/billing/success"
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">Checkout</h2>
              <p className="text-gray-600">Confirmação de sessões de pagamento.</p>
            </Link>
          </div>
        </div>

        <div className="md:col-span-1">
          {tenant && (
            <BillingPortal
              tenantId={tenant.$id}
              customerEmail={getTenantBillingEmail(tenant)}
            />
          )}
          {!tenant && (
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">Portal do cliente</h2>
              <p className="text-gray-600">
                Abra esta página com um tenant Appwrite válido para acessar o portal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
