# 🏢 Arquitetura Multi-Tenant - Sistema NORO

**Data de análise:** 29 de outubro de 2025  
**Branch:** update3-subdominios

---

## 📊 **Visão Geral**

O sistema NORO implementa **multi-tenancy através de Row Level Security (RLS)** no Supabase, com duas camadas de dados:

### **Schema `cp` (Control Plane)**
- Gerenciamento de tenants, usuários, billing, API keys
- Tabela central: `cp.tenants`
- Vincula usuários a tenants: `cp.user_tenant_roles`

### **Schema `public` (Dados de Negócio)**
- Clientes, leads, pedidos, orçamentos, tarefas
- Todas tabelas `noro_*` têm coluna `tenant_id NOT NULL`
- RLS habilitado em **todas as tabelas**

---

## 🔐 **Como Funciona a Segurança**

### **1. Vinculação Usuário → Tenant**
```sql
-- Tabela: cp.user_tenant_roles
user_id (UUID) → auth.uid()
tenant_id (UUID) → cp.tenants.id
role (TEXT) → 'owner' | 'admin' | 'member' | 'readonly'
```

### **2. RLS Policies (Padrão em todas tabelas)**

**SELECT Policy:**
```sql
CREATE POLICY p_noro_clientes_select ON public.noro_clientes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() 
      AND utr.tenant_id = noro_clientes.tenant_id
  )
);
```

**INSERT/UPDATE/DELETE Policy:**
```sql
CREATE POLICY p_noro_clientes_modify ON public.noro_clientes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() 
      AND utr.tenant_id = noro_clientes.tenant_id
      AND utr.role IN ('owner', 'admin', 'member')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() 
      AND utr.tenant_id = noro_clientes.tenant_id
      AND utr.role IN ('owner', 'admin', 'member')
  )
);
```

---

## ✅ **Tabelas com Multi-Tenant (tenant_id + RLS)**

### **Stage 1 - Bases**
- ✅ `noro_clientes`
- ✅ `noro_leads`

### **Stage 2 - Orçamentos e Pedidos**
- ✅ `noro_orcamentos`
- ✅ `noro_orcamentos_itens`
- ✅ `noro_pedidos`
- ✅ `noro_pedidos_itens`
- ✅ `noro_pedidos_timeline`

### **Stage 3 - Relacionadas a Clientes**
- ✅ `noro_clientes_contatos_emergencia`
- ✅ `noro_clientes_documentos`
- ✅ `noro_clientes_enderecos`
- ✅ `noro_clientes_milhas`
- ✅ `noro_clientes_preferencias`
- ✅ `noro_tarefas`
- ✅ `noro_interacoes`

### **Stage 4 - Configurações e Outras**
- ✅ `noro_notificacoes`
- ✅ `noro_newsletter`
- ✅ `noro_fornecedores`
- ✅ `noro_configuracoes`
- ✅ `noro_empresa`

---

## 🚨 **Tabelas SEM tenant_id**

### ⚠️ **Tabelas Públicas/Globais**
- `noro_users` - Vinculados via `cp.user_tenant_roles`, não tem tenant_id direto
- `noro_comunicacao_templates` - Templates podem ser globais
- `noro_campanhas` - Verificar se deve ter tenant_id
- `noro_comissoes` - Verificar se deve ter tenant_id
- `noro_transacoes` - **PENDENTE** - deveria ter tenant_id
- `noro_audit_log` - Logs gerais, pode ser global

### ✅ **Tabelas do Control Plane (schema cp)**
- Todas já têm tenant_id ou são vinculadas via `cp.user_tenant_roles`

---

## 🎯 **Como Implementar Queries Seguras**

### **❌ NÃO FAZER (Manual filter)**
```typescript
// ERRADO - pode vazar dados se esquecer o filtro
const { data } = await supabase
  .from('noro_clientes')
  .select('*')
  .eq('tenant_id', currentTenant) // Pode esquecer esta linha!
```

### **✅ FAZER (Confiar no RLS)**
```typescript
// CORRETO - RLS garante isolamento automaticamente
const { data } = await supabase
  .from('noro_clientes')
  .select('*')
// Usuário só vê clientes do seu tenant (via RLS policy)
```

### **✅ MELHOR AINDA (Hook customizado)**
```typescript
// apps/control/hooks/useClients.ts
export function useClients() {
  const supabase = createClient()
  
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('noro_clientes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
      // RLS já filtrou por tenant automaticamente!
    }
  })
}
```

---

## 🔑 **Resolução de Tenant por Domínio**

### **Decisão Consolidada (24/05/2026)**

Estratégia oficial de hosts:

- `noro.guru` -> marketing institucional
- `app.noro.guru` -> produto para clientes/agências
- `admin.noro.guru` -> operação interna
- `sites.noro.guru` -> landing de oferta de sites com IA
- `api.noro.guru` -> endpoint técnico de APIs
- `vistos.noro.guru` -> página comercial da API de vistos
- `supabase.noro.guru` -> reservado para migração/self-host de backend
- `n8n.noro.guru` -> reservado para automações futuras

Modelo por tenant (exemplo `xyz`):

- Site público grátis: `xyz.sites.noro.guru`
- Site público com domínio próprio: `xyz.com.br` (ou `www.xyz.com.br`)
- Área logada SaaS: `app.noro.guru` com contexto por sessão/tenant_id
- Rota contextual opcional no app: `app.noro.guru/t/xyz/...`

Diretriz:

- separar domínio público do site e domínio do backoffice
- evitar usar rotas públicas do site dentro do app, exceto preview/editor

### **Tabela: cp.domains**
```sql
CREATE TABLE cp.domains (
  id uuid PRIMARY KEY,
  tenant_id uuid REFERENCES cp.tenants(id),
  domain text UNIQUE NOT NULL,
  is_default boolean DEFAULT false
);
```

### **Domínios Cadastrados (histórico/legado)**
```sql
-- Tenant: 'noro' (principal)
INSERT INTO cp.domains (tenant_id, domain, is_default) VALUES
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'noro.guru', true),
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'control.noro.guru', false),
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'core.noro.guru', false),
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'visa-api.noro.guru', false);
```

### **Domínios Cadastrados (alvo atual)**
```sql
-- Tenant: 'noro' (principal)
INSERT INTO cp.domains (tenant_id, domain, is_default) VALUES
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'noro.guru', true),
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'app.noro.guru', false),
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'admin.noro.guru', false),
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'sites.noro.guru', false),
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'api.noro.guru', false),
  ((SELECT id FROM cp.tenants WHERE slug='noro'), 'vistos.noro.guru', false);
```

Observação de transição:

- manter `control.noro.guru`, `core.noro.guru` e `visa-api.noro.guru` como aliases temporários
- aplicar redirecionamento gradual para os hosts alvo

### **Função Helper (Layout)**
```typescript
// apps/control/app/(protected)/layout.tsx
async function getTenantFromDomain() {
  const { data } = await supabase
    .from('cp.domains')
    .select('tenant_id, cp.tenants(*)')
    .eq('domain', window.location.hostname)
    .single()
  
  return data?.tenant_id
}
```

---

## 📋 **Checklist de Segurança**

### ✅ **Backend (Supabase)**
- [x] RLS habilitado em todas tabelas `noro_*`
- [x] Policies validam `cp.user_tenant_roles`
- [x] Foreign keys para `cp.tenants(id)` com ON DELETE RESTRICT
- [x] Indexes em todas colunas `tenant_id`
- [x] Backfill de dados existentes para tenant 'noro'

### 🚧 **Frontend (Next.js Control Plane)**
- [ ] Hook `useTenantId()` para obter tenant atual
- [ ] Wrapper `useSupabaseClient()` (opcional, RLS já protege)
- [ ] Seletor de tenant no layout para super_admin
- [ ] Queries confiam no RLS (sem filtros manuais)
- [ ] Toast para feedback de erros de permissão
- [ ] Loading states durante fetch de dados

---

## 🎨 **Integração com Componentes UI**

### **Exemplo: DataTable com RLS**
```typescript
// apps/control/app/(protected)/clientes/page.tsx
import { DataTable } from '@/components/ui/DataTable'
import { useClients } from '@/hooks/useClients'

export default function ClientesPage() {
  const { data: clients, isLoading } = useClients()
  // RLS já filtrou clients por tenant!
  
  return (
    <DataTable
      data={clients || []}
      columns={[
        { key: 'nome', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' }
      ]}
      searchable
      loading={isLoading}
    />
  )
}
```

### **Exemplo: SearchInput Global**
```typescript
// apps/control/app/api/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  const supabase = createClient()
  
  // RLS automaticamente filtra por tenant do usuário!
  const [clients, leads, orders] = await Promise.all([
    supabase.from('noro_clientes').select('*').ilike('nome', `%${query}%`),
    supabase.from('noro_leads').select('*').ilike('nome', `%${query}%`),
    supabase.from('noro_pedidos').select('*').ilike('titulo', `%${query}%`)
  ])
  
  return Response.json({ clients, leads, orders })
}
```

---

## 🚀 **Próximos Passos**

### **Fase 1: Hooks e Context (Prioridade Alta)**
1. Criar `hooks/useTenantId.ts` - Retorna tenant do usuário logado
2. Criar `hooks/useClients.ts` - Clientes com RLS automático
3. Criar `hooks/useLeads.ts` - Leads com RLS automático
4. Criar `hooks/useTenants.ts` - Lista tenants do usuário

### **Fase 2: UI Components (Prioridade Alta)**
1. Integrar `SearchInput` no TopBar com API route
2. Migrar tabelas para `DataTable` component
3. Adicionar `LoadingStates` (SkeletonTable)
4. Implementar `EnhancedToast` provider

### **Fase 3: Seletor de Tenant (Prioridade Média)**
1. Dropdown no layout para super_admin trocar tenant
2. Salvar tenant ativo em localStorage
3. Breadcrumb mostrando tenant atual

### **Fase 4: Auditoria (Prioridade Baixa)**
1. Adicionar `tenant_id` em `noro_audit_log`
2. Adicionar `tenant_id` em `noro_transacoes`
3. Validar que nenhuma query manual usa `.eq('tenant_id')`

---

## 📚 **Referências**

- **Migrations:** `supabase/migrations/20251027094215_multi-tenant-stage*.sql`
- **RLS Docs:** https://supabase.com/docs/guides/auth/row-level-security
- **Control Plane:** `apps/control/app/(protected)/`
- **Components:** `apps/control/components/ui/`

---

## ⚠️ **IMPORTANTE: Nunca Desabilitar RLS**

```sql
-- ❌ NUNCA FAZER ISSO:
ALTER TABLE public.noro_clientes DISABLE ROW LEVEL SECURITY;

-- ✅ Sempre manter:
ALTER TABLE public.noro_clientes ENABLE ROW LEVEL SECURITY;
```

**Consequência de desabilitar RLS:**  
🚨 **VAZAMENTO DE DADOS** - Usuários verão dados de TODOS os tenants!

---

**Documento gerado automaticamente após análise das migrations.**  
**Última atualização:** 24/05/2026 - estratégia de domínio consolidada
