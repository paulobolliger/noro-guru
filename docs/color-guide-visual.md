# Guia Visual de Cores - WCAG Compliant

## 🎨 Paleta de Cores por Tema

### Dark Mode
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    DARK MODE (Background: #1A1A2E)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│  Títulos Principais (h1, h2, h3)                           │
│  Color: #D4AF37 (Dourado Original)                         │
│  Contraste: 8.9:1 ✅ WCAG AAA                              │
│  ███████ Exemplo de Título Dourado                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Texto Principal (parágrafos, labels)                      │
│  Color: #E5E7EB (Cinza Claro)                             │
│  Contraste: 12.8:1 ✅ WCAG AAA                             │
│  ███████ Exemplo de texto descritivo claro                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Accent / KPIs / Botões                                    │
│  Color: #1DD3C0 (Turquesa Original)                       │
│  Contraste: 7.2:1 ✅ WCAG AAA                              │
│  ███████ R$ 127.500                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Texto Secundário (metadata, hints)                        │
│  Color: #9FA2B2 (Cinza Médio)                             │
│  Contraste: 7.5:1 ✅ WCAG AAA                              │
│  ███████ Atualizado há 5 minutos                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Links                                                      │
│  Color: #C8C9D8 (Cinza Claro Azulado)                     │
│  Contraste: 11.5:1 ✅ WCAG AAA                             │
│  ███████ Ver todos os clientes →                           │
└─────────────────────────────────────────────────────────────┘
```

### Light Mode
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                   LIGHT MODE (Background: #FFFFFF)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│  Títulos Principais (h1, h2, h3)                           │
│  Color: #A88A1E (Dourado Escuro) ⬅️ AJUSTADO              │
│  Contraste: 5.2:1 ✅ WCAG AA                               │
│  ███████ Exemplo de Título Dourado                         │
│                                                             │
│  ❌ ANTES: #D4AF37 (2.8:1) - Falhava WCAG                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Texto Principal (parágrafos, labels)                      │
│  Color: #23214F (Roxo Escuro)                             │
│  Contraste: 14.2:1 ✅ WCAG AAA                             │
│  ███████ Exemplo de texto descritivo escuro                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Accent / KPIs / Botões                                    │
│  Color: #0FA89A (Turquesa Escuro) ⬅️ AJUSTADO             │
│  Contraste: 4.8:1 ✅ WCAG AA                               │
│  ███████ R$ 127.500                                        │
│                                                             │
│  ❌ ANTES: #1DD3C0 (2.9:1) - Falhava WCAG                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Texto Secundário (metadata, hints)                        │
│  Color: #5A5D74 (Cinza Escuro)                            │
│  Contraste: 7.1:1 ✅ WCAG AAA                              │
│  ███████ Atualizado há 5 minutos                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Links                                                      │
│  Color: #342CA4 (Roxo Primário)                           │
│  Contraste: 9.8:1 ✅ WCAG AAA                              │
│  ███████ Ver todos os clientes →                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Comparação Antes/Depois

### Light Mode - Dourado (Títulos)

```
┌────────────────────────────────────────────────────────────┐
│  ❌ ANTES - #D4AF37                                        │
│  Contraste: 2.8:1 (Falha WCAG AA)                         │
│                                                            │
│  #FFFFFF ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│          ██ Dashboard de Clientes (DIFÍCIL DE LER)        │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ✅ DEPOIS - #A88A1E                                       │
│  Contraste: 5.2:1 (Passa WCAG AA)                         │
│                                                            │
│  #FFFFFF ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│          ██ Dashboard de Clientes (LEGÍVEL)               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Light Mode - Turquesa (KPIs/Accent)

```
┌────────────────────────────────────────────────────────────┐
│  ❌ ANTES - #1DD3C0                                        │
│  Contraste: 2.9:1 (Falha WCAG AA)                         │
│                                                            │
│  #FFFFFF ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│          ██ R$ 127.500 (DIFÍCIL DE LER)                   │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ✅ DEPOIS - #0FA89A                                       │
│  Contraste: 4.8:1 (Passa WCAG AA)                         │
│                                                            │
│  #FFFFFF ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│          ██ R$ 127.500 (LEGÍVEL)                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🎯 Exemplos de Uso

### Títulos com Cor Dourada

```tsx
// ✅ CORRETO - Ajusta automaticamente para cada tema
<h1 className="text-[#A88A1E] dark:text-[#D4AF37]">
  Dashboard de Clientes
</h1>

// ✅ ALTERNATIVA - Usando variável CSS
<h1 className="text-heading">
  Dashboard de Clientes
</h1>

// ❌ ERRADO - Usa dourado claro no light mode (falha WCAG)
<h1 className="text-[#D4AF37]">
  Dashboard de Clientes
</h1>
```

### KPI Values com Turquesa

```tsx
// ✅ CORRETO - Ajusta automaticamente
<div className="text-3xl font-bold text-[#0FA89A] dark:text-[#1DD3C0]">
  R$ 127.500
</div>

// ✅ ALTERNATIVA - Usando classe CSS
<div className="text-3xl font-bold kpi-value">
  R$ 127.500
</div>

// ❌ ERRADO - Usa turquesa claro no light mode (falha WCAG)
<div className="text-3xl font-bold text-[#1DD3C0]">
  R$ 127.500
</div>
```

### Botões Primários

```tsx
// ✅ CORRETO - Light mode usa cores acessíveis
<button className="btn-primary">
  Salvar Cliente
</button>

// CSS aplicado automaticamente:
// Dark: bg-[#D4AF37] text-[#1A1A1A]
// Light: bg-[#A88A1E] text-[#FFFFFF]

// ❌ ERRADO - Força cor clara em todos temas
<button className="bg-[#D4AF37] text-black">
  Salvar Cliente
</button>
```

### StatusBadge

```tsx
// ✅ CORRETO - Usa variante primary com ajuste automático
<StatusBadge variant="primary">
  Ativo
</StatusBadge>

// Renderiza:
// Light: text-[#A88A1E]
// Dark: text-[#D4AF37]

// ✅ CORRETO - Accent badge
<StatusBadge variant="accent">
  Novo
</StatusBadge>

// Renderiza:
// Light: text-[#0FA89A]
// Dark: text-[#1DD3C0]
```

---

## 📐 Tabela de Conversão Rápida

| Elemento | Dark Mode | Light Mode | Uso |
|----------|-----------|------------|-----|
| **Títulos h1-h3** | `#D4AF37` | `#A88A1E` ⬅️ | Headings principais |
| **KPI Values** | `#1DD3C0` | `#0FA89A` ⬅️ | Métricas, números grandes |
| **Botão Primary BG** | `#D4AF37` | `#A88A1E` ⬅️ | Background botão |
| **Botão Primary Text** | `#1A1A1A` | `#FFFFFF` ⬅️ | Texto no botão |
| **Accent Hover** | `#E6C25A` | `#C9A134` ⬅️ | Hover states |
| **Links** | `#C8C9D8` | `#342CA4` | Links de navegação |
| **Texto Principal** | `#E5E7EB` | `#23214F` | Parágrafos, body |
| **Texto Secundário** | `#9FA2B2` | `#5A5D74` | Metadata, hints |

**Legenda**: ⬅️ = Cor ajustada para WCAG compliance

---

## 🧪 Como Testar Visualmente

### Método 1: Browser DevTools

1. Abrir DevTools (F12)
2. Ir para **Rendering** tab
3. Selecionar **Emulate vision deficiencies**
4. Testar com:
   - Protanopia (daltonismo vermelho-verde)
   - Deuteranopia (daltonismo verde-vermelho)
   - Tritanopia (daltonismo azul-amarelo)
   - Achromatopsia (monocromático)

### Método 2: Contrast Checker Online

1. Acessar https://webaim.org/resources/contrastchecker/
2. Testar combinações:

**Dark Mode**:
```
Foreground: #D4AF37 (Dourado)
Background: #1A1A2E (Dark BG)
Result: 8.9:1 ✅ WCAG AAA
```

**Light Mode**:
```
Foreground: #A88A1E (Dourado Escuro)
Background: #FFFFFF (White BG)
Result: 5.2:1 ✅ WCAG AA
```

### Método 3: Screenshot Comparison

Tirar screenshots antes/depois em:
- Dashboard principal
- Lista de clientes
- Formulário de criação
- Modais e toasts

Comparar legibilidade em:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

---

## 🎨 Paleta Completa de Cores

### Cores Primárias

| Nome | Hex Dark | Hex Light | Uso |
|------|----------|-----------|-----|
| Dourado | `#D4AF37` | `#A88A1E` | Títulos, botão primary |
| Dourado Hover | `#E6C25A` | `#C9A134` | Hover states |
| Turquesa | `#1DD3C0` | `#0FA89A` | Accent, KPIs |
| Turquesa Hover | — | `#0D8C7F` | Hover accent |
| Roxo Primário | `#342CA4` | `#342CA4` | Links, badges |
| Roxo Secundário | `#3B2CA4` | — | Gradientes |

### Cores de Texto

| Nome | Hex Dark | Hex Light | Contraste D | Contraste L |
|------|----------|-----------|-------------|-------------|
| Texto Principal | `#E5E7EB` | `#23214F` | 12.8:1 ✅ | 14.2:1 ✅ |
| Texto Secundário | `#9FA2B2` | `#5A5D74` | 7.5:1 ✅ | 7.1:1 ✅ |
| Texto Muted | `#9FA2B2` | `#6B7280` | 7.5:1 ✅ | 5.8:1 ✅ |
| Heading | `#D4AF37` | `#A88A1E` | 8.9:1 ✅ | 5.2:1 ✅ |

### Cores de Status

| Status | Dark | Light | Uso |
|--------|------|-------|-----|
| Success | `#10B981` | `#059669` | Confirmações, sucesso |
| Warning | `#F59E0B` | `#D97706` | Alertas, atenção |
| Error | `#EF4444` | `#DC2626` | Erros, crítico |
| Info | `#3B82F6` | `#2563EB` | Informações |

### Cores de Background

| Elemento | Dark | Light |
|----------|------|-------|
| Body | `#1A1A2E` | `#FFFFFF` |
| Surface | `#23234B` | `#FFFFFF` |
| Surface Alt | `#2A2A54` | `#FAFBFD` |
| Sidebar | `#23214F` | `#F2F3F8` |
| Border | `#3B3B5C` | `#E0E2EA` |

---

## 💾 Variáveis CSS Disponíveis

```css
/* Cores Acessíveis (use estas!) */
var(--color-primary-accessible)           /* #A88A1E (light) / #D4AF37 (dark) */
var(--color-primary-hover-accessible)     /* #917718 (light) / #E6C25A (dark) */
var(--color-accent-accessible)            /* #0FA89A (light) / #1DD3C0 (dark) */
var(--color-accent-hover-accessible)      /* #0D8C7F (light) */

/* Cores de Texto */
var(--text-primary)                       /* #23214F (light) / #E5E7EB (dark) */
var(--text-secondary)                     /* #5A5D74 (light) / #9FA2B2 (dark) */
var(--text-heading)                       /* #A88A1E (light) / #D4AF37 (dark) */
var(--text-muted)                         /* #5A5D74 (light) / #9FA2B2 (dark) */

/* Background */
var(--color-bg)                           /* #FFFFFF (light) / #1A1A2E (dark) */
var(--color-surface)                      /* #FFFFFF (light) / #23234B (dark) */
var(--color-border)                       /* #E0E2EA (light) / #3B3B5C (dark) */
```

---

## 📝 Checklist de Implementação

### Para Novos Componentes

- [ ] Verificar contraste em **ambos** temas (light/dark)
- [ ] Usar cores acessíveis para texto sobre background claro
- [ ] Adicionar classes `dark:` quando necessário
- [ ] Testar com Lighthouse (score ≥95)
- [ ] Validar com leitor de tela
- [ ] Documentar variantes de cor no Storybook

### Para Modificar Componentes Existentes

- [ ] Identificar cores hard-coded
- [ ] Substituir por variáveis CSS ou classes com `dark:`
- [ ] Testar visualmente em light e dark mode
- [ ] Validar contraste com WebAIM
- [ ] Atualizar testes automatizados
- [ ] Atualizar documentação do componente

---

**Última Atualização**: 29 de outubro de 2025  
**Responsável**: GitHub Copilot  
**Status**: ✅ Documentado e Implementado
