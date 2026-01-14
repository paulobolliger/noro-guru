import { createServerSupabaseClient } from '@noro/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Return empty mock data for unauthenticated or initial render to avoid crashing
    return NextResponse.json(getMockData());
  }
  
  // Obter tenant_id
  const { data: userRole } = await supabase
    .from('cp.user_tenant_roles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();

  let tenant_id = userRole?.tenant_id;
  if (!tenant_id) {
       const { data: tenants } = await supabase.from('cp.tenants').select('id').eq('slug', 'noro').single();
       tenant_id = tenants?.id;
  }

  if (!tenant_id) {
      return NextResponse.json(getMockData());
  }

  // Query usage transactions (negative amounts)
  // For 'all' period, we get everything.
  // In real app, apply date filter based on 'period' param.
  
  const { data: transactions } = await supabase
    .from('noro_ai_transactions')
    .select('amount_cents, type, created_at, description')
    .eq('tenant_id', tenant_id)
    .lt('amount_cents', 0); // Only usage (debits)

  if (!transactions || transactions.length === 0) {
      return NextResponse.json(getMockData()); // Return mock if no data yet, so chart looks pretty
  }

  // Calculate Metrics
  const totalItems = transactions.length;
  const totalCostCents = transactions.reduce((acc, curr) => acc + Math.abs(curr.amount_cents), 0);
  const totalCost = totalCostCents / 100;
  const avgCostPerItem = totalItems > 0 ? totalCost / totalItems : 0;

  // Group by Type
  const byType: Record<string, any> = {};
  transactions.forEach(t => {
      const type = t.description?.includes('Roteiro') ? 'site_roteiro' : (t.description?.includes('Artigo') ? 'bulk_artigo' : 'other');
      if (!byType[type]) {
          byType[type] = { count: 0, text_cost: 0, image_cost: 0, total_cost: 0 };
      }
      const cost = Math.abs(t.amount_cents) / 100;
      byType[type].count += 1;
      byType[type].total_cost += cost;
      // Mocking split between text/image
      byType[type].text_cost += cost * 0.8;
      byType[type].image_cost += cost * 0.2;
  });

  // Daily Chart
  // Group by date (YYYY-MM-DD)
  const dailyMap: Record<string, number> = {};
  transactions.forEach(t => {
      const date = new Date(t.created_at).toISOString().split('T')[0];
      if (!dailyMap[date]) dailyMap[date] = 0;
      dailyMap[date] += Math.abs(t.amount_cents) / 100;
  });
  
  const dailyChart = Object.entries(dailyMap).map(([date, cost]) => ({
      date,
      total_cost: cost
  })).sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
      metrics: {
          totalCost,
          totalItems,
          avgCostPerItem,
          totalTextCost: totalCost * 0.8, // Approximation
          totalImageCost: totalCost * 0.2
      },
      dailyChart,
      byType
  });
}

function getMockData() {
    return {
        metrics: {
            totalCost: 0,
            totalItems: 0,
            avgCostPerItem: 0,
            totalTextCost: 0,
            totalImageCost: 0,
        },
        dailyChart: [],
        byType: {}
    };
}
