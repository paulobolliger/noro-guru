/**
 * Stats Cards Component
 *
 * Componentes de cartões de estatísticas para dashboards e relatórios.
 * Suporta tendências, comparações, progresso e mini gráficos.
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="Total de Vendas"
 *   value="R$ 45.231"
 *   change={{ value: 12.5, period: 'vs mês anterior' }}
 *   icon={<DollarSign />}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  Info,
} from 'lucide-react';

export interface StatChange {
  /**
   * Valor da mudança (positivo ou negativo)
   */
  value: number;

  /**
   * Período de comparação
   */
  period?: string;

  /**
   * Se true, inverte cores (vermelho = bom, verde = ruim)
   */
  inverse?: boolean;
}

export interface StatCardProps {
  /**
   * Título da métrica
   */
  title: string;

  /**
   * Valor da métrica
   */
  value: string | number;

  /**
   * Descrição adicional
   */
  description?: string;

  /**
   * Ícone
   */
  icon?: React.ReactNode;

  /**
   * Mudança/tendência
   */
  change?: StatChange;

  /**
   * Se true, exibe loading
   */
  loading?: boolean;

  /**
   * Cor do card
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';

  /**
   * Mini gráfico (sparkline)
   */
  chart?: React.ReactNode;

  /**
   * Callback ao clicar
   */
  onClick?: () => void;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  change,
  loading = false,
  variant = 'default',
  chart,
  onClick,
  className,
}: StatCardProps) {
  const isPositiveChange = change && change.value > 0;
  const isNegativeChange = change && change.value < 0;
  const isNeutralChange = change && change.value === 0;

  // Define se mudança é "boa" ou "ruim"
  const isGoodChange = change?.inverse
    ? isNegativeChange
    : isPositiveChange;
  const isBadChange = change?.inverse
    ? isPositiveChange
    : isNegativeChange;

  const variantStyles = {
    default: 'bg-white border-gray-200',
    primary: 'bg-primary-50 border-primary-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
  };

  return (
    <div
      className={cn(
        'p-6 border rounded-lg transition-shadow',
        variantStyles[variant],
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
        </div>

        {icon && (
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg flex-shrink-0">
            <div className="text-primary-600">{icon}</div>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      )}

      {/* Change indicator */}
      {change && !loading && (
        <div className="flex items-center gap-2">
          {isPositiveChange && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                isGoodChange ? 'text-green-600' : 'text-red-600'
              )}
            >
              <TrendingUp size={16} />
              <span>+{Math.abs(change.value)}%</span>
            </div>
          )}

          {isNegativeChange && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                isBadChange ? 'text-red-600' : 'text-green-600'
              )}
            >
              <TrendingDown size={16} />
              <span>-{Math.abs(change.value)}%</span>
            </div>
          )}

          {isNeutralChange && (
            <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
              <Minus size={16} />
              <span>0%</span>
            </div>
          )}

          {change.period && (
            <span className="text-sm text-gray-500">{change.period}</span>
          )}
        </div>
      )}

      {/* Chart */}
      {chart && <div className="mt-4">{chart}</div>}
    </div>
  );
}

/**
 * StatGroup - Agrupa múltiplos StatCards
 */
export interface StatGroupProps {
  /**
   * Cards
   */
  children: React.ReactNode;

  /**
   * Número de colunas
   */
  cols?: 1 | 2 | 3 | 4;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function StatGroup({ children, cols = 4, className }: StatGroupProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', colsClasses[cols], className)}>
      {children}
    </div>
  );
}

/**
 * ComparisonCard - Compara duas métricas lado a lado
 */
export interface ComparisonCardProps {
  title: string;
  current: {
    label: string;
    value: string | number;
  };
  previous: {
    label: string;
    value: string | number;
  };
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function ComparisonCard({
  title,
  current,
  previous,
  icon,
  loading = false,
  className,
}: ComparisonCardProps) {
  return (
    <div
      className={cn(
        'p-6 bg-white border border-gray-200 rounded-lg',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
            <div className="text-gray-600">{icon}</div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Current */}
          <div>
            <p className="text-xs text-gray-500 mb-1">{current.label}</p>
            <p className="text-2xl font-bold text-gray-900">{current.value}</p>
          </div>

          {/* Previous */}
          <div>
            <p className="text-xs text-gray-500 mb-1">{previous.label}</p>
            <p className="text-2xl font-bold text-gray-600">{previous.value}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ProgressCard - Card com barra de progresso
 */
export interface ProgressCardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressCard({
  title,
  current,
  target,
  unit = '',
  icon,
  loading = false,
  showPercentage = true,
  className,
}: ProgressCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <div
      className={cn(
        'p-6 bg-white border border-gray-200 rounded-lg',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          {loading ? (
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-xl font-bold text-gray-900">
              {current} / {target} {unit}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
            <div className="text-gray-600">{icon}</div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!loading && (
        <div>
          <div className="flex items-center justify-between mb-2">
            {showPercentage && (
              <span className="text-sm font-medium text-gray-700">
                {percentage.toFixed(1)}%
              </span>
            )}
            {isComplete && (
              <span className="text-xs font-medium text-green-600">
                Meta atingida!
              </span>
            )}
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500',
                isComplete ? 'bg-green-500' : 'bg-primary-600'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * MiniChart - Mini gráfico sparkline (SVG)
 */
export interface MiniChartProps {
  /**
   * Dados do gráfico
   */
  data: number[];

  /**
   * Cor da linha
   */
  color?: string;

  /**
   * Altura em pixels
   */
  height?: number;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function MiniChart({
  data,
  color = '#5053c4',
  height = 40,
  className,
}: MiniChartProps) {
  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = data.length * 8;
  const points = data
    .map((value, index) => {
      const x = index * 8;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Área preenchida */}
      <polygon
        points={`0,${height} ${points} ${(data.length - 1) * 8},${height}`}
        fill={color}
        fillOpacity="0.1"
      />
    </svg>
  );
}

/**
 * TrendCard - Card com indicador de tendência
 */
export interface TrendCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
  icon?: React.ReactNode;
  description?: string;
  loading?: boolean;
  inverse?: boolean; // Se true, "down" é bom
  className?: string;
}

export function TrendCard({
  title,
  value,
  trend,
  trendValue,
  icon,
  description,
  loading = false,
  inverse = false,
  className,
}: TrendCardProps) {
  const isGoodTrend = inverse
    ? trend === 'down'
    : trend === 'up';

  const isBadTrend = inverse
    ? trend === 'up'
    : trend === 'down';

  const trendColors = {
    good: 'text-green-600 bg-green-50',
    bad: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  const currentColor = isGoodTrend
    ? 'good'
    : isBadTrend
    ? 'bad'
    : 'neutral';

  const TrendIcon =
    trend === 'up'
      ? ArrowUp
      : trend === 'down'
      ? ArrowDown
      : Minus;

  return (
    <div
      className={cn(
        'p-6 bg-white border border-gray-200 rounded-lg',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
        </div>

        {icon && (
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg flex-shrink-0">
            <div className="text-primary-600">{icon}</div>
          </div>
        )}
      </div>

      {!loading && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium',
              trendColors[currentColor]
            )}
          >
            <TrendIcon size={14} />
            {trendValue && <span>{trendValue}</span>}
          </div>

          {description && (
            <span className="text-sm text-gray-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * DetailedStatCard - Card com mais detalhes e múltiplas métricas
 */
export interface DetailedStatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  details?: Array<{
    label: string;
    value: string | number;
  }>;
  badge?: {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'error';
  };
  loading?: boolean;
  className?: string;
}

export function DetailedStatCard({
  title,
  value,
  icon,
  details = [],
  badge,
  loading = false,
  className,
}: DetailedStatCardProps) {
  const badgeVariants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <div
      className={cn(
        'p-6 bg-white border border-gray-200 rounded-lg',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            {badge && (
              <span
                className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded',
                  badgeVariants[badge.variant || 'default']
                )}
              >
                {badge.label}
              </span>
            )}
          </div>

          {loading ? (
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
        </div>

        {icon && (
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg flex-shrink-0">
            <div className="text-primary-600">{icon}</div>
          </div>
        )}
      </div>

      {/* Details */}
      {details.length > 0 && !loading && (
        <div className="space-y-2 pt-4 border-t border-gray-200">
          {details.map((detail, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{detail.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * useStatAnimation - Hook para animar valores numéricos
 */
export function useStatAnimation(
  target: number,
  duration: number = 1000
): number {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(target * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return current;
}
