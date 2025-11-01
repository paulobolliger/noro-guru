// packages/types/noro-users.ts
// Tipos para tabela public.noro_users (usuários do sistema NORO)

export type NoroUserRole = 'cliente' | 'admin' | 'super_admin' | 'agente' | 'financeiro';

export interface NoroUser {
  id: string;
  email: string;
  nome: string | null;
  role: NoroUserRole;
  avatar_url: string | null;
  telefone: string | null;
  whatsapp: string | null;
  tenant_id: string | null;
  control_plane_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NoroUserInsert {
  id?: string;
  email: string;
  nome?: string;
  role?: NoroUserRole;
  avatar_url?: string;
  telefone?: string;
  whatsapp?: string;
  tenant_id?: string;
  control_plane_user_id?: string;
}

export interface NoroUserUpdate {
  email?: string;
  nome?: string;
  role?: NoroUserRole;
  avatar_url?: string;
  telefone?: string;
  whatsapp?: string;
  tenant_id?: string;
  control_plane_user_id?: string;
  updated_at?: string;
}
