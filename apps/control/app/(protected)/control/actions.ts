"use server";
import { createDatabaseClient } from "@noro/db";

export async function loadControlMetrics(rangeDays: number = 30, tenantId?: string | null, plan?: string | null) {
  const { client, close } = createDatabaseClient();
  try {
    const since = new Date();
    since.setDate(since.getDate() - Math.max(1, Math.min(90, rangeDays)));

    const [tenantsRows, keysRows, webhooks] = await Promise.all([
      client`SELECT count(*)::int as count FROM platform.tenants`,
      client`SELECT count(*)::int as count FROM platform.api_keys`,
      client`
        SELECT id, tenant_id, provider, event, status, created_at 
        FROM platform.webhooks 
        ORDER BY created_at DESC 
        LIMIT 10
      `
    ]);

    const tenants = tenantsRows[0]?.count ?? 0;
    const keys = keysRows[0]?.count ?? 0;

    // Uso diário (últimos N dias)
    let usage: any[] = [];
    try {
      if (tenantId) {
        usage = await client`
          SELECT * 
          FROM platform.v_api_key_usage_daily 
          WHERE day >= ${since.toISOString().slice(0, 10)} AND tenant_id = ${tenantId}
          ORDER BY day DESC
          LIMIT ${rangeDays}
        `;
      } else {
        usage = await client`
          SELECT * 
          FROM platform.v_api_key_usage_daily 
          WHERE day >= ${since.toISOString().slice(0, 10)}
          ORDER BY day DESC
          LIMIT ${rangeDays}
        `;
      }
    } catch (err) {
      // fallback: sem colunas de latência/tenant
      usage = await client`
        SELECT day, calls 
        FROM platform.v_api_key_usage_daily 
        WHERE day >= ${since.toISOString().slice(0, 10)}
        ORDER BY day DESC
        LIMIT ${rangeDays}
      `;
    }

    usage = (usage ?? []).reverse();

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

    // Tenants (para KPIs e distribuição por plano)
    let tenantsList;
    if (plan) {
      tenantsList = await client`
        SELECT id, name, plan, status, created_at 
        FROM platform.tenants
        WHERE plan = ${plan}
        ORDER BY created_at DESC
        LIMIT 500
      `;
    } else {
      tenantsList = await client`
        SELECT id, name, plan, status, created_at 
        FROM platform.tenants
        ORDER BY created_at DESC
        LIMIT 500
      `;
    }

    const tenantsByPlan = (tenantsList || []).reduce((acc: Record<string, number>, t: any) => {
      const k = String(t.plan || '—');
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tenantsActive = (tenantsList || []).filter(t => (t.status || '').toLowerCase() === 'active').length;
    // Criados por dia
    const createdDaily = (tenantsList || []).reduce((acc: Record<string, number>, t: any) => {
      const day = new Date(t.created_at).toISOString().slice(0, 10);
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
      tenants,
      apiKeys: keys,
      webhooks: webhooks ?? [],
      usage,
      tenantsByPlan,
      tenantsActive,
      createdDaily: createdDailyArr,
      activeBreakdown,
      tenantsOptions,
      plans,
    };
  } finally {
    await close();
  }
}
