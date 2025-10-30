// Tipos específicos para o Control Plane
export interface ControlPlaneUser {
  id: string;
  nome: string | null;
  email: string;
  role: ControlPlaneRole;
  avatar_url?: string | null;
  ultimo_acesso?: string | null;
  status: UserStatus;
  two_factor_enabled: boolean;
  permissoes: ControlPlanePermission[];
  created_at: string;
}

export type ControlPlaneRole = 'super_admin' | 'admin' | 'operador' | 'auditor' | 'readonly';

export type UserStatus = 'ativo' | 'inativo' | 'pendente' | 'bloqueado';

export interface UserActivity {
  id: string;
  user_id: string;
  tipo: ActivityType;
  descricao: string;
  metadata: Record<string, any>;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

export type ActivityType = 
  | 'login' 
  | 'logout'
  | 'configuracao_alterada'
  | 'tenant_criado'
  | 'tenant_alterado'
  | 'usuario_criado'
  | 'usuario_alterado'
  | 'permissao_alterada'
  | 'api_key_criada'
  | 'webhook_configurado';

export interface ControlPlanePermission {
  id: string;
  nome: string;
  descricao: string;
  grupo: PermissionGroup;
  requer_role?: ControlPlaneRole[];
}

export type PermissionGroup = 
  | 'tenants'
  | 'usuarios'
  | 'configuracoes'
  | 'integracao'
  | 'auditoria'
  | 'api';

// Lista de permissões disponíveis
export const CONTROL_PLANE_PERMISSIONS: ControlPlanePermission[] = [
  // Tenants
  {
    id: 'tenant:create',
    nome: 'Criar Tenants',
    descricao: 'Permite criar novos tenants',
    grupo: 'tenants',
    requer_role: ['super_admin', 'admin']
  },
  {
    id: 'tenant:edit',
    nome: 'Editar Tenants',
    descricao: 'Permite editar configurações de tenants',
    grupo: 'tenants',
    requer_role: ['super_admin', 'admin']
  },
  {
    id: 'tenant:delete',
    nome: 'Remover Tenants',
    descricao: 'Permite remover tenants',
    grupo: 'tenants',
    requer_role: ['super_admin']
  },
  {
    id: 'tenant:view',
    nome: 'Visualizar Tenants',
    descricao: 'Permite visualizar lista de tenants',
    grupo: 'tenants'
  },

  // Usuários
  {
    id: 'user:create',
    nome: 'Criar Usuários',
    descricao: 'Permite criar novos usuários',
    grupo: 'usuarios',
    requer_role: ['super_admin', 'admin']
  },
  {
    id: 'user:edit',
    nome: 'Editar Usuários',
    descricao: 'Permite editar usuários',
    grupo: 'usuarios',
    requer_role: ['super_admin', 'admin']
  },
  {
    id: 'user:delete',
    nome: 'Remover Usuários',
    descricao: 'Permite remover usuários',
    grupo: 'usuarios',
    requer_role: ['super_admin']
  },
  {
    id: 'user:view',
    nome: 'Visualizar Usuários',
    descricao: 'Permite visualizar lista de usuários',
    grupo: 'usuarios'
  },

  // Configurações
  {
    id: 'config:edit',
    nome: 'Editar Configurações',
    descricao: 'Permite editar configurações globais',
    grupo: 'configuracoes',
    requer_role: ['super_admin']
  },
  {
    id: 'config:view',
    nome: 'Visualizar Configurações',
    descricao: 'Permite visualizar configurações',
    grupo: 'configuracoes'
  },

  // Integrações
  {
    id: 'integration:manage',
    nome: 'Gerenciar Integrações',
    descricao: 'Permite configurar integrações',
    grupo: 'integracao',
    requer_role: ['super_admin', 'admin']
  },
  {
    id: 'integration:view',
    nome: 'Visualizar Integrações',
    descricao: 'Permite visualizar integrações',
    grupo: 'integracao'
  },

  // Auditoria
  {
    id: 'audit:view',
    nome: 'Visualizar Logs',
    descricao: 'Permite visualizar logs de auditoria',
    grupo: 'auditoria',
    requer_role: ['super_admin', 'admin', 'auditor']
  },

  // API
  {
    id: 'api:manage',
    nome: 'Gerenciar API',
    descricao: 'Permite gerenciar chaves de API',
    grupo: 'api',
    requer_role: ['super_admin']
  },
  {
    id: 'api:view',
    nome: 'Visualizar API',
    descricao: 'Permite visualizar documentação da API',
    grupo: 'api'
  }
];