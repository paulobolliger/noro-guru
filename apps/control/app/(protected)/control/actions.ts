"use server";
import { createServerSupabaseClient } from "@lib/supabase/server";

export async function loadControlMetrics(rangeDays: number = 30, tenantId?: string | null, plan?: string | null) {
  const supabase = createServerSupabaseClient();
  const since = new Date();
  since.setDate(since.getDate() - Math.max(1, Math.min(90, rangeDays)));

  const [{ count: tenants }, { count: keys }] = await Promise.all([
    supabase.schema('cp').from('tenants').select('*', { count: 'exact', head: true }),
    supabase.schema('cp').from('api_keys').select('*', { count: 'exact', head: true }),
  ]);

  const { data: webhooks } = await supabase
    .schema('cp')
    .from('webhooks')
    .select('id, tenant_id, provider, event, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  // Uso diário (últimos N dias) — tenta incluir p50/p95 se existir, filtra por tenant se possível
  let usage: any[] = [];
  {
    const base = supabase
      .schema('cp')
      .from('v_api_key_usage_daily') as any;

    // tentativa com latências e filtro por tenant
    const tryWithLatency = async () => {
      let q = base
        .select('*')
        .gte('day', since.toISOString().slice(0, 10))
        .order('day', { ascending: false })
        .limit(rangeDays);
      if (tenantId) q = q.eq('tenant_id', tenantId);
      return q;
    };

    let res = await tryWithLatency();
    if (res.error) {
      // fallback: sem colunas de latência/tenant
      res = await base
        .select('day, calls')
        .gte('day', since.toISOString().slice(0, 10))
        .order('day', { ascending: false })
        .limit(rangeDays);
    }
    usage = (res.data ?? []).reverse();

    // Normaliza possíveis campos de erro e calcula rates
    usage = usage.map((u: any) => {
      const calls = Number(u.calls || 0);
      const e4 = Number(
        u.err4xx ?? u.errors_4xx ?? u.http4xx ?? u.count_4xx ?? u.rate_4xx ?? 0
      );
      const e5 = Number(
        u.err5xx ?? u.errors_5xx ?? u.http5xx ?? u.count_5xx ?? u.rate_5xx ?? 0
      );
      const err4xx_count = e4;
      const err5xx_count = e5;
      const err4xx_rate = calls > 0 ? (err4xx_count / calls) * 100 : 0;
      const err5xx_rate = calls > 0 ? (err5xx_count / calls) * 100 : 0;
      return { ...u, err4xx_count, err5xx_count, err4xx_rate, err5xx_rate };
    });
  }

  // Tenants (para KPIs e distribuição por plano)
  let qTenants = supabase
    .schema('cp')
    .from('tenants')
    .select('id, name, plan, status, created_at')
    .order('created_at', { ascending: false })
    .limit(500);
  if (plan) qTenants = qTenants.eq('plan', plan);
  const { data: tenantsList } = await qTenants;

  const tenantsByPlan = (tenantsList || []).reduce((acc: Record<string, number>, t: any) => {
    const k = String(t.plan || '—');
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tenantsActive = (tenantsList || []).filter(t => (t.status || '').toLowerCase() === 'active').length;
  // Criados por dia
  const createdDaily = (tenantsList || []).reduce((acc: Record<string, number>, t: any) => {
    const day = new Date(t.created_at).toISOString().slice(0,10);
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const createdDailyArr = Object.keys(createdDaily).sort().map(d => ({ day: d, count: createdDaily[d] }));

  const activeBreakdown = {
    active: tenantsActive,
    inactive: (tenantsList || []).length - tenantsActive,
  };

  const tenantsOptions = (tenantsList || []).slice(0, 200).map((t: any) => ({ id: t.id, name: t.name, plan: t.plan }));
  const plans = Object.keys(tenantsByPlan);

  return {
    tenants: tenants ?? 0,
    apiKeys: keys ?? 0,
    webhooks: webhooks ?? [],
    usage,
    tenantsByPlan,
    tenantsActive,
    createdDaily: createdDailyArr,
    activeBreakdown,
    tenantsOptions,
    plans,
  };
}
