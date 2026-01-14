import { createServerSupabaseClient } from '@noro/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Obter tenant_id
  const { data: userRole } = await supabase
    .from('cp.user_tenant_roles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();

  const tenant_id = userRole?.tenant_id;
  // Fallback para 'noro' tenant se não encontrar (para dev/admin global)
  let finalTenantId = tenant_id;
  if (!finalTenantId) {
       const { data: tenants } = await supabase.from('cp.tenants').select('id').eq('slug', 'noro').single();
       finalTenantId = tenants?.id;
  }

  if (!finalTenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
  }

  // Buscar Saldo
  const { data: wallet } = await supabase
    .from('noro_ai_wallets')
    .select('balance_cents')
    .eq('tenant_id', finalTenantId)
    .single();

  const balance = wallet?.balance_cents || 0;

  // Buscar Histórico Recente
  const { data: transactions } = await supabase
    .from('noro_ai_transactions')
    .select('*')
    .eq('tenant_id', finalTenantId)
    .order('created_at', { ascending: false })
    .limit(10);

  return NextResponse.json({
    balance_cents: balance,
    transactions: transactions || []
  });
}

// Rota de Simulação de Compra de Créditos (Mock)
export async function POST(request: Request) {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { amount_cents, description } = body;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

    if (!tenant_id) return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });

    const { error } = await supabase.from('noro_ai_transactions').insert({
        tenant_id,
        amount_cents,
        type: amount_cents > 0 ? 'purchase' : 'usage',
        description: description || 'Compra de Créditos (Simulação)',
        metadata: { user_id: user.id }
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
