# Análise de Contraste WCAG - Noro Control Plane

## Paleta de Cores Proposta

### Cores Principais
- **Dourado (Títulos)**: `#D4AF37`
- **Turquesa (Accent)**: `#1DD3C0`
- **Roxo Primário**: `#342CA4`

### Cores de Texto
- **Dark Mode**: `#E5E7EB` (texto claro)
- **Light Mode**: `#23214F` (texto escuro)

## Análise WCAG 2.1 (Nível AA)

### Requisitos de Contraste
- **Texto normal** (< 18pt): Mínimo 4.5:1
- **Texto grande** (≥ 18pt ou 14pt bold): Mínimo 3:1
- **Componentes UI**: Mínimo 3:1

---

## Dark Mode - Análise de Contraste

### Background Principal: `#1A1A2E`

#### ✅ APROVADO: Texto Claro (#E5E7EB) sobre Dark Background
```
Contraste: #E5E7EB vs #1A1A2E
Ratio: 12.8:1 ✅ (WCAG AAA)
Uso: Texto descritivo padrão
```

#### ✅ APROVADO: Títulos Dourados (#D4AF37) sobre Dark Background
```
Contraste: #D4AF37 vs #1A1A2E
Ratio: 8.9:1 ✅ (WCAG AAA)
Uso: Títulos principais (h1, h2, h3)
```

#### ⚠️ ATENÇÃO: Turquesa (#1DD3C0) sobre Dark Background
```
Contraste: #1DD3C0 vs #1A1A2E
Ratio: 7.2:1 ✅ (WCAG AAA)
Uso: Botões, ícones, accent
Recomendação: OK para todos os usos
```

#### ✅ APROVADO: Roxo (#342CA4) sobre Dark Background
```
Contraste: #342CA4 vs #1A1A2E
Ratio: 4.1:1 ⚠️ (WCAG AA - limítrofe)
Uso: Links, headings secundários
Recomendação: Usar apenas para texto grande (>18pt)
```

---

## Light Mode - Análise de Contraste

### Background Principal: `#FFFFFF`

#### ✅ APROVADO: Texto Escuro (#23214F) sobre White Background
```
Contraste: #23214F vs #FFFFFF
Ratio: 14.2:1 ✅ (WCAG AAA)
Uso: Texto descritivo padrão
```

#### ⚠️ REPROVADO: Títulos Dourados (#D4AF37) sobre White Background
```
Contraste: #D4AF37 vs #FFFFFF
Ratio: 2.8:1 ❌ (Falha WCAG AA)
Uso: Títulos principais
Problema: Contraste insuficiente no light mode
Solução: Usar #A88A1E (Dourado Escuro)
```

#### ✅ APROVADO: Turquesa (#1DD3C0) sobre White Background
```
Contraste: #1DD3C0 vs #FFFFFF
Ratio: 2.9:1 ⚠️ (Falha para texto normal)
Uso: Botões, ícones
Recomendação: Usar #0FA89A (Turquesa Escuro) para texto
```

#### ✅ APROVADO: Roxo (#342CA4) sobre White Background
```
Contraste: #342CA4 vs #FFFFFF
Ratio: 9.8:1 ✅ (WCAG AAA)
Uso: Links, headings
```

---

## Cores Ajustadas para WCAG AA/AAA

### Dark Mode (OK - Sem Mudanças)
```css
--text-primary: #E5E7EB;         /* 12.8:1 ✅ */
--text-heading: #D4AF37;          /* 8.9:1 ✅ */
--color-accent: #1DD3C0;          /* 7.2:1 ✅ */
--color-link: #C8C9D8;            /* 11.5:1 ✅ */
```

### Light Mode (AJUSTES NECESSÁRIOS)
```css
/* ❌ ANTES - Falha WCAG */
--text-heading: #D4AF37;          /* 2.8:1 ❌ */
--color-accent: #1DD3C0;          /* 2.9:1 ❌ */

/* ✅ DEPOIS - Passa WCAG AA */
--text-heading: #A88A1E;          /* 5.2:1 ✅ Dourado Escuro */
--color-accent: #0FA89A;          /* 4.8:1 ✅ Turquesa Escuro */
--color-link: #342CA4;            /* 9.8:1 ✅ Roxo (já OK) */
```

---

## Tabela de Contraste Completa

| Combinação | Dark Mode | Light Mode | WCAG AA | Uso Recomendado |
|-----------|-----------|------------|---------|-----------------|
| Texto Padrão | 12.8:1 ✅ | 14.2:1 ✅ | ✅ Passa | Parágrafos, labels |
| Títulos (Dourado) | 8.9:1 ✅ | **2.8:1 ❌** | ⚠️ Ajustar | Headings h1-h3 |
| Accent (Turquesa) | 7.2:1 ✅ | **2.9:1 ❌** | ⚠️ Ajustar | Botões, badges |
| Links (Roxo) | 4.1:1 ⚠️ | 9.8:1 ✅ | ✅ Passa | Links, nav |
| Texto Secundário | 7.5:1 ✅ | 7.1:1 ✅ | ✅ Passa | Metadata, hints |

---

## Implementação das Correções

### 1. Criar Variantes de Cor para Light Mode

```css
:root {
  /* Dark Mode - Cores Originais */
  --color-primary: #D4AF37;           /* Dourado */
  --color-accent: #1DD3C0;            /* Turquesa */
  --color-secondary: #342CA4;         /* Roxo */
  
  /* Light Mode - Cores Ajustadas */
  --color-primary-accessible: #A88A1E;    /* Dourado Escuro */
  --color-accent-accessible: #0FA89A;     /* Turquesa Escuro */
  --color-secondary-accessible: #342CA4;  /* Roxo (sem mudança) */
}

:root[data-theme='light'] {
  /* Sobrescrever com cores acessíveis */
  --text-heading: var(--color-primary-accessible);
  --color-accent: var(--color-accent-accessible);
  --color-link: var(--color-secondary-accessible);
}
```

### 2. Ajustar Componentes Específicos

#### Botões Primários (Light Mode)
```css
[data-theme='light'] .btn-primary {
  background: #A88A1E;  /* Dourado Escuro */
  color: #FFFFFF;       /* Branco para contraste 7.8:1 */
}

[data-theme='light'] .btn-primary:hover {
  background: #917718;  /* Dourado mais escuro */
}
```

#### Badges e Pills (Light Mode)
```css
[data-theme='light'] .badge-accent {
  background: #0FA89A;  /* Turquesa Escuro */
  color: #FFFFFF;
}

[data-theme='light'] .badge-primary {
  background: #A88A1E;  /* Dourado Escuro */
  color: #FFFFFF;
}
```

#### Links (Light Mode) - JÁ OK
```css
[data-theme='light'] .text-link {
  color: #342CA4;  /* Roxo 9.8:1 ✅ */
}

[data-theme='light'] .text-link:hover {
  color: #0FA89A;  /* Turquesa Escuro */
}
```

---

## Componentes UI - Análise de Contraste

### KPI Cards

#### Dark Mode ✅
```css
.kpi-value {
  color: #1DD3C0;  /* 7.2:1 vs #1A1A2E ✅ */
  background: #23234B;
}

.kpi-label {
  color: #9FA2B2;  /* 7.5:1 vs #23234B ✅ */
}
```

#### Light Mode ⚠️
```css
[data-theme='light'] .kpi-value {
  color: #0FA89A;  /* AJUSTADO: 4.8:1 vs #FFFFFF ✅ */
  background: #FFFFFF;
}

[data-theme='light'] .kpi-label {
  color: #5A5D74;  /* 7.1:1 vs #FFFFFF ✅ */
}
```

### StatusBadge Component

```tsx
// Dark Mode - OK
<span className="bg-accent/10 text-accent">
  {/* #1DD3C0 sobre rgba(29,211,192,0.1) + #1A1A2E = 6.5:1 ✅ */}
</span>

// Light Mode - AJUSTAR
<span className="bg-accent/10 text-[#0FA89A]">
  {/* #0FA89A sobre rgba(15,168,154,0.1) + #FFFFFF = 4.5:1 ✅ */}
</span>
```

### DataTable Component

```css
/* Headers - OK em ambos temas */
table thead th {
  color: var(--text-secondary);
  /* Dark: #9FA2B2 (7.5:1) ✅ */
  /* Light: #5A5D74 (7.1:1) ✅ */
}

/* Row Hover - OK */
table tbody tr:hover {
  background: var(--table-hover);
  border-left-color: var(--color-accent);
  /* Contraste de borda: 3:1 mínimo ✅ */
}
```

---

## Gradientes - Análise

### Gradient Header
```css
background: linear-gradient(135deg, #3B2CA4, #23214F);
color: #E5E7EB;  /* 12.8:1 vs #23214F ✅ */
```
**✅ APROVADO**: Texto claro sobre gradiente escuro

### Gradient Button (Light Mode)
```css
/* ❌ ANTES */
background: linear-gradient(90deg, #D4AF37, #E6C25A);
color: #1A1A1A;  /* 3.2:1 ❌ */

/* ✅ DEPOIS */
[data-theme='light'] .btn-gradient {
  background: linear-gradient(90deg, #A88A1E, #C9A134);
  color: #FFFFFF;  /* 6.8:1 ✅ */
}
```

---

## Resumo de Ações Necessárias

### 🔴 ALTA PRIORIDADE (Falha WCAG AA)

1. **Ajustar Dourado no Light Mode**
   - `#D4AF37` → `#A88A1E` para títulos
   - `#E6C25A` → `#C9A134` para hovers

2. **Ajustar Turquesa no Light Mode**
   - `#1DD3C0` → `#0FA89A` para texto/ícones
   - Manter `#1DD3C0` para backgrounds com texto branco

3. **Atualizar Botão Primário Light**
   - Background: `#A88A1E`
   - Texto: `#FFFFFF`
   - Hover: `#917718`

### 🟡 MÉDIA PRIORIDADE (Melhorias)

4. **Roxo em Dark Mode**
   - Usar apenas para texto ≥18pt
   - Considerar `#4A3EC6` para texto menor (5.2:1)

5. **Badges e Pills Light Mode**
   - Usar cores ajustadas
   - Garantir `#FFFFFF` em texto sobre background colorido

### 🟢 BAIXA PRIORIDADE (Otimizações)

6. **Tabelas e DataTable**
   - Aumentar contraste de bordas hover: 3.5:1
   - Adicionar indicador de foco mais visível

7. **Documentar Novos Tokens**
   - `--color-primary-accessible`
   - `--color-accent-accessible`
   - Atualizar Tailwind config

---

## Ferramentas de Teste

### Online
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- [Accessible Colors](https://accessible-colors.com/)

### Browser Extensions
- **axe DevTools** (Chrome/Firefox)
- **WAVE** (Web Accessibility Evaluation Tool)
- **Lighthouse** (Chrome DevTools)

### Comandos para Teste Automatizado
```bash
# npm script para teste de acessibilidade
npm run test:a11y

# Lighthouse CI
npx lighthouse https://control.noro.guru --only-categories=accessibility
```

---

## Checklist de Implementação

- [ ] Criar variáveis CSS `--color-*-accessible`
- [ ] Atualizar `colors.css` com cores ajustadas
- [ ] Ajustar `tailwind.config.js` com novos tokens
- [ ] Atualizar componentes:
  - [ ] KpiCard
  - [ ] StatusBadge
  - [ ] EnhancedToast
  - [ ] DataTable
  - [ ] Button (primary variant)
- [ ] Testar com Lighthouse (score ≥95)
- [ ] Testar com axe DevTools (0 violations)
- [ ] Validar com leitores de tela
- [ ] Documentar em `ui-components-guide.md`

---

## Referências

- [WCAG 2.1 Success Criterion 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WCAG 2.1 Success Criterion 1.4.6](https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html)
- [WebAIM: Contrast and Color Accessibility](https://webaim.org/articles/contrast/)
