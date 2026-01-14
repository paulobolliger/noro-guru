import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import KpiCard from "@/components/dashboard/KpiCard";
import Link from "next/link";

export default async function TenantsPage() {
  const supabase = createAdminSupabaseClient();

  // Get tenants
  const { data: tenantsData, error } = await supabase
    .schema('cp')
    .from('tenants')
    .select('id, name, slug, plan, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);

  const tenants = tenantsData || [];

  // Get API keys count per tenant
  const { data: apiKeysData } = await supabase
    .schema('cp')
    .from('api_keys')
    .select('tenant_id');

  const apiKeysByTenant = (apiKeysData || []).reduce((acc: Record<string, number>, key: any) => {
    acc[key.tenant_id] = (acc[key.tenant_id] || 0) + 1;
    return acc;
  }, {});

  // Enrich tenants with service info
  const enrichedTenants = tenants.map(t => ({
    ...t,
    apiKeysCount: apiKeysByTenant[t.id] || 0,
  }));

  const ativos = enrichedTenants.filter(t => (t.status || '').toLowerCase() === 'active').length;
  const trial = enrichedTenants.filter(t => (t.plan || '').toLowerCase() === 'trial').length;
  const inativos = enrichedTenants.length - ativos;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tenants</h1>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie seus tenants e suas configurações
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total"
          value={enrichedTenants.length}
        />
        <KpiCard
          label="Ativos"
          value={ativos}
          delta={{ value: 10.5, period: "vs mês anterior" }}
        />
        <KpiCard
          label="Trial"
          value={trial}
        />
        <KpiCard
          label="Inativos"
          value={inativos}
        />
      </div>

      {/* Table */}
      <div className="surface-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviços
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrichedTenants.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{t.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{t.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{t.plan || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1.5">
                      {/* Tenant Badge - Always present */}
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                        Tenant
                      </span>
                      {/* API Badge - If has API keys */}
                      {t.apiKeysCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          API ({t.apiKeysCount})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${(t.status || '').toLowerCase() === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {t.status || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(t.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/tenants/${t.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Gerenciar
                    </Link>
                  </td>
                </tr>
              ))}
              {enrichedTenants.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-gray-500" colSpan={7}>
                    Nenhum tenant encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
