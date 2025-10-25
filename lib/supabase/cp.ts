// lib/supabase/cp.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function supabaseServerAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const cookieStore = cookies();

  const supabase = createServerClient(
    supabaseUrl,
    serviceKey,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }); } catch {} },
        remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: '', ...options }); } catch {} },
      },
    }
  );

  const cp = supabase.schema('cp');

  const fromCp = <T = any>(table: string) => {
    const t = table.startsWith('cp.') ? table.slice(3) : table;
    return cp.from<T>(t);
  };

  const rpcCp = <T = any>(fn: string, params?: Record<string, any>) => {
    const name = fn.replace(/^cp\./, '');
    return cp.rpc<T>(name, params);
  };

  const getDashboardOverview = () => rpcCp('cp_dashboard_overview');
  const getTenants = () => rpcCp('cp_select_tenants');

  // Users API
  const listUsers = (params?: { search?: string; limit?: number; offset?: number }) =>
    rpcCp('cp_list_users', {
      p_search: params?.search ?? null,
      p_limit: params?.limit ?? 20,
      p_offset: params?.offset ?? 0,
    });

  const getUser = (userId: string) => rpcCp('cp_get_user', { p_user_id: userId });
  const listUserMemberships = (userId: string) => rpcCp('cp_list_user_memberships', { p_user_id: userId });
  const upsertMembership = (payload: { user_id: string; tenant_id: string; role: string }) =>
    rpcCp('cp_upsert_membership', { p_user_id: payload.user_id, p_tenant_id: payload.tenant_id, p_role: payload.role });
  const removeMembership = (payload: { user_id: string; tenant_id: string }) =>
    rpcCp('cp_remove_membership', { p_user_id: payload.user_id, p_tenant_id: payload.tenant_id });

  return Object.assign(supabase, {
    fromCp,
    rpcCp,
    getDashboardOverview,
    getTenants,
    listUsers,
    getUser,
    listUserMemberships,
    upsertMembership,
    removeMembership,
  });
}

export async function logAdminEvent(event_type: string, message: string, created_by = 'system') {
  const supabase = supabaseServerAdmin();
  await supabase.fromCp('admin_logs').insert([{ event_type, message, created_by }]);
}

