// components/ui/StatusBadge.tsx
'use client';

import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all',
  {
    variants: {
      variant: {
        success: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30',
        error: 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/30',
        warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
        info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30',
        neutral: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/30',
        primary: 'bg-primary/10 text-[#A88A1E] dark:text-[#D4AF37] border border-primary/30',
        accent: 'bg-accent/10 text-[#0FA89A] dark:text-[#1DD3C0] border border-accent/30',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-3 py-1',
        lg: 'text-sm px-4 py-1.5',
      },
      withDot: {
        true: '',
        false: '',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-105 active:scale-95',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
      withDot: false,
      interactive: false,
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function StatusBadge({ 
  children, 
  variant, 
  size, 
  withDot, 
  interactive, 
  className = '',
  onClick 
}: StatusBadgeProps) {
  return (
    <span
      className={badgeVariants({ variant, size, withDot, interactive, className })}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {withDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${getBadgeDotColor(variant || 'neutral')}`} />
      )}
      {children}
    </span>
  );
}

function getBadgeDotColor(variant: string) {
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-500',
    primary: 'bg-[var(--color-primary)]',
    accent: 'bg-[var(--color-accent)]',
  };
  return colors[variant as keyof typeof colors] || colors.neutral;
}

// Helper para mapear status comuns
export function getStatusBadgeVariant(status: string): VariantProps<typeof badgeVariants>['variant'] {
  const normalized = status.toLowerCase();
  
  if (['ativo', 'pago', 'concluído', 'aprovado', 'sucesso', 'completed', 'active', 'paid'].includes(normalized)) {
    return 'success';
  }
  if (['inativo', 'cancelado', 'rejeitado', 'erro', 'failed', 'cancelled', 'inactive'].includes(normalized)) {
    return 'error';
  }
  if (['pendente', 'aguardando', 'em análise', 'pending', 'warning'].includes(normalized)) {
    return 'warning';
  }
  if (['rascunho', 'draft', 'info'].includes(normalized)) {
    return 'info';
  }
  
  return 'neutral';
}
