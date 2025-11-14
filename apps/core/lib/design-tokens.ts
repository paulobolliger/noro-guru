/**
 * Design Tokens - Sistema de Design Noro
 *
 * Centraliza todas as definições de cores, espaçamentos, tipografia e outros
 * valores de design para garantir consistência em toda a aplicação.
 *
 * IMPORTANTE: Sempre use estes tokens em vez de valores hardcoded.
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f1ff',
    100: '#e0e2ff',
    200: '#c7caff',
    300: '#a5a9ff',
    400: '#7d82ff',
    500: '#5053c4',  // Main brand color
    600: '#342ca4',
    700: '#232452',
    800: '#1a1a3e',
    900: '#12122b',
  },

  // Secondary Colors
  secondary: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },

  // Accent Gold
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#D4AF37',  // Gold
    500: '#b8941f',
    600: '#997a16',
    700: '#7a6010',
    800: '#5c470c',
    900: '#3d2f08',
  },

  // Status Colors Unificados
  status: {
    // Lead Stages
    novo: {
      light: 'bg-blue-100 text-blue-800',
      default: 'bg-blue-500 text-white',
      dark: 'bg-blue-700 text-white',
    },
    contato_inicial: {
      light: 'bg-cyan-100 text-cyan-800',
      default: 'bg-cyan-500 text-white',
      dark: 'bg-cyan-700 text-white',
    },
    qualificacao: {
      light: 'bg-purple-100 text-purple-800',
      default: 'bg-purple-500 text-white',
      dark: 'bg-purple-700 text-white',
    },
    proposta: {
      light: 'bg-yellow-100 text-yellow-800',
      default: 'bg-yellow-500 text-white',
      dark: 'bg-yellow-700 text-white',
    },
    negociacao: {
      light: 'bg-orange-100 text-orange-800',
      default: 'bg-orange-500 text-white',
      dark: 'bg-orange-700 text-white',
    },
    fechado: {
      light: 'bg-green-100 text-green-800',
      default: 'bg-green-500 text-white',
      dark: 'bg-green-700 text-white',
    },
    perdido: {
      light: 'bg-red-100 text-red-800',
      default: 'bg-red-500 text-white',
      dark: 'bg-red-700 text-white',
    },
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',  // Main success
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Main info
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],     // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],    // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],   // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
  '5xl': ['3rem', { lineHeight: '1' }],        // 48px
} as const;

export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitionDuration = {
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
} as const;

export const transitionTimingFunction = {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================================================
// CHART COLORS (para Recharts)
// ============================================================================

export const chartColors = {
  primary: ['#5053c4', '#342ca4', '#232452'],
  extended: ['#5053c4', '#342ca4', '#232452', '#60a5fa', '#34d399', '#fbbf24'],
  status: ['#3b82f6', '#06b6d4', '#a855f7', '#eab308', '#f97316', '#10b981', '#ef4444'],
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Obtém a classe de status de lead com variante
 */
export function getLeadStatusClass(
  status: string,
  variant: 'light' | 'default' | 'dark' = 'default'
): string {
  const statusKey = status.toLowerCase().replace(' ', '_');
  return colors.status[statusKey as keyof typeof colors.status]?.[variant] || colors.status.novo[variant];
}

/**
 * Obtém cor hexadecimal a partir do nome do status
 */
export function getLeadStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    novo: '#3b82f6',
    contato_inicial: '#06b6d4',
    qualificacao: '#a855f7',
    proposta: '#eab308',
    negociacao: '#f97316',
    fechado: '#10b981',
    perdido: '#ef4444',
  };
  return statusMap[status.toLowerCase().replace(' ', '_')] || statusMap.novo;
}
