NORO Control – UI Design System (Mini)

Overview
- Token-first theme with dark/light via data-theme.
- Utility classes and lightweight React wrappers for consistent UI.

Color Tokens (layout.tsx)
- Brand: --noro-primary, --noro-primary-dark, --noro-core
- Theme neutrals: --bg, --surface, --header-bg, --text, --muted, --border
- Semantics: --success, --warning, --error, --info (+ rgb variants)
- Focus: --ring, --ring-strong

Utility Classes
- Surfaces: surface-app, surface-card, surface-header, surface-sidebar
- Text: text-primary, text-muted
- Border: border-default
- Badges: badge + badge-success|warning|error|info
- Alerts: alert + alert-success|warning|error|info

Components
- NButton (n-button.tsx)
  - Variants: primary | secondary | tertiary | destructive
  - Sizes: sm | md | lg
  - Icon slots: leftIcon/rightIcon
- NInput (n-input.tsx)
  - Props: invalid (renders error border)
- NBadge (n-badge.tsx)
  - Variants: default | success | warning | error | info
- NAlert (n-alert.tsx)
  - Variants: success | warning | error | info
  - Props: icon, title, children
- Card (card.tsx)
  - Card, CardHeader, CardContent

Usage
import { NButton, NInput, NBadge, NAlert, Card, CardHeader, CardContent } from '@/components/ui'

<NButton variant="primary" leftIcon={<Icon/>}>Salvar</NButton>
<NInput placeholder="Seu email" />
<NBadge variant="success">Ativo</NBadge>
<NAlert variant="error" title="Falha" icon={<Icon/>}>Mensagem de erro</NAlert>
<Card><CardHeader>...</CardHeader><CardContent>...</CardContent></Card>

Guidelines
- Use text-primary para títulos e valores; text-muted para descrições.
- Em formulários, prefira NInput e border-default + bg-white/5.
- Em ações principais, prefira NButton primary; secundárias: secondary; links: tertiary.
- Mantenha focus visível: components já aplicam focus:ring com --ring.

