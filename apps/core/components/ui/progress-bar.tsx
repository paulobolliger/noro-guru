/**
 * ProgressBar Component
 *
 * Componentes de barra de progresso para indicar completude de tarefas.
 * Suporta diferentes variantes, tamanhos e animações.
 *
 * @example
 * ```tsx
 * <ProgressBar
 *   value={65}
 *   max={100}
 *   showLabel
 *   variant="success"
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface ProgressBarProps {
  /**
   * Valor atual do progresso
   */
  value: number;

  /**
   * Valor máximo (default: 100)
   */
  max?: number;

  /**
   * Variante de cor
   */
  variant?: ProgressVariant;

  /**
   * Tamanho da barra
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Se true, mostra label com porcentagem
   */
  showLabel?: boolean;

  /**
   * Label customizado (substitui porcentagem)
   */
  label?: string;

  /**
   * Se true, anima a transição
   */
  animated?: boolean;

  /**
   * Se true, mostra animação de "striped"
   */
  striped?: boolean;

  /**
   * Se true, mostra ícone de check quando completo
   */
  showCheckWhenComplete?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  striped = false,
  showCheckWhenComplete = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isComplete = percentage >= 100;

  // Classes de tamanho
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // Classes de variante (barra de progresso)
  const variantClasses = {
    default: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  // Classes do background
  const bgClasses = {
    default: 'bg-primary-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Label */}
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || `${Math.round(percentage)}%`}
          </span>
          {isComplete && showCheckWhenComplete && (
            <Check size={16} className="text-green-600" aria-label="Completo" />
          )}
        </div>
      )}

      {/* Barra */}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          sizeClasses[size],
          bgClasses[variant]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `${Math.round(percentage)}% completo`}
      >
        <div
          className={cn(
            'h-full rounded-full',
            variantClasses[variant],
            animated && 'transition-all duration-500 ease-out',
            striped &&
              'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:30px_100%] animate-[shimmer_2s_linear_infinite]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * CircularProgress - Progresso circular
 */
export interface CircularProgressProps {
  /**
   * Valor do progresso (0-100)
   */
  value: number;

  /**
   * Tamanho do círculo
   */
  size?: number;

  /**
   * Espessura do traço
   */
  strokeWidth?: number;

  /**
   * Variante de cor
   */
  variant?: ProgressVariant;

  /**
   * Se true, mostra label central
   */
  showLabel?: boolean;

  /**
   * Label customizado
   */
  label?: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  label,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Cores por variante
  const colors = {
    default: '#5053c4', // primary-600
    success: '#16a34a', // green-600
    warning: '#eab308', // yellow-500
    error: '#dc2626', // red-600
    info: '#2563eb', // blue-600
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[variant]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Label central */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          {label || (
            <span className="text-2xl font-semibold text-gray-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * StepProgress - Progresso por etapas
 */
export interface Step {
  /**
   * Label da etapa
   */
  label: string;

  /**
   * Descrição opcional
   */
  description?: string;

  /**
   * Status da etapa
   */
  status?: 'pending' | 'current' | 'complete';
}

export interface StepProgressProps {
  /**
   * Array de etapas
   */
  steps: Step[];

  /**
   * Índice da etapa atual (0-indexed)
   */
  currentStep: number;

  /**
   * Orientação
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function StepProgress({
  steps,
  currentStep,
  orientation = 'horizontal',
  className,
}: StepProgressProps) {
  return (
    <nav
      aria-label="Progresso"
      className={cn(
        orientation === 'horizontal'
          ? 'flex items-center justify-between'
          : 'flex flex-col space-y-4',
        className
      )}
    >
      {steps.map((step, index) => {
        const status =
          index < currentStep
            ? 'complete'
            : index === currentStep
            ? 'current'
            : 'pending';

        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={cn(
              'flex items-center',
              orientation === 'horizontal' && !isLast && 'flex-1'
            )}
          >
            {/* Step */}
            <div
              className={cn(
                'flex',
                orientation === 'horizontal' ? 'flex-col items-center' : 'items-start gap-3'
              )}
            >
              {/* Circle */}
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                  status === 'complete' &&
                    'bg-primary-600 border-primary-600 text-white',
                  status === 'current' &&
                    'bg-white border-primary-600 text-primary-600',
                  status === 'pending' && 'bg-white border-gray-300 text-gray-500'
                )}
              >
                {status === 'complete' ? (
                  <Check size={20} aria-hidden="true" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <div className={cn(orientation === 'horizontal' ? 'mt-2 text-center' : 'flex-1')}>
                <p
                  className={cn(
                    'text-sm font-medium',
                    status !== 'pending' ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={cn(
                  'transition-colors',
                  orientation === 'horizontal'
                    ? 'h-0.5 flex-1 mx-4'
                    : 'w-0.5 h-8 ml-5',
                  index < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * MultiProgress - Múltiplas barras de progresso empilhadas
 */
export interface MultiProgressSegment {
  /**
   * Valor do segmento
   */
  value: number;

  /**
   * Label
   */
  label: string;

  /**
   * Cor (hex ou classe Tailwind)
   */
  color: string;
}

export interface MultiProgressProps {
  /**
   * Segmentos
   */
  segments: MultiProgressSegment[];

  /**
   * Valor máximo total
   */
  max?: number;

  /**
   * Tamanho
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Se true, mostra legenda
   */
  showLegend?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function MultiProgress({
  segments,
  max = 100,
  size = 'md',
  showLegend = false,
  className,
}: MultiProgressProps) {
  const total = segments.reduce((acc, seg) => acc + seg.value, 0);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Barra */}
      <div
        className={cn(
          'w-full flex rounded-full overflow-hidden bg-gray-200',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={total}
        aria-valuemax={max}
      >
        {segments.map((segment, index) => {
          const percentage = (segment.value / max) * 100;
          return (
            <div
              key={index}
              className="transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor: segment.color,
              }}
              title={`${segment.label}: ${segment.value}`}
            />
          );
        })}
      </div>

      {/* Legenda */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span className="text-sm text-gray-700">
                {segment.label}: {segment.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * useProgress - Hook para gerenciar progresso
 */
export function useProgress(max = 100) {
  const [value, setValue] = React.useState(0);

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isComplete = percentage >= 100;

  const increment = React.useCallback((amount = 1) => {
    setValue((prev) => Math.min(prev + amount, max));
  }, [max]);

  const decrement = React.useCallback((amount = 1) => {
    setValue((prev) => Math.max(prev - amount, 0));
  }, []);

  const reset = React.useCallback(() => {
    setValue(0);
  }, []);

  const complete = React.useCallback(() => {
    setValue(max);
  }, [max]);

  return {
    value,
    setValue,
    percentage,
    isComplete,
    increment,
    decrement,
    reset,
    complete,
  };
}
