import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plan } from '@/lib/types';

export default async function PlansPage() {
  const headersList = headers();
  const supabase = createServerComponentClient({ 
    headers: () => headersList 
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: plans } = await supabase
    .from('billing.plans')
    .select('*')
    .order('price_brl');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Planos</h1>
          <p className="text-gray-600">Gerencie os planos disponíveis</p>
        </div>
        <Link
          href="/plans/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Novo Plano
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan: Plan) => (
          <div 
            key={plan.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <span className={`px-2 py-1 text-sm rounded ${
                plan.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {plan.is_active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            {plan.description && (
              <p className="text-gray-600 mb-4">{plan.description}</p>
            )}

            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl font-bold">
                  R$ {plan.price_brl.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  USD {plan.price_usd.toFixed(2)}
                </p>
              </div>
              <span className="text-gray-600 capitalize">
                {plan.interval === 'monthly' && 'Mensal'}
                {plan.interval === 'quarterly' && 'Trimestral'}
                {plan.interval === 'yearly' && 'Anual'}
              </span>
            </div>

            {plan.features && Object.keys(plan.features).length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Recursos</h3>
                <ul className="space-y-1">
                  {Object.entries(plan.features).map(([key, value]) => (
                    <li key={key} className="text-sm text-gray-600">
                      • {key}: {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Link
                href={`/plans/${plan.id}/edit`}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}