# 🪝 Hooks Customizados - Control Plane

Hooks React para gerenciar dados do tenant com **isolamento automático via RLS**.

## 📚 Índice

- [Conceito](#conceito)
- [Tenant Management](#tenant-management)
- [Clientes](#clientes)
- [Leads](#leads)
- [Pedidos](#pedidos)
- [Orçamentos](#orçamentos)
- [Exemplos de Uso](#exemplos-de-uso)

---

## 🔑 Conceito

### **Por que usar estes hooks?**

**✅ Segurança Automática:**
- RLS (Row Level Security) garante isolamento por tenant
- Não precisa adicionar `.eq('tenant_id', ...)` manualmente
- Queries automaticamente filtradas pelo Supabase

**✅ Reutilização:**
- Lógica centralizada em um lugar
- Fácil manutenção
- Consistência em toda aplicação

**✅ TypeScript:**
- Tipos completos para todas entidades
- Autocomplete no VS Code
- Menos bugs em produção

---

## 🏢 Tenant Management

### `useTenants()`
Retorna lista de tenants aos quais o usuário tem acesso.

```typescript
import { useTenants } from '@/hooks';

function TenantList() {
  const { tenants, isLoading, error } = useTenants();
  
  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;
  
  return (
    <ul>
      {tenants.map(tenant => (
        <li key={tenant.id}>{tenant.name}</li>
      ))}
    </ul>
  );
}
```

### `useCurrentTenant()`
Retorna o tenant ativo + função para trocar.

```typescript
import { useCurrentTenant } from '@/hooks';

function TenantSelector() {
  const { currentTenant, tenants, setCurrentTenant } = useCurrentTenant();
  
  return (
    <select 
      value={currentTenant?.id} 
      onChange={(e) => {
        const tenant = tenants.find(t => t.id === e.target.value);
        if (tenant) setCurrentTenant(tenant);
      }}
    >
      {tenants.map(t => (
        <option key={t.id} value={t.id}>{t.name}</option>
      ))}
    </select>
  );
}
```

### `useTenantId()`
Retorna apenas o ID do tenant ativo (útil para queries).

```typescript
import { useTenantId } from '@/hooks';

function MyComponent() {
  const { tenantId, isLoading } = useTenantId();
  
  // tenantId pode ser usado em APIs que precisam do ID
  console.log(tenantId); // "uuid-do-tenant"
}
```

---

## 👥 Clientes

### `useClients(filters?)`
Lista todos os clientes do tenant (RLS filtra automaticamente).

```typescript
import { useClients } from '@/hooks';

function ClientsList() {
  const { clients, isLoading, error } = useClients({
    search: 'joão',
    status: 'ativo',
    nivel: 'ouro'
  });
  
  return (
    <table>
      <tbody>
        {clients.map(client => (
          <tr key={client.id}>
            <td>{client.nome}</td>
            <td>{client.email}</td>
            <td>{client.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Filtros disponíveis:**
- `search?: string` - Busca por nome ou email
- `status?: string` - Filtra por status (ativo/inativo)
- `nivel?: string` - Filtra por nível (bronze/prata/ouro/platina)
- `tipo?: string` - Filtra por tipo (pessoa_fisica/pessoa_juridica)

### `useClient(clientId)`
Busca um cliente específico por ID.

```typescript
import { useClient } from '@/hooks';

function ClientDetail({ id }: { id: string }) {
  const { client, isLoading, error } = useClient(id);
  
  if (isLoading) return <LoadingSkeleton />;
  if (!client) return <p>Cliente não encontrado</p>;
  
  return (
    <div>
      <h1>{client.nome}</h1>
      <p>Email: {client.email}</p>
      <p>Total gasto: R$ {client.total_gasto}</p>
    </div>
  );
}
```

### `useClientsStats()`
Estatísticas dos clientes do tenant.

```typescript
import { useClientsStats } from '@/hooks';

function ClientsStats() {
  const { stats, isLoading } = useClientsStats();
  
  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Ativos: {stats.ativos}</p>
      <p>Bronze: {stats.por_nivel.bronze}</p>
      <p>Prata: {stats.por_nivel.prata}</p>
      <p>Ouro: {stats.por_nivel.ouro}</p>
      <p>Platina: {stats.por_nivel.platina}</p>
    </div>
  );
}
```

---

## 🎯 Leads

### `useLeads(filters?)`
Lista todos os leads do tenant.

```typescript
import { useLeads } from '@/hooks';

function LeadsList() {
  const { leads, isLoading, error } = useLeads({
    status: 'novo',
    origem: 'website'
  });
  
  return (
    <DataTable
      data={leads}
      columns={[
        { key: 'nome', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
        { key: 'valor_estimado', label: 'Valor' }
      ]}
    />
  );
}
```

**Filtros disponíveis:**
- `search?: string` - Busca por nome ou email
- `status?: string` - Filtra por status
- `origem?: string` - Filtra por origem

### `useLead(leadId)`
Busca um lead específico por ID.

### `useLeadsStats()`
Estatísticas dos leads.

```typescript
import { useLeadsStats } from '@/hooks';

function LeadsStats() {
  const { stats, isLoading } = useLeadsStats();
  
  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Novos: {stats.novo}</p>
      <p>Em contato: {stats.contato}</p>
      <p>Proposta: {stats.proposta}</p>
      <p>Ganhos: {stats.ganho}</p>
      <p>Perdidos: {stats.perdido}</p>
      <p>Taxa de conversão: {stats.conversion_rate}%</p>
    </div>
  );
}
```

### `useLeadsPipeline()`
Funil de vendas com valores por etapa.

```typescript
import { useLeadsPipeline } from '@/hooks';

function SalesPipeline() {
  const { pipeline, isLoading } = useLeadsPipeline();
  
  return (
    <div>
      {pipeline.map(stage => (
        <div key={stage.status}>
          <h3>{stage.status}</h3>
          <p>Leads: {stage.count}</p>
          <p>Valor: R$ {stage.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📦 Pedidos

### `usePedidos(filters?)`
Lista todos os pedidos do tenant.

```typescript
import { usePedidos } from '@/hooks';

function PedidosList() {
  const { pedidos, isLoading } = usePedidos({
    status: 'confirmado',
    status_pagamento: 'pendente'
  });
  
  return (
    <table>
      <tbody>
        {pedidos.map(p => (
          <tr key={p.id}>
            <td>{p.numero_pedido}</td>
            <td>{p.titulo}</td>
            <td>R$ {p.valor_total}</td>
            <td>{p.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Filtros disponíveis:**
- `search?: string` - Busca por número ou título
- `status?: string` - Filtra por status
- `status_pagamento?: string` - Filtra por status de pagamento

### `usePedido(pedidoId)`
Busca um pedido específico.

### `usePedidosStats()`
Estatísticas dos pedidos.

```typescript
import { usePedidosStats } from '@/hooks';

function PedidosStats() {
  const { stats, isLoading } = usePedidosStats();
  
  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Valor total: R$ {stats.valor_total.toLocaleString()}</p>
      <p>Valor pago: R$ {stats.valor_pago.toLocaleString()}</p>
      <p>Valor pendente: R$ {stats.valor_pendente.toLocaleString()}</p>
    </div>
  );
}
```

---

## 💰 Orçamentos

### `useOrcamentos(filters?)`
Lista todos os orçamentos do tenant.

```typescript
import { useOrcamentos } from '@/hooks';

function OrcamentosList() {
  const { orcamentos, isLoading } = useOrcamentos({
    status: 'enviado',
    prioridade: 'alta'
  });
  
  return (
    <DataTable
      data={orcamentos}
      columns={[
        { key: 'numero_orcamento', label: 'Número' },
        { key: 'titulo', label: 'Título' },
        { key: 'valor_total', label: 'Valor' },
        { key: 'status', label: 'Status' }
      ]}
    />
  );
}
```

**Filtros disponíveis:**
- `search?: string` - Busca por número ou título
- `status?: string` - Filtra por status
- `prioridade?: string` - Filtra por prioridade

### `useOrcamento(orcamentoId)`
Busca um orçamento específico.

### `useOrcamentosStats()`
Estatísticas dos orçamentos.

```typescript
import { useOrcamentosStats } from '@/hooks';

function OrcamentosStats() {
  const { stats, isLoading } = useOrcamentosStats();
  
  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>Enviados: {stats.enviado}</p>
      <p>Aprovados: {stats.aprovado}</p>
      <p>Taxa de conversão: {stats.taxa_conversao}%</p>
      <p>Valor total: R$ {stats.valor_total.toLocaleString()}</p>
    </div>
  );
}
```

---

## 🎨 Exemplos de Uso

### Página de Dashboard

```typescript
// app/(protected)/page.tsx
import { useClientsStats, useLeadsStats, usePedidosStats } from '@/hooks';
import { KpiCard } from '@/components/dashboard/KpiCard';

export default function DashboardPage() {
  const { stats: clientStats } = useClientsStats();
  const { stats: leadStats } = useLeadsStats();
  const { stats: pedidoStats } = usePedidosStats();
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <KpiCard
        title="Total Clientes"
        value={clientStats.total}
        change={12}
      />
      <KpiCard
        title="Leads Ativos"
        value={leadStats.total}
        change={-3}
      />
      <KpiCard
        title="Receita Total"
        value={`R$ ${pedidoStats.valor_total.toLocaleString()}`}
        change={25}
      />
    </div>
  );
}
```

### Tabela com DataTable Component

```typescript
// app/(protected)/clientes/page.tsx
import { useClients } from '@/hooks';
import { DataTable } from '@/components/ui/DataTable';
import { SkeletonTable } from '@/components/ui/LoadingStates';

export default function ClientesPage() {
  const { clients, isLoading } = useClients();
  
  if (isLoading) return <SkeletonTable rows={10} />;
  
  return (
    <DataTable
      data={clients}
      columns={[
        { key: 'nome', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'telefone', label: 'Telefone' },
        { key: 'status', label: 'Status' },
        { key: 'nivel', label: 'Nível' }
      ]}
      searchable
      searchPlaceholder="Buscar clientes..."
      onRowClick={(client) => router.push(`/clientes/${client.id}`)}
    />
  );
}
```

### Formulário de Filtros

```typescript
import { useState } from 'react';
import { useLeads } from '@/hooks';

function LeadsWithFilters() {
  const [filters, setFilters] = useState({
    status: '',
    origem: ''
  });
  
  const { leads, isLoading } = useLeads(filters);
  
  return (
    <div>
      <div className="filters">
        <select 
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos status</option>
          <option value="novo">Novo</option>
          <option value="contato">Em contato</option>
          <option value="proposta">Proposta enviada</option>
        </select>
        
        <select
          value={filters.origem}
          onChange={(e) => setFilters({ ...filters, origem: e.target.value })}
        >
          <option value="">Todas origens</option>
          <option value="website">Website</option>
          <option value="instagram">Instagram</option>
          <option value="indicacao">Indicação</option>
        </select>
      </div>
      
      <DataTable data={leads} columns={[...]} />
    </div>
  );
}
```

---

## 🔒 Segurança

### **RLS (Row Level Security)**

Todos os hooks confiam no RLS do Supabase para filtrar dados por tenant:

```sql
-- Exemplo de policy (já implementada no banco)
CREATE POLICY p_noro_clientes_select ON public.noro_clientes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() 
      AND utr.tenant_id = noro_clientes.tenant_id
  )
);
```

### **O que isso significa?**

✅ **Você NÃO precisa fazer:**
```typescript
// ❌ ERRADO - redundante e pode ter bugs
const { data } = await supabase
  .from('noro_clientes')
  .select('*')
  .eq('tenant_id', currentTenant) // Desnecessário!
```

✅ **Faça simplesmente:**
```typescript
// ✅ CORRETO - RLS já filtra!
const { data } = await supabase
  .from('noro_clientes')
  .select('*')
// Retorna APENAS clientes do tenant do usuário
```

---

## 📝 Notas Importantes

1. **RLS está habilitado em TODAS as tabelas `noro_*`**
2. **Usuários só veem dados dos tenants aos quais pertencem**
3. **Não é possível vazar dados entre tenants** (garantido pelo Supabase)
4. **Super admins podem ter políticas especiais** (via `cp.is_super_admin()`)

---

## 🚀 Próximos Hooks a Criar

- [ ] `useTarefas()` - Tarefas do tenant
- [ ] `useInteracoes()` - Interações/timeline
- [ ] `useFornecedores()` - Fornecedores
- [ ] `useNotificacoes()` - Notificações do usuário

---

**Documentação gerada automaticamente.**  
**Última atualização:** 29/10/2025
