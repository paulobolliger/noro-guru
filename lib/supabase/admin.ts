// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

// ==============================================
// 🔐 Verificação de variáveis de ambiente
// ==============================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ ERRO: Variáveis de ambiente Supabase Admin não carregadas!");
  throw new Error(
    "As chaves do Supabase Admin (URL ou SERVICE_ROLE_KEY) não estão definidas. Verifique seu .env.local e reinicie o servidor."
  );
}

// ==============================================
// 🧩 Cliente Admin Singleton
// ==============================================
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _supabaseAdmin;
}

// Alias para compatibilidade antiga
export const supabaseAdmin = getSupabaseAdmin();

// ==============================================
// 📊 Função: Métricas do Dashboard
// ==============================================
export async function getDashboardMetrics() {
  const supabase = getSupabaseAdmin();

  const leadsCount = await supabase
    .from('nomade_leads')
    .select('id', { count: 'exact', head: true });

  const postsCount = await supabase
    .from('nomade_blog_posts')
    .select('id', { count: 'exact', head: true });

  const tarefasCount = await supabase
    .from('nomade_tarefas')
    .select('id', { count: 'exact', head: true });

  return {
    leads: leadsCount.count ?? 0,
    posts: postsCount.count ?? 0,
    tarefas: tarefasCount.count ?? 0,
  };
}

// ==============================================
// 📥 Função: Buscar Leads
// ==============================================
export async function getLeads(limit = 20) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ==============================================
// ✅ Função: Buscar Tarefas
// ==============================================
export async function getTarefas(limit = 20) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_tarefas')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ==============================================
// ✍️ Função: Criar Lead (opcional para formulários)
// ==============================================
export async function addLead(nome: string, email: string, origem: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_leads')
    .insert([{ nome, email, origem }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
