# Padronização de Headers - Control Plane

## ✅ Padrão Aplicado

### Design Specs:
- **Background**: `linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))`
- **Padding**: `py-4` (compacto, era py-6/py-8)
- **Layout**: Flexbox horizontal (md:flex-row) com gap-3
- **Título**: `text-xl md:text-2xl` + `text-[#D4AF37]` (dourado)
- **Subtítulo**: `text-xs text-white/80` (quando presente)
- **Sticky**: `sticky top-0 z-30`
- **Max-width**: `max-w-[1200px]` centralizado
- **Botões**: Texto abreviado em mobile (lg:hidden/lg:inline)

---

## ✅ Headers Atualizados

### 1. **LeadHeader.tsx** (Referência)
- ✅ Busca expansível (lupa → input)
- ✅ Toggle Lista/Kanban com contraste correto
- ✅ Botões compactos (ícones + texto responsivo)
- ✅ Filtro de status inline

### 2. **TenantsHeader.tsx**
- ✅ Removido subtítulo para altura compacta
- ✅ Botão "Novo Tenant" → "Novo" (mobile)

### 3. **OrgsHeader.tsx**
- ✅ Título "Clientes/Empresas" (removido "(Control)")
- ✅ Removido subtítulo
- ✅ Botão "Novo Cliente/Empresa" → "Novo" (mobile)

### 4. **EndpointsHeader.tsx** (Webhooks)
- ✅ Transformado de inline para header completo
- ✅ Título "Webhooks" adicionado
- ✅ Botão "Novo Webhook" → "Novo" (mobile)

### 5. **SectionHeader.tsx** (Componente genérico)
- ✅ Atualizado para padrão compacto
- ✅ `sticky` agora é `true` por padrão
- ✅ Subtítulo opcional menor (text-xs)

### 6. **PageHeader.tsx** (Componente genérico)
- ✅ Adicionado gradiente (antes era sem estilo)
- ✅ Prop `sticky` adicionada (true por padrão)
- ✅ Layout responsivo aplicado

### 7. **users/page.tsx**
- ✅ Usa `<SectionHeader>` component

### 8. **financeiro/page.tsx**
- ✅ Usa `<SectionHeader>` component

### 9. **tarefas/page.tsx**
- ✅ Header inline customizado com ícone CalendarCheck
- ✅ Botão "Novo Ticket" → "Novo" (mobile)

---

## 📋 Páginas Pendentes (Para aplicar depois)

### Alta Prioridade:
- [ ] `pedidos/page.tsx` - "Gerenciamento de Pedidos"
- [ ] `pagamentos/page.tsx` - "Processamento de Pagamentos"
- [ ] `billing/page.tsx` - "Billing"
- [ ] `relatorios/page.tsx` - "Relatórios e Análises"

### Média Prioridade:
- [ ] `marketing/page.tsx` - "Ferramentas de Marketing"
- [ ] `email/page.tsx` - "Gestão de E-mails"
- [ ] `comunicacao/page.tsx` - "Comunicação"
- [ ] `sobre-noro/page.tsx` - "Sobre o NORO"

### Páginas de Detalhes (Headers diferentes):
- [ ] `pedidos/[id]/page.tsx` - Detalhes do pedido
- [ ] `pedidos/[id]/editar/page.tsx` - Edição
- [ ] `support/[id]/page.tsx` - Ticket individual
- [ ] `orcamentos/[id]/editar/page.tsx` - Edição de orçamento

### Páginas de Formulário:
- [ ] `clientes/novo/page.tsx` - Usa PageHeader ou formulário direto
- [ ] `control/orgs/[id]/page.tsx` - Detalhes da org

---

## 🎨 Componentes Reutilizáveis

### Para Headers Simples (título + botão):
```tsx
import SectionHeader from '@/components/layout/SectionHeader';

<SectionHeader 
  title="Meu Título"
  subtitle="Descrição opcional"
  right={<NButton>Ação</NButton>}
/>
```

### Para Headers Customizados:
```tsx
<div className="sticky top-0 z-30">
  <div
    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 mb-6 rounded-xl shadow-md"
    style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
  >
    <div className="flex-shrink-0">
      <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">Título</h1>
    </div>
    {/* Actions */}
  </div>
</div>
```

---

## 📝 Checklist para Nova Página

- [ ] Usar `SectionHeader` ou `PageHeader` (se aplicável)
- [ ] Aplicar gradiente roxo padrão
- [ ] Título em dourado (#D4AF37)
- [ ] Padding compacto (py-4)
- [ ] Layout responsivo (flex-col md:flex-row)
- [ ] Botões com texto abreviado em mobile
- [ ] Sticky header (se relevante)
- [ ] Max-width 1200px centralizado

---

## 🎯 Benefícios

1. **Consistência visual** em todas as páginas
2. **Altura reduzida** (mais espaço para conteúdo)
3. **Responsividade** (mobile-first)
4. **Acessibilidade** (contraste WCAG)
5. **Manutenibilidade** (componentes reutilizáveis)
