// app/(protected)/users/page.tsx
import { createServerSupabaseClient } from "@noro/lib/supabase/server";
import { redirect } from 'next/navigation';
import UsersTableClient from '@/app/(protected)/users/UsersTableClient';
import SectionHeader from '@/components/layout/SectionHeader';
import { UserCog } from 'lucide-react';

export default async function UsersPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar vínculos user-tenant com dados relacionados (email do usuário e nome do tenant)
  const { data: userTenantRoles, error } = await supabase
    .from('user_tenant_roles')
    .select(`
      id,
      user_id,
      tenant_id,
      role,
      created_at,
      tenant:tenants(name, slug, status, plan),
      user:users(email)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user-tenant roles:', error);
  }

  // Calculate metrics
  const data = userTenantRoles || [];
  const uniqueUsers = new Set(data.map(r => r.user_id)).size;
  const uniqueTenants = new Set(data.map(r => r.tenant_id)).size;
  const admins = data.filter(r => r.role?.toLowerCase() === 'admin').length;
  
  // Recent logins - last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentUsers = data.filter(r => new Date(r.created_at) > sevenDaysAgo).length;

  const metrics = [
    { label: "Total Usuários", value: uniqueUsers, color: "text-[#4aede5]", borderColor: "border-[#4aede5]" },
    { label: "Tenants Ativos", value: uniqueTenants, color: "text-green-400", borderColor: "border-green-400" },
    { label: "Administradores", value: admins, color: "text-purple-400", borderColor: "border-purple-400" },
    { label: "Novos (7d)", value: recentUsers, color: "text-yellow-400", borderColor: "border-yellow-400" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Usuários e Tenants" 
        subtitle="Gerencie os vínculos entre usuários e tenants"
        icon={<UserCog size={28} />}
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1200px] mx-auto px-4 md:px-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`bg-gray-50 dark:bg-[#1a1625] border-2 ${m.borderColor} rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105`}
          >
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {m.label}
            </div>
            <div className={`text-3xl font-bold ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <UsersTableClient data={userTenantRoles || []} />
    </div>
  );
}

