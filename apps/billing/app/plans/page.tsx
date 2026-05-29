import Link from 'next/link';

export default async function PlansPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Planos</h1>
          <p className="text-gray-600">
            A configuração de planos e preços fica no Stripe.
          </p>
        </div>
        <Link
          href="/"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Voltar
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Sem collection local de planos</h2>
        <p className="text-gray-600">
          `billing.plans` era uma tabela Supabase/Postgres. Como ela não existe na lista
          oficial de modelos de dados legados, o app não mantém um CRUD local de planos.
        </p>
      </div>
    </div>
  );
}
