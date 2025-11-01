# 🎨 Guia Rápido - Novos Componentes UI/UX

## 📦 Componentes Criados

### 1. LoadingStates

```tsx
import { SkeletonCard, SkeletonTable, LoadingOverlay, Spinner, EmptyState } from '@/components/ui/LoadingStates';

// Skeleton para cards
<SkeletonCard className="col-span-3" />

// Skeleton para tabelas
<SkeletonTable rows={10} />

// Loading overlay full-screen
{isLoading && <LoadingOverlay message="Salvando..." />}

// Spinner inline
<Spinner size="md" />

// Empty state
<EmptyState 
  icon={Users}
  title="Nenhum tenant encontrado"
  description="Crie seu primeiro tenant para começar"
  action={<button>Criar Tenant</button>}
/>
```

---

### 2. EnhancedToast

```tsx
import { EnhancedToast, useEnhancedToast } from '@/components/ui/EnhancedToast';

const toast = useEnhancedToast();

// Sucesso
toast.success('Tenant criado', 'O tenant foi criado com sucesso');

// Erro
toast.error('Erro ao salvar', 'Verifique os campos e tente novamente');

// Warning
toast.warning('Atenção', 'Esta ação não pode ser desfeita');

// Info
toast.info('Nova atualização', 'Uma nova versão está disponível');
```

---

### 3. StatusBadge

```tsx
import { StatusBadge, getStatusBadgeVariant } from '@/components/ui/StatusBadge';

// Variantes fixas
<StatusBadge variant="success" withDot>Ativo</StatusBadge>
<StatusBadge variant="error" size="sm">Inativo</StatusBadge>
<StatusBadge variant="warning">Pendente</StatusBadge>

// Mapeamento automático
<StatusBadge variant={getStatusBadgeVariant(tenant.status)}>
  {tenant.status}
</StatusBadge>

// Interativo (clicável)
<StatusBadge 
  variant="info" 
  interactive 
  onClick={() => handleFilter('draft')}
>
  3 Rascunhos
</StatusBadge>
```

---

### 4. KpiCard Melhorado

```tsx
import KpiCard from '@/components/dashboard/KpiCard';
import { Users, DollarSign, TrendingUp } from 'lucide-react';

<KpiCard 
  label="Tenants Ativos"
  value={42}
  icon={Users}
  delta={{ value: 12.5, period: 'mês anterior' }}
  sparkline={[
    { x: 1, y: 30 },
    { x: 2, y: 35 },
    { x: 3, y: 42 }
  ]}
  loading={false}
/>
```

---

### 5. SearchInput

```tsx
import { SearchInput } from '@/components/ui/SearchInput';

<SearchInput
  placeholder="Buscar tenants, usuários, leads..."
  recentSearches={['Tenant ACME', 'João Silva']}
  onSearch={async (query) => {
    const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
    return results.map(r => ({
      id: r.id,
      title: r.name,
      subtitle: r.email,
      type: r.type,
      href: `/${r.type}s/${r.id}`
    }));
  }}
/>
```

---

### 6. DataTable

```tsx
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

<DataTable
  data={tenants}
  columns={[
    { 
      key: 'name', 
      label: 'Nome', 
      sortable: true 
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => (
        <StatusBadge variant={getStatusBadgeVariant(status)}>
          {status}
        </StatusBadge>
      )
    },
    { 
      key: 'created_at', 
      label: 'Criado em', 
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button onClick={() => handleDelete(row.id)}>Excluir</button>
      )
    }
  ]}
  rowKey="id"
  searchable
  searchPlaceholder="Buscar por nome, slug..."
  emptyMessage="Nenhum tenant encontrado"
  onRowClick={(tenant) => router.push(`/tenants/${tenant.id}`)}
  loading={isLoading}
/>
```

---

### 7. Tooltip

```tsx
import { Tooltip } from '@/components/ui/Tooltip';

<Tooltip content="Criar novo tenant" side="right">
  <button>
    <Plus className="w-5 h-5" />
  </button>
</Tooltip>

// Na sidebar collapsed
{!sidebarOpen && (
  <Tooltip content="Dashboard" side="right">
    <Link href="/control">
      <Home className="w-5 h-5" />
    </Link>
  </Tooltip>
)}
```

---

## 🔄 Migrando Código Existente

### Exemplo 1: Tabela de Tenants

**❌ Antes:**
```tsx
<table className="w-full">
  <thead>
    <tr>
      <th>Nome</th>
      <th>Status</th>
      <th>Criado em</th>
    </tr>
  </thead>
  <tbody>
    {tenants.map(t => (
      <tr key={t.id}>
        <td>{t.name}</td>
        <td>{t.status}</td>
        <td>{t.created_at}</td>
      </tr>
    ))}
  </tbody>
</table>
```

**✅ Depois:**
```tsx
<DataTable
  data={tenants}
  columns={[
    { key: 'name', label: 'Nome', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (s) => <StatusBadge variant={getStatusBadgeVariant(s)}>{s}</StatusBadge>
    },
    { key: 'created_at', label: 'Criado em', sortable: true }
  ]}
  rowKey="id"
  searchable
  onRowClick={(t) => router.push(`/tenants/${t.id}`)}
/>
```

---

### Exemplo 2: KPI Cards

**❌ Antes:**
```tsx
<div className="card">
  <p className="text-sm">Tenants</p>
  <p className="text-3xl font-bold">{metrics.tenants}</p>
</div>
```

**✅ Depois:**
```tsx
<KpiCard 
  label="Tenants Ativos"
  value={metrics.tenants}
  icon={Users}
  delta={{ value: 12.5, period: 'mês anterior' }}
  sparkline={metrics.tenantsHistory}
/>
```

---

### Exemplo 3: Loading States

**❌ Antes:**
```tsx
{isLoading ? (
  <div>Carregando...</div>
) : (
  <TenantsList data={tenants} />
)}
```

**✅ Depois:**
```tsx
{isLoading ? (
  <SkeletonTable rows={10} />
) : tenants.length > 0 ? (
  <DataTable data={tenants} columns={columns} rowKey="id" />
) : (
  <EmptyState 
    icon={Users}
    title="Nenhum tenant encontrado"
    action={<button onClick={handleCreate}>Criar Tenant</button>}
  />
)}
```

---

### Exemplo 4: Feedback de Ações

**❌ Antes:**
```tsx
try {
  await createTenant(data);
  alert('Tenant criado!');
} catch (error) {
  alert('Erro ao criar tenant');
}
```

**✅ Depois:**
```tsx
const toast = useEnhancedToast();

try {
  await createTenant(data);
  toast.success('Tenant criado', `${data.name} foi criado com sucesso`);
  router.push('/tenants');
} catch (error) {
  toast.error('Erro ao criar tenant', error.message);
}
```

---

## 🎯 Padrões de Uso

### Pattern 1: Lista com Estados

```tsx
function TenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenants().then(setTenants).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <SkeletonTable rows={10} />;
  }

  if (tenants.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum tenant encontrado"
        description="Crie seu primeiro tenant para começar"
        action={<button>Criar Tenant</button>}
      />
    );
  }

  return <DataTable data={tenants} columns={columns} rowKey="id" />;
}
```

---

### Pattern 2: Formulário com Toast

```tsx
function CreateTenantForm() {
  const toast = useEnhancedToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (data) => {
    setIsSaving(true);
    try {
      await createTenant(data);
      toast.success('Tenant criado', `${data.name} foi criado com sucesso`);
      router.push('/tenants');
    } catch (error) {
      toast.error('Erro ao criar', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {isSaving && <LoadingOverlay message="Criando tenant..." />}
      <form onSubmit={handleSubmit}>
        {/* campos */}
      </form>
    </>
  );
}
```

---

### Pattern 3: Dashboard com KPIs

```tsx
function ControlDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <KpiCard 
        label="Tenants Ativos"
        value={metrics.tenants}
        icon={Users}
        delta={{ value: 12.5 }}
        sparkline={metrics.tenantsHistory}
      />
      <KpiCard 
        label="API Keys"
        value={metrics.apiKeys}
        icon={Key}
      />
      <KpiCard 
        label="Chamadas API"
        value={metrics.apiCalls}
        icon={Activity}
        delta={{ value: -5.2 }}
      />
    </div>
  );
}
```

---

## 🎨 Customização

### Extendendo StatusBadge

```tsx
// Criar variante personalizada
const customBadgeVariants = {
  ...badgeVariants,
  premium: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0'
};

<StatusBadge variant="premium">Premium</StatusBadge>
```

---

### Customizando DataTable

```tsx
// Adicionar ações em cada linha
<DataTable
  data={tenants}
  columns={[
    ...columns,
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)}>
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row)}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]}
  rowKey="id"
/>
```

---

## 📚 Próximos Passos

1. **Integrar SearchInput no TopBar**
2. **Substituir todas as tabelas por DataTable**
3. **Adicionar tooltips na sidebar**
4. **Implementar toast provider global**
5. **Criar página de showcase (Storybook)**

---

**Documentação completa:** `/docs/ui-ux-improvements.md`
