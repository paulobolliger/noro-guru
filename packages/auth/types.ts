import type {
  ModuleKey,
  NoroDatabase,
  PlatformRole,
  TenantRole,
} from '@noro/db';

export type AuthProvider = 'logto';

/**
 * Claims mínimas que qualquer adapter de sessão deve fornecer para os helpers de auth.
 *
 * `subject` é o identificador único do usuário no provedor (Logto `sub` / JWT `sub`).
 * Mapeado para `identity_links.provider_subject` no banco.
 *
 * Adapters concretos (ex.: `LogtoSessionClaims`) devem ser compatíveis com este tipo.
 */
export type AuthClaims = {
  provider?: AuthProvider;
  /** Identificador único do usuário no provedor (equivalente ao `sub` do JWT). */
  subject?: string;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
  [key: string]: unknown;
};

export type AuthSessionAdapter = () => Promise<AuthClaims | null> | AuthClaims | null;

export type AuthUserContext = {
  user: {
    id: string;
    email: string;
    status: string;
    displayName?: string | null;
  };
  identityLink: {
    id: string;
    provider: string;
    providerSubject: string;
    providerEmail?: string | null;
  };
  provider: AuthProvider;
  providerSubject: string;
  claims: AuthClaims;
};

export type AuthContextInput = {
  db: NoroDatabase;
  claims?: AuthClaims | null;
  sessionAdapter?: AuthSessionAdapter;
};

export type TenantContextSource = 'core' | 'control' | 'sites' | 'webhook';

export type TenantContext = {
  tenant: {
    id: string;
    slug: string;
    status: string;
    name: string;
  };
  source: TenantContextSource;
  membership?: {
    id: string;
    tenantId: string;
    userId: string;
    role: TenantRole;
    status: string;
  };
  selectedByPlatformUser?: boolean;
  siteContext?: {
    host?: string;
    slug?: string;
  };
};

export type PlatformContext = {
  user: AuthUserContext['user'];
  roles: PlatformRole[];
  matchedRole?: PlatformRole;
};

export type ModuleAccessContext = {
  module: {
    id: string;
    key: ModuleKey;
    status: string;
  };
  tenantModule?: {
    status: string;
    startsAt?: Date | null;
    endsAt?: Date | null;
    limits?: Record<string, unknown> | null;
    settings?: Record<string, unknown> | null;
  } | null;
  planModule?: {
    status: string;
    limits?: Record<string, unknown> | null;
    settings?: Record<string, unknown> | null;
  } | null;
  enabled: boolean;
  source: string;
  limits?: Record<string, unknown> | null;
  settings?: Record<string, unknown> | null;
};

export type ResolveTenantContextInput = {
  db: NoroDatabase;
  userContext?: AuthUserContext;
  platformContext?: PlatformContext;
  source: TenantContextSource;
  selectedTenantId?: string;
  selectedTenantSlug?: string;
  pathTenantSlug?: string;
  host?: string;
  requestMetadata?: Record<string, unknown>;
};

export type RequireTenantMembershipInput = {
  db: NoroDatabase;
  userContext: AuthUserContext;
  tenantId: string;
  roles?: TenantRole[];
  allowPlatformOverride?: boolean;
  platformContext?: PlatformContext;
  reason?: string;
};

export type RequirePlatformRoleInput = {
  db: NoroDatabase;
  userContext: AuthUserContext;
  roles: PlatformRole[];
  reason?: string;
};

export type RequireModuleEnabledInput = {
  db: NoroDatabase;
  tenantContext: TenantContext;
  moduleKey: ModuleKey;
  now?: Date;
};

export type AuthorizationAction =
  | 'platform:tenants:read'
  | 'platform:tenants:write'
  | 'platform:modules:manage'
  | 'platform:billing:read'
  | 'platform:billing:write'
  | 'tenant:crm:read'
  | 'tenant:crm:write'
  | 'tenant:settings:read'
  | 'tenant:settings:write'
  | 'tenant:finance:read'
  | 'tenant:finance:write'
  | 'tenant:proposals:read'
  | 'tenant:proposals:write'
  | 'tenant:sites:read'
  | 'tenant:sites:write';

export type AuthorizeInput = {
  userContext: AuthUserContext;
  platformContext?: PlatformContext;
  tenantContext?: TenantContext;
  moduleContext?: ModuleAccessContext;
  action: AuthorizationAction;
  resource?: string;
  resourceTenantId?: string;
  assert?: boolean;
};

export type AuthorizationResult = {
  allowed: boolean;
  reason?: string;
  matchedRule?: string;
};
