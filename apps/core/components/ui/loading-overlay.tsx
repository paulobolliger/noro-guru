/**
 * LoadingOverlay Component
 *
 * Overlay de carregamento para bloquear UI durante operações assíncronas.
 * Pode ser usado em página inteira ou em seções específicas.
 *
 * @example
 * ```tsx
 * <LoadingOverlay
 *   isLoading={isProcessing}
 *   message="Salvando alterações..."
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface LoadingOverlayProps {
  /**
   * Se está exibindo o loading
   */
  isLoading: boolean;

  /**
   * Mensagem de loading
   */
  message?: string;

  /**
   * Submensagem (texto menor abaixo da mensagem principal)
   */
  submessage?: string;

  /**
   * Se true, usa portal para renderizar em fullscreen
   * Se false, renderiza relativo ao parent (parent precisa ter position: relative)
   */
  fullscreen?: boolean;

  /**
   * Opacidade do backdrop (0-100)
   */
  opacity?: number;

  /**
   * Se true, permite clicar através do overlay
   */
  transparent?: boolean;

  /**
   * Spinner customizado
   */
  spinner?: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Classes CSS para o conteúdo
   */
  contentClassName?: string;
}

export function LoadingOverlay({
  isLoading,
  message,
  submessage,
  fullscreen = true,
  opacity = 75,
  transparent = false,
  spinner,
  className,
  contentClassName,
}: LoadingOverlayProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Bloqueia scroll quando fullscreen
  React.useEffect(() => {
    if (isLoading && fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading, fullscreen]);

  if (!isLoading) return null;

  const overlay = (
    <div
      className={cn(
        'flex items-center justify-center z-50',
        fullscreen ? 'fixed inset-0' : 'absolute inset-0',
        !transparent && `bg-white/[0.${opacity}] backdrop-blur-sm`,
        transparent && 'pointer-events-none',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message || 'Carregando'}
    >
      <div
        className={cn(
          'flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-2xl border border-gray-200',
          !transparent && 'pointer-events-auto',
          contentClassName
        )}
      >
        {/* Spinner */}
        {spinner || (
          <Loader2
            size={40}
            className="text-primary-600 animate-spin"
            aria-hidden="true"
          />
        )}

        {/* Mensagem */}
        {message && (
          <div className="text-center">
            <p className="text-base font-medium text-gray-900">{message}</p>
            {submessage && (
              <p className="mt-1 text-sm text-gray-600">{submessage}</p>
            )}
          </div>
        )}

        {/* Texto para screen readers */}
        <span className="sr-only">
          {message || 'Carregando, por favor aguarde'}
        </span>
      </div>
    </div>
  );

  if (fullscreen && mounted) {
    return createPortal(overlay, document.body);
  }

  return overlay;
}

/**
 * SimpleLoadingOverlay - Variante minimalista
 */
export interface SimpleLoadingOverlayProps {
  /**
   * Se está carregando
   */
  isLoading: boolean;

  /**
   * Tamanho do spinner
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function SimpleLoadingOverlay({
  isLoading,
  size = 'md',
  className,
}: SimpleLoadingOverlayProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-sm z-10',
        className
      )}
      role="status"
      aria-label="Carregando"
    >
      <Loader2
        size={sizeClasses[size]}
        className="text-primary-600 animate-spin"
        aria-hidden="true"
      />
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

/**
 * InlineLoader - Loader inline (não overlay)
 */
export interface InlineLoaderProps {
  /**
   * Se está carregando
   */
  isLoading?: boolean;

  /**
   * Mensagem
   */
  message?: string;

  /**
   * Tamanho
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function InlineLoader({
  isLoading = true,
  message,
  size = 'md',
  className,
}: InlineLoaderProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2
        size={sizeClasses[size]}
        className="text-primary-600 animate-spin flex-shrink-0"
        aria-hidden="true"
      />
      {message && (
        <span className={cn('text-gray-700', textSizeClasses[size])}>
          {message}
        </span>
      )}
      {!message && <span className="sr-only">Carregando...</span>}
    </div>
  );
}

/**
 * SectionLoader - Loader para seções/cards
 */
export interface SectionLoaderProps {
  /**
   * Se está carregando
   */
  isLoading: boolean;

  /**
   * Mensagem
   */
  message?: string;

  /**
   * Altura mínima da seção
   */
  minHeight?: string;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function SectionLoader({
  isLoading,
  message = 'Carregando...',
  minHeight = 'min-h-[200px]',
  className,
}: SectionLoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-8',
        minHeight,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2
        size={32}
        className="text-primary-600 animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}

/**
 * ButtonLoader - Loader para botões
 */
export interface ButtonLoaderProps {
  /**
   * Se está carregando
   */
  isLoading?: boolean;

  /**
   * Texto durante loading
   */
  loadingText?: string;

  /**
   * Texto normal
   */
  children: React.ReactNode;

  /**
   * Tamanho do spinner
   */
  size?: number;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function ButtonLoader({
  isLoading = false,
  loadingText,
  children,
  size = 16,
  className,
}: ButtonLoaderProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {isLoading && (
        <Loader2
          size={size}
          className="animate-spin flex-shrink-0"
          aria-hidden="true"
        />
      )}
      {isLoading ? loadingText || children : children}
    </span>
  );
}

/**
 * SkeletonLoader - Loader estilo skeleton
 */
export interface SkeletonLoaderProps {
  /**
   * Número de linhas
   */
  lines?: number;

  /**
   * Altura das linhas
   */
  lineHeight?: string;

  /**
   * Espaçamento entre linhas
   */
  gap?: string;

  /**
   * Se true, anima
   */
  animate?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function SkeletonLoader({
  lines = 3,
  lineHeight = 'h-4',
  gap = 'gap-3',
  animate = true,
  className,
}: SkeletonLoaderProps) {
  return (
    <div className={cn('space-y-3', gap, className)} role="status" aria-label="Carregando">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-200 rounded',
            lineHeight,
            animate && 'animate-pulse',
            i === lines - 1 && 'w-3/4' // Última linha mais curta
          )}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Carregando conteúdo...</span>
    </div>
  );
}

/**
 * useLoadingState - Hook para gerenciar estado de loading
 */
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);

  const withLoading = React.useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      startLoading();
      try {
        return await fn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
    setIsLoading,
  };
}
