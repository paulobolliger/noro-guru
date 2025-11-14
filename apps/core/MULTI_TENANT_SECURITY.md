# Multi-Tenant Security Guide

**Última atualização:** 2025-11-14
**Versão:** 1.0
**Status:** Implementado

---

## 📋 Visão Geral

O sistema Noro utiliza uma arquitetura **multi-tenant com banco de dados compartilhado**, onde múltiplas agências de turismo (tenants) compartilham a mesma infraestrutura mas têm seus dados completamente isolados.

### Modelo de Isolamento

```
┌─────────────────────────────────────────────────┐
│  Camada 1: Middleware (Primeira Linha)          │
│  • Resolve tenant_id por domínio                │
│  • Verifica autenticação                        │
│  • Valida acesso do usuário ao tenant           │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Camada 2: Application Layer (Segunda Linha)    │
│  • Todas queries filtram por tenant_id          │
│  • Todos INSERTs incluem tenant_id              │
│  • Validação de permissões por role             │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Camada 3: Database RLS (Última Linha)          │
│  • Políticas PostgreSQL bloqueiam acesso        │
│  • Backup caso camadas anteriores falhem        │
│  • Auditoria de tentativas bloqueadas           │
└─────────────────────────────────────────────────┘
```

---

## 🔒 Componentes de Segurança

### 1. Middleware (`/apps/core/middleware.ts`)

**Responsabilidades:**
- Extrair domínio da requisição (`request.headers.host`)
- Resolver `tenant_id` consultando tabela `cp.domains`
- Verificar autenticação via Supabase Auth
- Validar que usuário pertence ao tenant via `cp.user_tenant_roles`
- Passar `tenant_id` e `role` via headers para aplicação

**Fluxo:**
```typescript
Request → Extract Host → Query cp.domains → Get tenant_id
  → Check Auth → Query user_tenant_roles → Validate Access
  → Set Headers (x-tenant-id, x-tenant-role) → Continue
```

**Rotas Protegidas:**
- Todas exceto: `/_next/static`, `/_next/image`, `/login`, `/signup`, `/api/auth`

**Em Desenvolvimento:**
- Se domínio não encontrado, usa tenant 'noro' como padrão
- Em produção, retorna 404

### 2. Tenant Context (`/apps/core/lib/tenant.ts`)

**Funções Principais:**

#### `getCurrentTenantId()`
Obtém `tenant_id` do contexto atual (header ou banco).
```typescript
const tenantId = await getCurrentTenantId()
```

#### `getCurrentTenantRole()`
Obtém role do usuário no tenant atual.
```typescript
const role = await getCurrentTenantRole()
// Retorna: 'admin' | 'manager' | 'agent' | 'finance' | 'viewer'
```

#### `validateTenantOwnership(recordTenantId)`
Valida que um registro pertence ao tenant atual.
```typescript
await validateTenantOwnership(record.tenant_id)
// Throws se tenant_id não corresponder
```

### 3. Server Actions

**Padrão Obrigatório:**

```typescript
// ✅ CORRETO - Todos os actions devem seguir este padrão
import { getCurrentTenantId } from '@/lib/tenant'

export async function getRecords() {
  const tenantId = await getCurrentTenantId()

  const { data } = await supabase
    .from('table_name')
    .select('*')
    .eq('tenant_id', tenantId)  // ✅ Filtro obrigatório

  return data
}

export async function createRecord(formData: FormData) {
  const tenantId = await getCurrentTenantId()

  const record = {
    ...extractFormData(formData),
    tenant_id: tenantId,  // ✅ Sempre incluir
  }

  await supabase.from('table_name').insert(record)
}

export async function updateRecord(id: string, formData: FormData) {
  const tenantId = await getCurrentTenantId()

  await supabase
    .from('table_name')
    .update(extractFormData(formData))
    .eq('id', id)
    .eq('tenant_id', tenantId)  // ✅ Filtro obrigatório
}

export async function deleteRecord(id: string) {
  const tenantId = await getCurrentTenantId()

  await supabase
    .from('table_name')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)  // ✅ Filtro obrigatório
}
```

### 4. Row Level Security (RLS)

**Políticas Implementadas:**

Todas as tabelas `noro_*` e `fin_*` possuem RLS habilitado:

```sql
-- Exemplo: noro_leads
ALTER TABLE public.noro_leads ENABLE ROW LEVEL SECURITY;

-- Policy para SELECT
CREATE POLICY "p_noro_leads_select" ON noro_leads
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid()
    AND utr.tenant_id = noro_leads.tenant_id
  )
);

-- Policy para modificações
CREATE POLICY "p_noro_leads_modify" ON noro_leads
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid()
    AND utr.tenant_id = noro_leads.tenant_id
    AND utr.role IN ('admin', 'manager', 'agent')
  )
);
```

**Tabelas Protegidas:**
- `noro_leads`, `noro_clientes`, `noro_orcamentos`, `noro_pedidos`
- `noro_pedidos_itens`, `noro_pedidos_timeline`
- `noro_clientes_*` (enderecos, documentos, contatos, etc)
- `fin_receitas`, `fin_despesas`, `fin_contas_bancarias`
- `fin_categorias`, `fin_comissoes`, `fin_projecoes`

### 5. Database Schema

**Schema de Controle (`cp`):**
```sql
-- Tenants (agências)
cp.tenants (id, name, slug, plan, status, ...)

-- Domínios
cp.domains (id, tenant_id, domain, is_default)

-- Relação Usuário-Tenant
cp.user_tenant_roles (user_id, tenant_id, role)

-- Auditoria de Segurança
cp.security_audit_log (...)
```

**Índices de Performance:**
```sql
-- Todas as tabelas tenant-scoped têm:
CREATE INDEX idx_[table]_tenant ON [table](tenant_id);

-- Índices compostos para queries comuns:
CREATE INDEX idx_fin_receitas_tenant_status
  ON fin_receitas(tenant_id, status);
```

### 6. Auditoria de Segurança

**Logging Automático:**

Tentativas de acesso bloqueadas são logadas em `cp.security_audit_log`:

```typescript
// Chamado automaticamente em violações
await supabase.rpc('cp.log_security_event', {
  p_action: 'ACCESS_DENIED',
  p_table_name: 'noro_leads',
  p_blocked: true,
  p_reason: 'User does not belong to tenant'
})
```

**Consultar Logs:**
```sql
SELECT * FROM cp.security_alerts
WHERE severity = 'critical'
ORDER BY created_at DESC;
```

---

## 🚨 Regras de Desenvolvimento

### ✅ SEMPRE Fazer:

1. **Importar `getCurrentTenantId`** em TODOS os server actions
2. **Filtrar por `tenant_id`** em TODAS as queries SELECT
3. **Incluir `tenant_id`** em TODOS os INSERTs
4. **Adicionar filtro `tenant_id`** em TODOS UPDATE/DELETE
5. **Sanitizar mensagens de erro** (não expor `error.message`)
6. **Testar isolamento** antes de fazer merge

### ❌ NUNCA Fazer:

1. ❌ Confiar APENAS em RLS (sempre filtrar na aplicação)
2. ❌ Usar `service_role_key` em produção (bypassa RLS)
3. ❌ Permitir `tenant_id` vir de form data (sempre do contexto)
4. ❌ Fazer queries sem filtro de `tenant_id`
5. ❌ Expor detalhes de erro do banco ao usuário
6. ❌ Fazer deploy sem rodar testes de isolamento

### Exemplo de Code Review Checklist:

```markdown
Pull Request: [Título]

Checklist de Segurança Multi-Tenant:
- [ ] Middleware valida tenant?
- [ ] Todas queries incluem `.eq('tenant_id', tenantId)`?
- [ ] Todos INSERTs incluem `tenant_id`?
- [ ] Testes de isolamento passam?
- [ ] Sem uso de `service_role_key`?
- [ ] Logs de auditoria ativos?
- [ ] Mensagens de erro sanitizadas?
- [ ] RLS policies verificadas?
```

---

## 🧪 Testes

### Rodar Testes de Isolamento:

```bash
cd apps/core
npm test -- tenant-isolation.test.ts
```

### Testes Críticos:

1. **Isolamento de Leitura:** Tenant A não pode ler dados de Tenant B
2. **Isolamento de Escrita:** Tenant A não pode modificar dados de Tenant B
3. **Isolamento de Deleção:** Tenant A não pode deletar dados de Tenant B
4. **Join Isolation:** Joins não vazam dados entre tenants
5. **SQL Injection:** Tentativas de bypass são bloqueadas

### Teste Manual Rápido:

```typescript
// 1. Criar lead em Tenant A
const leadA = await createLead({ org: 'Agency A', email: 'a@a.com' })

// 2. Logar como usuário de Tenant B
// 3. Tentar acessar lead de Tenant A
const leadFromB = await getLeadById(leadA.id)

// ✅ Deve retornar null ou erro
expect(leadFromB).toBeNull()
```

---

## 🔐 Deployment Checklist

Antes de fazer deploy em produção com múltiplos tenants:

### Pré-Deploy:
- [ ] Migrations aplicadas (user_tenant_roles, audit_log, session context)
- [ ] Políticas RLS de DEV desabilitadas
- [ ] Todos os actions atualizados com `tenant_id`
- [ ] Middleware configurado e testado
- [ ] Testes de isolamento 100% passando
- [ ] Auditoria de segurança ativa

### Pós-Deploy:
- [ ] Monitorar logs de auditoria por 48h
- [ ] Verificar dashboard de segurança
- [ ] Confirmar que nenhum acesso bloqueado legítimo
- [ ] Performance de queries com índices OK

---

## 📊 Monitoramento

### Métricas de Segurança:

**Dashboard de Monitoramento** (`/apps/control/app/(protected)/security`):

- **Tentativas Bloqueadas (24h):** Deve ser baixo (< 10)
- **Violações Críticas:** Deve ser ZERO
- **Tenants Ativos:** Total de tenants com usuários ativos
- **Queries Lentas:** Identificar queries sem índices

### Alertas Configurar:

```
- Se blocked_attempts > 50/hora → Alerta HIGH
- Se severity = 'critical' → Alerta CRITICAL (Slack/Email)
- Se audit_log cresce > 1000 registros/hora → Investigar
```

---

## 🛠️ Troubleshooting

### Problema: Usuário não consegue acessar tenant

**Causa:** Usuário não está em `cp.user_tenant_roles`

**Solução:**
```sql
INSERT INTO cp.user_tenant_roles (user_id, tenant_id, role)
VALUES ('user-uuid', 'tenant-uuid', 'viewer');
```

### Problema: Middleware redirecionando para /404

**Causa:** Domínio não está em `cp.domains`

**Solução:**
```sql
INSERT INTO cp.domains (tenant_id, domain, is_default)
VALUES ('tenant-uuid', 'agencia.core.noro.guru', true);
```

### Problema: RLS bloqueando queries legítimas

**Causa:** Políticas RLS muito restritivas ou `tenant_id` não setado

**Diagnóstico:**
```sql
-- Ver policies ativas
SELECT * FROM pg_policies WHERE tablename = 'noro_leads';

-- Testar query como usuário específico
SET SESSION "request.jwt.claim.sub" = 'user-uuid';
SELECT * FROM noro_leads WHERE tenant_id = 'tenant-uuid';
```

---

## 📚 Arquivos de Referência

| Arquivo | Descrição |
|---------|-----------|
| `apps/core/middleware.ts` | Middleware de resolução de tenant |
| `apps/core/lib/tenant.ts` | Funções de contexto de tenant |
| `apps/core/__tests__/tenant-isolation.test.ts` | Testes de isolamento |
| `supabase/migrations/20251114000001_*.sql` | Migrations de multi-tenancy |
| `supabase/migrations/20251114000002_*.sql` | Funções de sessão |
| `supabase/migrations/20251114000003_*.sql` | Sistema de auditoria |

---

## 🆘 Contato em Caso de Incidente

**Violação de Segurança Detectada:**

1. **Isolar imediatamente:** Desabilitar tenant afetado
2. **Notificar:** Equipe de segurança + stakeholders
3. **Investigar:** Consultar `cp.security_audit_log`
4. **Remediar:** Corrigir vulnerabilidade
5. **Documentar:** Post-mortem completo

**Responsáveis:**
- Tech Lead: [Nome]
- Security: [Nome]
- DevOps: [Nome]

---

## 📝 Changelog

### 2025-11-14 - v1.0 - Implementação Inicial
- ✅ Middleware de resolução de tenant
- ✅ Lib de contexto de tenant
- ✅ Atualização de todos os server actions
- ✅ Migrations de multi-tenancy
- ✅ Sistema de auditoria
- ✅ Testes de isolamento
- ✅ Documentação completa

---

**⚠️ IMPORTANTE:** Este documento deve ser atualizado sempre que houver mudanças na arquitetura de segurança multi-tenant.
