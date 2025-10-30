import { type ThemeConfig } from 'tailwindcss/types/config'

export const noroTheme = {
  colors: {
    primary: {
      DEFAULT: '#D4AF37',
      hover: '#E6C25A',
      accent: '#1DD3C0',
      gradient: 'linear-gradient(90deg, #3B2CA4, #1DD3C0)',
    },
    secondary: {
      light: {
        bg: 'rgba(52,44,164,0.08)',
        text: '#342CA4',
        surface: '#FFFFFF',
      },
      dark: {
        bg: 'rgba(52,44,164,0.12)',
        text: '#E5E7EB',
        surface: 'rgba(35,33,79,0.3)',
      }
    },
    text: {
      title: {
        light: '#342CA4',
        dark: '#F3F4F8',
        gradient: 'linear-gradient(90deg, #3B2CA4, #1DD3C0)',
      },
      subtitle: {
        light: '#5A5D74',
        dark: '#9FA2B2',
      },
      body: {
        light: '#23214F',
        dark: '#E5E7EB',
      },
      muted: {
        light: '#6B7280',
        dark: '#9CA3AF',
      }
    },
    border: {
      light: '#E0E2EA',
      dark: '#3B3B5C',
    },
    hover: {
      table: {
        light: 'rgba(29,211,192,0.08)',
        dark: 'rgba(29,211,192,0.12)',
      }
    },
    chart: {
      primary: '#1DD3C0',
      secondary: '#D4AF37',
      tertiary: '#5053C4',
      grid: {
        light: 'rgba(0,0,0,0.1)',
        dark: 'rgba(255,255,255,0.1)',
      },
      label: {
        light: '#374151',
        dark: '#D1D5DB',
      }
    },
    kanban: {
      background: {
        light: 'rgba(255,255,255,0.8)',
        dark: 'rgba(35,33,79,0.8)',
      },
      column: {
        new: '#1DD3C0',
        inProgress: '#5053C4',
        done: '#D4AF37',
      }
    }
  },
  borderRadius: {
    DEFAULT: '12px',
    lg: '16px',
    xl: '20px',
  },
  shadows: {
    sm: {
      light: '0 1px 4px rgba(0,0,0,0.05)',
      dark: '0 1px 4px rgba(0,0,0,0.2)',
    },
    DEFAULT: {
      light: '0 2px 8px rgba(0,0,0,0.05)',
      dark: '0 2px 8px rgba(0,0,0,0.35)',
    },
    md: {
      light: '0 4px 12px rgba(0,0,0,0.05)',
      dark: '0 4px 12px rgba(0,0,0,0.4)',
    },
    glow: {
      light: '0 0 12px rgba(29,211,192,0.2)',
      dark: '0 0 12px rgba(29,211,192,0.4)',
    }
  },
  spacing: {
    card: '1rem',
    section: '1.5rem',
    layout: '2rem',
  },
  typography: {
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    fontSize: {
      kpi: ['2.5rem', { lineHeight: '1.2' }],
      header: ['1.875rem', { lineHeight: '2.25rem' }],
      title: ['1.5rem', { lineHeight: '2rem' }],
      body: ['1rem', { lineHeight: '1.5rem' }],
      small: ['0.875rem', { lineHeight: '1.25rem' }],
    }
  },
  blur: {
    sm: '4px',
    DEFAULT: '8px',
    md: '12px',
  }
} as const

export const tailwindConfig = {
  extend: {
      colors: {
        primary: noroTheme.colors.primary,
        secondary: {
          light: noroTheme.colors.secondary.light,
          dark: noroTheme.colors.secondary.dark,
        },
        text: noroTheme.colors.text,
        border: noroTheme.colors.border,
        chart: noroTheme.colors.chart,
        kanban: noroTheme.colors.kanban,
      },
      borderRadius: noroTheme.borderRadius,
      boxShadow: {
        'sm-light': noroTheme.shadows.sm.light,
        'sm-dark': noroTheme.shadows.sm.dark,
        'default-light': noroTheme.shadows.DEFAULT.light,
        'default-dark': noroTheme.shadows.DEFAULT.dark,
        'md-light': noroTheme.shadows.md.light,
        'md-dark': noroTheme.shadows.md.dark,
        'glow-light': noroTheme.shadows.glow.light,
        'glow-dark': noroTheme.shadows.glow.dark,
      },
      fontWeight: noroTheme.typography.fontWeight,
      fontSize: noroTheme.typography.fontSize,
      spacing: noroTheme.spacing,
      blur: noroTheme.blur,
    }
  }
}