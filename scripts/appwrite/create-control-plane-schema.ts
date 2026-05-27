import type { Databases as DatabasesType } from 'node-appwrite';

type AppwriteIndexType = 'key' | 'unique' | 'fulltext';

type AttributeType = 'string' | 'integer' | 'float' | 'boolean' | 'datetime';

interface AttributeSpec {
  key: string;
  type: AttributeType;
  required?: boolean;
  size?: number;
  array?: boolean;
}

interface IndexSpec {
  key: string;
  type: AppwriteIndexType;
  attributes: string[];
  orders?: Array<'ASC' | 'DESC'>;
}

interface CollectionSpec {
  id: string;
  name: string;
  attributes: AttributeSpec[];
  indexes: IndexSpec[];
}

interface Summary {
  collectionsCreated: number;
  collectionsSkipped: number;
  attributesCreated: number;
  attributesSkipped: number;
  indexesCreated: number;
  indexesSkipped: number;
}

const STRING_SHORT = 255;
const STRING_MEDIUM = 1024;
const STRING_LONG = 8192;
const JSON_STRING = 65535;

const requiredEnv = [
  'APPWRITE_API_KEY',
  'APPWRITE_DATABASE_ID',
] as const;

const dryRun = process.argv.includes('--dry-run');
const legacySchemaBootstrapAllowed =
  process.env.NORO_ALLOW_LEGACY_APPWRITE_SCHEMA === 'I_UNDERSTAND_THIS_IS_LEGACY';

if (!legacySchemaBootstrapAllowed) {
  throw new Error(
    'Legacy Appwrite schema bootstrap is frozen. Set NORO_ALLOW_LEGACY_APPWRITE_SCHEMA=I_UNDERSTAND_THIS_IS_LEGACY only for audited historical recovery.',
  );
}

function env(name: (typeof requiredEnv)[number]): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function envWithFallback(primary: string, fallback: string): string {
  const value = process.env[primary] || process.env[fallback];
  if (!value) {
    throw new Error(`Missing required environment variable: ${primary} or ${fallback}`);
  }

  return value;
}

const databaseId = env('APPWRITE_DATABASE_ID');

if (databaseId !== 'noro_db') {
  throw new Error(`APPWRITE_DATABASE_ID must be "noro_db"; received "${databaseId}".`);
}

let databases: DatabasesType;

async function initLegacyAppwriteClient(): Promise<void> {
  const { Client, Databases } = await import('node-appwrite');
  const client = new Client()
    .setEndpoint(envWithFallback('APPWRITE_ENDPOINT', 'NEXT_PUBLIC_APPWRITE_ENDPOINT'))
    .setProject(envWithFallback('APPWRITE_PROJECT_ID', 'NEXT_PUBLIC_APPWRITE_PROJECT_ID'))
    .setKey(env('APPWRITE_API_KEY'));

  databases = new Databases(client);
}

const commonCreated = [
  attr('createdAt', 'datetime'),
  attr('updatedAt', 'datetime'),
];

const tenantIndex = index('by_tenant', ['tenantId']);
const createdIndex = index('by_createdAt', ['createdAt']);
const updatedIndex = index('by_updatedAt', ['updatedAt']);

function attr(
  key: string,
  type: AttributeType,
  required = false,
  options: Pick<AttributeSpec, 'size' | 'array'> = {},
): AttributeSpec {
  return { key, type, required, ...options };
}

function jsonAttr(key: string, required = false): AttributeSpec {
  return attr(key, 'string', required, { size: JSON_STRING });
}

function stringAttr(key: string, required = false, size = STRING_SHORT): AttributeSpec {
  return attr(key, 'string', required, { size });
}

function stringArrayAttr(key: string, required = false, size = STRING_SHORT): AttributeSpec {
  return attr(key, 'string', required, { size, array: true });
}

function index(
  key: string,
  attributes: string[],
  type: AppwriteIndexType = 'key',
  orders?: Array<'ASC' | 'DESC'>,
): IndexSpec {
  return { key, type, attributes, orders };
}

const collections: CollectionSpec[] = [
  {
    id: 'billing_plans',
    name: 'Billing Plans',
    attributes: [
      stringAttr('name', true),
      stringAttr('description', false, STRING_LONG),
      attr('price_brl', 'float', true),
      attr('price_usd', 'float', true),
      stringAttr('interval', true),
      jsonAttr('features'),
      stringAttr('stripe_price_id'),
      stringAttr('cielo_plan_id'),
      attr('is_active', 'boolean'),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [index('by_name', ['name']), index('by_interval', ['interval']), index('by_active', ['is_active'])],
  },
  {
    id: 'billing_subscriptions',
    name: 'Billing Subscriptions',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('planId', true),
      stringAttr('status', true),
      attr('current_period_start', 'datetime', true),
      attr('current_period_end', 'datetime', true),
      attr('cancel_at_period_end', 'boolean'),
      attr('canceled_at', 'datetime'),
      attr('trial_start', 'datetime'),
      attr('trial_end', 'datetime'),
      stringAttr('stripe_subscription_id'),
      stringAttr('cielo_subscription_id'),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [
      tenantIndex,
      index('by_plan', ['planId']),
      index('by_status', ['status']),
      index('by_period_end', ['current_period_end']),
      index('by_stripe_subscription', ['stripe_subscription_id']),
    ],
  },
  {
    id: 'billing_invoices',
    name: 'Billing Invoices',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('subscriptionId', true),
      attr('amount_brl', 'float', true),
      attr('amount_usd', 'float', true),
      stringAttr('status', true),
      attr('due_date', 'datetime', true),
      attr('paid_at', 'datetime'),
      stringAttr('stripe_invoice_id'),
      stringAttr('cielo_invoice_id'),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [
      tenantIndex,
      index('by_subscription', ['subscriptionId']),
      index('by_status', ['status']),
      index('by_due_date', ['due_date']),
      index('by_stripe_invoice', ['stripe_invoice_id']),
    ],
  },
  {
    id: 'billing_transactions',
    name: 'Billing Transactions',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('invoiceId', true),
      stringAttr('paymentMethodId'),
      attr('amount_brl', 'float', true),
      attr('amount_usd', 'float', true),
      stringAttr('provider', true),
      stringAttr('status', true),
      stringAttr('stripe_payment_intent_id'),
      stringAttr('cielo_payment_id'),
      stringAttr('error_message', false, STRING_LONG),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [
      tenantIndex,
      index('by_invoice', ['invoiceId']),
      index('by_status', ['status']),
      index('by_provider', ['provider']),
      createdIndex,
    ],
  },
  {
    id: 'billing_payment_methods',
    name: 'Billing Payment Methods',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('provider', true),
      stringAttr('type', true),
      stringAttr('last_four'),
      stringAttr('expiry_month'),
      stringAttr('expiry_year'),
      stringAttr('card_brand'),
      attr('is_default', 'boolean'),
      stringAttr('stripe_payment_method_id'),
      stringAttr('cielo_payment_method_id'),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [
      tenantIndex,
      index('by_provider', ['provider']),
      index('by_default', ['is_default']),
      index('by_stripe_payment_method', ['stripe_payment_method_id']),
    ],
  },
  {
    id: 'cp_plans',
    name: 'Control Plane Plans',
    attributes: [
      stringAttr('code', true),
      stringAttr('name', true),
      attr('price_cents', 'integer', true),
      stringAttr('currency', true),
      attr('is_active', 'boolean', true),
      attr('sort_order', 'integer', true),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [index('unique_code', ['code'], 'unique'), index('by_active', ['is_active']), index('by_sort_order', ['sort_order'])],
  },
  {
    id: 'cp_plan_features',
    name: 'Control Plane Plan Features',
    attributes: [
      stringAttr('planId', true),
      stringAttr('key', true),
      stringAttr('value', true, STRING_LONG),
      ...commonCreated,
    ],
    indexes: [index('by_plan', ['planId']), index('unique_plan_key', ['planId', 'key'], 'unique')],
  },
  {
    id: 'cp_subscriptions',
    name: 'Control Plane Subscriptions',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('planId', true),
      stringAttr('status', true),
      attr('current_period_start', 'datetime'),
      attr('current_period_end', 'datetime'),
      stringAttr('stripe_subscription_id'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_plan', ['planId']), index('by_status', ['status']), index('by_stripe_subscription', ['stripe_subscription_id'])],
  },
  {
    id: 'cp_domains',
    name: 'Control Plane Domains',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('domain', true),
      attr('is_default', 'boolean', true),
      stringAttr('status'),
      stringAttr('siteId'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('unique_domain', ['domain'], 'unique'), index('by_default', ['tenantId', 'is_default']), index('by_site', ['siteId'])],
  },
  {
    id: 'cp_leads',
    name: 'Control Plane Leads',
    attributes: [
      stringAttr('tenantId'),
      stringAttr('organization_name'),
      stringAttr('email'),
      stringAttr('phone'),
      stringAttr('source'),
      stringAttr('stage'),
      attr('value_cents', 'integer'),
      stringAttr('ownerId'),
      stringAttr('utm_source'),
      stringAttr('utm_medium'),
      stringAttr('utm_campaign'),
      stringAttr('utm_content'),
      stringAttr('utm_term'),
      stringAttr('capture_channel'),
      attr('consent', 'boolean'),
      stringAttr('page_url', false, STRING_LONG),
    ],
    indexes: [tenantIndex, index('by_stage', ['stage']), index('by_owner', ['ownerId']), index('by_email', ['email'])],
  },
  {
    id: 'cp_contacts',
    name: 'Control Plane Contacts',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('name', true),
      stringAttr('email'),
      stringAttr('phone'),
      stringAttr('role'),
      attr('is_primary', 'boolean'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_email', ['email']), index('by_primary', ['tenantId', 'is_primary'])],
  },
  {
    id: 'cp_lead_stages',
    name: 'Control Plane Lead Stages',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('slug', true),
      stringAttr('label', true),
      attr('ord', 'integer', true),
      attr('is_won', 'boolean', true),
      attr('is_lost', 'boolean', true),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('unique_tenant_slug', ['tenantId', 'slug'], 'unique'), index('by_order', ['tenantId', 'ord'])],
  },
  {
    id: 'cp_lead_activity',
    name: 'Control Plane Lead Activity',
    attributes: [
      stringAttr('leadId', true),
      stringAttr('actorId'),
      stringAttr('action', true),
      jsonAttr('details', true),
      ...commonCreated,
    ],
    indexes: [index('by_lead', ['leadId']), index('by_actor', ['actorId']), index('by_action', ['action']), createdIndex],
  },
  {
    id: 'cp_tasks',
    name: 'Control Plane Tasks',
    attributes: [
      stringAttr('tenantId'),
      stringAttr('title', true),
      stringAttr('status'),
      attr('due_date', 'datetime'),
      stringAttr('assignedTo'),
      stringAttr('entity_type'),
      stringAttr('entityId'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_status', ['status']), index('by_assigned', ['assignedTo']), index('by_due_date', ['due_date']), index('by_entity', ['entity_type', 'entityId'])],
  },
  {
    id: 'cp_notes',
    name: 'Control Plane Notes',
    attributes: [
      stringAttr('tenantId'),
      stringAttr('entity_type', true),
      stringAttr('entityId', true),
      stringAttr('content', true, STRING_LONG),
      stringAttr('createdBy', true),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_entity', ['entity_type', 'entityId']), index('by_created_by', ['createdBy']), createdIndex],
  },
  {
    id: 'cp_control_plane_users',
    name: 'Control Plane Users',
    attributes: [
      stringAttr('authId'),
      stringAttr('tenantId'),
      stringAttr('email', true),
      stringAttr('nome'),
      stringAttr('role', true),
      stringAttr('status', true),
      attr('two_factor_enabled', 'boolean', true),
      stringArrayAttr('permissoes'),
      jsonAttr('metadata'),
      stringAttr('avatar_url', false, STRING_LONG),
      attr('ultimo_acesso', 'datetime'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('unique_email', ['email'], 'unique'), index('by_auth', ['authId']), index('by_role', ['role']), index('by_status', ['status'])],
  },
  {
    id: 'cp_user_activities',
    name: 'Control Plane User Activities',
    attributes: [
      stringAttr('userId'),
      stringAttr('tenantId'),
      stringAttr('tipo', true),
      stringAttr('descricao', true, STRING_LONG),
      stringAttr('ip_address'),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_user', ['userId']), index('by_tipo', ['tipo']), createdIndex],
  },
  {
    id: 'cp_config',
    name: 'Control Plane Config',
    attributes: [jsonAttr('limites', true), jsonAttr('instancia', true), jsonAttr('servicos', true), ...commonCreated],
    indexes: [updatedIndex],
  },
  {
    id: 'cp_settings',
    name: 'Control Plane Settings',
    attributes: [stringAttr('key', true), jsonAttr('value', true), ...commonCreated],
    indexes: [index('unique_key', ['key'], 'unique')],
  },
  {
    id: 'cp_modules_registry',
    name: 'Control Plane Modules Registry',
    attributes: [
      stringAttr('code', true),
      stringAttr('name', true),
      attr('is_core', 'boolean', true),
      attr('is_active', 'boolean', true),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [index('unique_code', ['code'], 'unique'), index('by_active', ['is_active'])],
  },
  {
    id: 'cp_tenant_modules',
    name: 'Control Plane Tenant Modules',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('moduleId', true),
      attr('enabled', 'boolean', true),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_module', ['moduleId']), index('unique_tenant_module', ['tenantId', 'moduleId'], 'unique'), index('by_enabled', ['enabled'])],
  },
  {
    id: 'cp_tenant_settings',
    name: 'Control Plane Tenant Settings',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('locale'),
      stringAttr('timezone'),
      stringAttr('color_primary'),
      stringAttr('logo_url', false, STRING_LONG),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [index('unique_tenant', ['tenantId'], 'unique')],
  },
  {
    id: 'cp_billing_events',
    name: 'Control Plane Billing Events',
    attributes: [
      stringAttr('tenantId', true),
      attr('period_start', 'datetime', true),
      attr('period_end', 'datetime', true),
      attr('amount_cents', 'integer', true),
      stringAttr('currency', true),
      stringAttr('status', true),
      jsonAttr('items', true),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_status', ['status']), index('by_period', ['period_start', 'period_end'])],
  },
  {
    id: 'cp_subscription_addons',
    name: 'Control Plane Subscription Addons',
    attributes: [
      stringAttr('name', true),
      stringAttr('description', false, STRING_LONG),
      stringAttr('type', true),
      attr('price', 'float', true),
      stringAttr('billing_cycle', true),
      attr('is_public', 'boolean'),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [index('by_type', ['type']), index('by_public', ['is_public'])],
  },
  {
    id: 'cp_subscription_addon_items',
    name: 'Control Plane Subscription Addon Items',
    attributes: [
      stringAttr('subscriptionId'),
      stringAttr('addonId'),
      attr('quantity', 'integer'),
      attr('unit_price', 'float', true),
      attr('total_price', 'float', true),
      attr('started_at', 'datetime', true),
      attr('ends_at', 'datetime'),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [index('by_subscription', ['subscriptionId']), index('by_addon', ['addonId']), index('by_started_at', ['started_at'])],
  },
  {
    id: 'cp_usage_counters',
    name: 'Control Plane Usage Counters',
    attributes: [
      stringAttr('tenantId', true),
      attr('period_start', 'datetime', true),
      attr('period_end', 'datetime', true),
      stringAttr('metric', true),
      attr('value', 'float', true),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_metric', ['metric']), index('unique_tenant_period_metric', ['tenantId', 'period_start', 'period_end', 'metric'], 'unique')],
  },
  {
    id: 'cp_api_keys',
    name: 'Control Plane API Keys',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('name', true),
      stringAttr('hash', true),
      stringAttr('last4', true),
      stringArrayAttr('scope', true),
      attr('expires_at', 'datetime'),
      stringAttr('key_hash'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('unique_hash', ['hash'], 'unique'), index('by_key_hash', ['key_hash']), index('by_expires_at', ['expires_at'])],
  },
  {
    id: 'cp_api_key_logs',
    name: 'Control Plane API Key Logs',
    attributes: [
      stringAttr('keyId', true),
      stringAttr('tenantId', true),
      stringAttr('route', true),
      stringAttr('country_from'),
      stringAttr('country_to'),
      stringAttr('purpose'),
      stringAttr('duration'),
      attr('status', 'integer', true),
      attr('elapsed_ms', 'integer'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_key', ['keyId']), index('by_route', ['route']), index('by_status', ['status']), createdIndex],
  },
  {
    id: 'cp_webhooks',
    name: 'Control Plane Webhooks',
    attributes: [
      stringAttr('tenantId'),
      stringAttr('code', true),
      stringAttr('url', true, STRING_LONG),
      stringAttr('secret'),
      attr('is_active', 'boolean', true),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_code', ['code']), index('by_active', ['is_active'])],
  },
  {
    id: 'cp_webhook_logs',
    name: 'Control Plane Webhook Logs',
    attributes: [
      stringAttr('tenantId'),
      stringAttr('source'),
      stringAttr('event'),
      stringAttr('status'),
      jsonAttr('payload'),
      jsonAttr('response'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_source', ['source']), index('by_event', ['event']), index('by_status', ['status']), createdIndex],
  },
  {
    id: 'cp_stripe_webhook_logs',
    name: 'Control Plane Stripe Webhook Logs',
    attributes: [
      stringAttr('event_type', true),
      stringAttr('status', true),
      jsonAttr('payload', true),
      stringAttr('error', false, STRING_LONG),
      jsonAttr('metadata'),
      ...commonCreated,
    ],
    indexes: [index('by_event_type', ['event_type']), index('by_status', ['status']), createdIndex],
  },
  {
    id: 'cp_support_tickets',
    name: 'Control Plane Support Tickets',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('subject', true, STRING_MEDIUM),
      stringAttr('summary', false, STRING_LONG),
      stringAttr('status', true),
      stringAttr('priority', true),
      stringAttr('channel'),
      stringAttr('requesterId'),
      stringAttr('requester_email'),
      stringAttr('assignedTo'),
      stringArrayAttr('tags', true),
      attr('first_response_at', 'datetime'),
      attr('last_message_at', 'datetime'),
      attr('closed_at', 'datetime'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_status', ['status']), index('by_priority', ['priority']), index('by_assigned', ['assignedTo']), index('by_requester_email', ['requester_email']), index('by_last_message', ['last_message_at'])],
  },
  {
    id: 'cp_support_messages',
    name: 'Control Plane Support Messages',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('ticketId', true),
      stringAttr('senderId'),
      stringAttr('sender_role'),
      stringAttr('body', true, JSON_STRING),
      jsonAttr('attachments', true),
      attr('internal', 'boolean', true),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_ticket', ['ticketId']), index('by_sender', ['senderId']), index('by_internal', ['internal']), createdIndex],
  },
  {
    id: 'cp_support_events',
    name: 'Control Plane Support Events',
    attributes: [
      stringAttr('tenantId', true),
      stringAttr('ticketId', true),
      stringAttr('type', true),
      stringAttr('actorId'),
      jsonAttr('metadata', true),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_ticket', ['ticketId']), index('by_type', ['type']), createdIndex],
  },
  {
    id: 'cp_support_sla',
    name: 'Control Plane Support SLA',
    attributes: [
      stringAttr('ticketId', true),
      stringAttr('tenantId', true),
      stringAttr('policy'),
      attr('target_at', 'datetime'),
      attr('breached_at', 'datetime'),
      attr('resolved_at', 'datetime'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('unique_ticket', ['ticketId'], 'unique'), index('by_target', ['target_at']), index('by_breached', ['breached_at'])],
  },
  {
    id: 'cp_security_audit_log',
    name: 'Control Plane Security Audit Log',
    attributes: [
      stringAttr('userId'),
      stringAttr('tenantId'),
      stringAttr('action', true),
      stringAttr('table_name', true),
      stringAttr('recordId'),
      attr('blocked', 'boolean'),
      stringAttr('reason', false, STRING_LONG),
      stringAttr('ip_address'),
      stringAttr('user_agent', false, STRING_LONG),
      stringAttr('request_path', false, STRING_LONG),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_user', ['userId']), index('by_action', ['action']), index('by_blocked', ['blocked']), createdIndex],
  },
  {
    id: 'cp_security_alerts',
    name: 'Control Plane Security Alerts',
    attributes: [
      stringAttr('userId'),
      stringAttr('tenantId'),
      stringAttr('action'),
      stringAttr('table_name'),
      stringAttr('reason', false, STRING_LONG),
      stringAttr('ip_address'),
      stringAttr('severity'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_user', ['userId']), index('by_severity', ['severity']), createdIndex],
  },
  {
    id: 'cp_system_events',
    name: 'Control Plane System Events',
    attributes: [
      stringAttr('actorUserId'),
      stringAttr('tenantId'),
      stringAttr('type', true),
      stringAttr('message', false, STRING_LONG),
      jsonAttr('data'),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_actor', ['actorUserId']), index('by_type', ['type']), createdIndex],
  },
  {
    id: 'cp_ledger_accounts',
    name: 'Control Plane Ledger Accounts',
    attributes: [
      stringAttr('code', true),
      stringAttr('name', true),
      stringAttr('type', true),
      ...commonCreated,
    ],
    indexes: [index('unique_code', ['code'], 'unique'), index('by_type', ['type'])],
  },
  {
    id: 'cp_ledger_entries',
    name: 'Control Plane Ledger Entries',
    attributes: [
      stringAttr('accountId', true),
      stringAttr('tenantId'),
      attr('amount_cents', 'integer', true),
      stringAttr('memo', false, STRING_LONG),
      attr('occurred_at', 'datetime', true),
      ...commonCreated,
    ],
    indexes: [tenantIndex, index('by_account', ['accountId']), index('by_occurred_at', ['occurred_at'])],
  },
  {
    id: 'cp_produtos_precos',
    name: 'Control Plane Produtos Precos',
    attributes: [
      stringAttr('produtoId', true),
      attr('preco', 'float', true),
      stringAttr('moeda', true),
      attr('vigencia_inicio', 'datetime', true),
      attr('vigencia_fim', 'datetime'),
      ...commonCreated,
    ],
    indexes: [index('by_produto', ['produtoId']), index('by_vigencia_inicio', ['vigencia_inicio']), index('by_vigencia_fim', ['vigencia_fim'])],
  },
];

const summary: Summary = {
  collectionsCreated: 0,
  collectionsSkipped: 0,
  attributesCreated: 0,
  attributesSkipped: 0,
  indexesCreated: 0,
  indexesSkipped: 0,
};

function log(message: string): void {
  console.log(`${dryRun ? '[dry-run] ' : ''}${message}`);
}

async function exists<T>(operation: () => Promise<T>): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }

    throw error;
  }
}

function isNotFound(error: unknown): boolean {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && Number((error as { code: unknown }).code) === 404;
}

function isConflict(error: unknown): boolean {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && Number((error as { code: unknown }).code) === 409;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function createCollectionIfMissing(spec: CollectionSpec): Promise<boolean> {
  const collection = await exists(() => databases.getCollection(databaseId, spec.id));
  if (collection) {
    summary.collectionsSkipped += 1;
    log(`collection exists: ${spec.id}`);
    return true;
  }

  if (dryRun) {
    summary.collectionsCreated += 1;
    log(`would create collection: ${spec.id}`);
    return false;
  }

  await databases.createCollection(databaseId, spec.id, spec.name, [], true, true);
  summary.collectionsCreated += 1;
  log(`created collection: ${spec.id}`);
  return true;
}

async function listAttributeKeys(collectionId: string): Promise<Set<string>> {
  const response = await databases.listAttributes(databaseId, collectionId);
  return new Set(response.attributes.map((attribute) => attribute.key));
}

async function createAttributeIfMissing(collectionId: string, spec: AttributeSpec, existingKeys: Set<string>): Promise<void> {
  if (existingKeys.has(spec.key)) {
    summary.attributesSkipped += 1;
    log(`attribute exists: ${collectionId}.${spec.key}`);
    return;
  }

  if (dryRun) {
    summary.attributesCreated += 1;
    log(`would create attribute: ${collectionId}.${spec.key}`);
    return;
  }

  try {
    await createAttribute(collectionId, spec);
    existingKeys.add(spec.key);
    summary.attributesCreated += 1;
    log(`created attribute: ${collectionId}.${spec.key}`);
  } catch (error) {
    if (isConflict(error)) {
      existingKeys.add(spec.key);
      summary.attributesSkipped += 1;
      log(`attribute already exists: ${collectionId}.${spec.key}`);
      return;
    }

    throw error;
  }
}

async function createAttribute(collectionId: string, spec: AttributeSpec): Promise<unknown> {
  const required = Boolean(spec.required);
  const array = Boolean(spec.array);

  if (spec.type === 'string') {
    return databases.createStringAttribute(
      databaseId,
      collectionId,
      spec.key,
      spec.size ?? STRING_SHORT,
      required,
      undefined,
      array,
    );
  }

  if (spec.type === 'integer') {
    return databases.createIntegerAttribute(databaseId, collectionId, spec.key, required, undefined, undefined, undefined, array);
  }

  if (spec.type === 'float') {
    return databases.createFloatAttribute(databaseId, collectionId, spec.key, required, undefined, undefined, undefined, array);
  }

  if (spec.type === 'boolean') {
    return databases.createBooleanAttribute(databaseId, collectionId, spec.key, required, undefined, array);
  }

  return databases.createDatetimeAttribute(databaseId, collectionId, spec.key, required, undefined, array);
}

async function waitForAttributes(collectionId: string, specs: AttributeSpec[]): Promise<void> {
  if (dryRun || specs.length === 0) {
    return;
  }

  const requiredKeys = new Set(specs.map((spec) => spec.key));
  const maxAttempts = 60;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await databases.listAttributes(databaseId, collectionId);
    const pending = response.attributes.filter((attribute) => (
      requiredKeys.has(attribute.key) && attribute.status !== 'available'
    ));

    if (pending.length === 0) {
      return;
    }

    log(`waiting attributes for ${collectionId}: ${pending.map((attribute) => `${attribute.key}:${attribute.status}`).join(', ')}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Attributes did not become available for collection ${collectionId}.`);
}

async function listIndexKeys(collectionId: string): Promise<Set<string>> {
  const response = await databases.listIndexes(databaseId, collectionId);
  return new Set(response.indexes.map((idx) => idx.key));
}

async function createIndexIfMissing(collectionId: string, spec: IndexSpec, existingKeys: Set<string>): Promise<void> {
  if (existingKeys.has(spec.key)) {
    summary.indexesSkipped += 1;
    log(`index exists: ${collectionId}.${spec.key}`);
    return;
  }

  if (dryRun) {
    summary.indexesCreated += 1;
    log(`would create index: ${collectionId}.${spec.key}`);
    return;
  }

  try {
    await databases.createIndex(databaseId, collectionId, spec.key, spec.type, spec.attributes, spec.orders);
    existingKeys.add(spec.key);
    summary.indexesCreated += 1;
    log(`created index: ${collectionId}.${spec.key}`);
  } catch (error) {
    if (isConflict(error)) {
      existingKeys.add(spec.key);
      summary.indexesSkipped += 1;
      log(`index already exists: ${collectionId}.${spec.key}`);
      return;
    }

    throw error;
  }
}

async function main(): Promise<void> {
  await initLegacyAppwriteClient();

  log(`target database: ${databaseId}`);
  log(`collections in manifest: ${collections.length}`);

  for (const collection of collections) {
    log(`processing collection: ${collection.id}`);
    const collectionAvailable = await createCollectionIfMissing(collection);

    if (!collectionAvailable) {
      log(`skipping attributes and indexes for missing dry-run collection: ${collection.id}`);
      continue;
    }

    const existingAttributeKeys = await listAttributeKeys(collection.id);
    for (const attribute of collection.attributes) {
      await createAttributeIfMissing(collection.id, attribute, existingAttributeKeys);
    }

    await waitForAttributes(collection.id, collection.attributes);

    const existingIndexKeys = await listIndexKeys(collection.id);
    for (const idx of collection.indexes) {
      await createIndexIfMissing(collection.id, idx, existingIndexKeys);
    }
  }

  console.log('\nAppwrite schema creation report');
  console.table(summary);
  console.log(`Mode: ${dryRun ? 'dry-run' : 'apply'}`);
}

main().catch((error) => {
  console.error(`Failed to create Appwrite control plane schema: ${errorMessage(error)}`);
  process.exit(1);
});
