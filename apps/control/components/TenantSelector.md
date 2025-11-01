# TenantSelector Component

Componente elegante para seleção de tenant com dropdown, feedback visual e transitions suaves.

## Características

✅ **Dropdown Elegante**: Interface moderna com ícones e badges  
✅ **Server Actions**: Integrado com server actions do Next.js 14  
✅ **Feedback Visual**: Loading states e transitions com `useTransition`  
✅ **Responsivo**: Funciona em mobile e desktop  
✅ **Acessível**: Backdrop para fechar dropdown ao clicar fora  
✅ **Single Tenant**: Mostra apenas o nome quando há apenas um tenant  

## Implementação

### 1. Criar Server Actions

```typescript
// app/(protected)/tenants/actions.ts
'use server';

import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@lib/supabase/server';

export type Tenant = { 
  id: string; 
  name: string; 
  slug: string; 
  role?: string 
};

export async function getUserTenants(): Promise<Tenant[]> {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data } = await supabase
    .from('cp.user_tenant_roles')
    .select(`
      tenant_id,
      role,
      cp_tenants!inner(id, name, slug)
    `)
    .eq('user_id', user.id);
  
  return data?.map(d => ({
    id: d.cp_tenants.id,
    name: d.cp_tenants.name,
    slug: d.cp_tenants.slug,
    role: d.role
  })) ?? [];
}

export async function getActiveTenantId(): Promise<string | null> {
  const cookieStore = cookies();
  return cookieStore.get('active_tenant_id')?.value ?? null;
}

export async function setActiveTenant(formData: FormData) {
  const tenantId = formData.get('tenant_id') as string;
  const cookieStore = cookies();
  
  cookieStore.set('active_tenant_id', tenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 dias
  });
  
  // Força revalidação da página
  revalidatePath('/');
}
```

### 2. Usar no Layout

```tsx
// app/(protected)/layout.tsx
import { TenantSelector } from '@/components/TenantSelector';
import { getUserTenants, getActiveTenantId, setActiveTenant } from './tenants/actions';

export default async function ProtectedLayout({ children }) {
  const tenants = await getUserTenants();
  const activeTenantId = await getActiveTenantId();
  
  return (
    <div>
      {tenants.length > 0 && (
        <div className="border-b border-border bg-card/50">
          <TenantSelector 
            tenants={tenants}
            activeTenantId={activeTenantId}
            onTenantChange={setActiveTenant}
          />
        </div>
      )}
      {children}
    </div>
  );
}
```

## Props

| Prop | Tipo | Descrição |
|------|------|-----------|
| `tenants` | `Tenant[]` | Lista de tenants do usuário |
| `activeTenantId` | `string \| null` | ID do tenant ativo |
| `onTenantChange` | `(formData: FormData) => Promise<void>` | Server action para trocar tenant |

### Tipo Tenant

```typescript
interface Tenant {
  id: string;        // UUID do tenant
  name: string;      // Nome exibido (ex: "Noro Consulting")
  slug: string;      // Slug único (ex: "noro-consulting")
  role?: string;     // Role do usuário (ex: "owner", "admin")
}
```

## Comportamentos

### Tenant Único
Quando há apenas um tenant, o componente renderiza uma versão simplificada:
```tsx
<div className="flex items-center gap-2 px-3 py-2">
  <Building2 />
  <span>Noro Consulting</span>
  <span>(noro-consulting)</span>
</div>
```

### Múltiplos Tenants
Com múltiplos tenants, renderiza um dropdown clicável:
- Click no botão abre/fecha dropdown
- Click no backdrop fecha dropdown
- Click em tenant diferente troca e fecha
- Loading state durante transition

## Estilização

O componente usa classes do Tailwind com tokens do tema:
- `text-muted-foreground` - Textos secundários
- `border-border` - Bordas
- `bg-card` - Background do dropdown
- `bg-accent` - Hover e item ativo
- `text-primary` - Badge de role

### Customizar Cores

```tsx
// Mudar cor do badge de role
<span className="bg-blue-500/10 text-blue-600">
  {tenant.role}
</span>

// Mudar cor do item ativo
<div className="bg-primary/10">
  ...
</div>
```

## Integração com Hooks

Para usar com hooks client-side (futuro):

```tsx
"use client";

import { TenantSelector } from '@/components/TenantSelector';
import { useTenants, useCurrentTenant } from '@/hooks';

export function ClientTenantSelector() {
  const { tenants } = useTenants();
  const { currentTenant, setCurrentTenant } = useCurrentTenant();
  
  const handleChange = async (formData: FormData) => {
    const tenantId = formData.get('tenant_id') as string;
    await setCurrentTenant(tenantId);
  };
  
  return (
    <TenantSelector
      tenants={tenants}
      activeTenantId={currentTenant?.id ?? null}
      onTenantChange={handleChange}
    />
  );
}
```

## Acessibilidade

✅ **Keyboard Navigation**: Enter/Space abre dropdown  
✅ **Focus Management**: Focus visível em todos elementos  
✅ **Screen Readers**: Labels descritivos  
✅ **Backdrop**: Click fora fecha dropdown  
✅ **Loading States**: Desabilita durante transition  

## Performance

- **useTransition**: Mantém UI responsiva durante server action
- **Backdrop Portal**: Não usa z-index alto desnecessariamente
- **Conditional Render**: Só renderiza dropdown quando aberto
- **Memoization**: Tenant ativo calculado apenas quando necessário

## Melhorias Futuras

1. **localStorage**: Persistir seleção no browser
2. **Keyboard Navigation**: Arrow up/down entre options
3. **Search**: Filtro para muitos tenants (>10)
4. **Recents**: Mostrar últimos 3 tenants usados
5. **Avatars**: Logo do tenant ao lado do nome

## Troubleshooting

### Dropdown não fecha ao clicar fora
Verifique se o backdrop tem `z-40` e o dropdown `z-50`:
```tsx
<div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
<div className="absolute ... z-50">...</div>
```

### Server action não funciona
Verifique se a função tem `'use server'` no topo:
```typescript
'use server';

export async function setActiveTenant(formData: FormData) {
  // ...
}
```

### Transition travando
Verifique se está usando `startTransition` corretamente:
```tsx
const [isPending, startTransition] = useTransition();

startTransition(async () => {
  await onTenantChange(formData);
});
```

## Exemplo Completo

Veja a implementação completa em:
- **Componente**: `/apps/control/components/TenantSelector.tsx`
- **Layout**: `/apps/control/app/(protected)/layout.tsx`
- **Actions**: `/apps/control/app/(protected)/tenants/actions.ts`
