/**
 * Skeleton Component
 *
 * Componentes de loading skeleton para melhor percepção de performance.
 * Usado enquanto dados estão sendo carregados.
 *
 * @example
 * ```tsx
 * {loading ? <TableSkeleton rows={5} /> : <DataTable data={data} />}
 * ```
 */

import { cn } from '@/lib/utils';

// ============================================================================
// Base Skeleton Component
// ============================================================================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Se true, usa animação de pulse mais lenta
   * Default: false
   */
  slow?: boolean;
}

export function Skeleton({ className, slow, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-gray-200',
        slow ? 'animate-pulse-slow' : 'animate-pulse',
        className
      )}
      {...props}
    />
  );
}

// ============================================================================
// Skeleton Presets
// ============================================================================

/**
 * Skeleton para tabelas
 */
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Carregando tabela">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-10 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={`cell-${i}-${j}`} className="h-12 flex-1" />
          ))}
        </div>
      ))}

      <span className="sr-only">Carregando dados da tabela...</span>
    </div>
  );
}

/**
 * Skeleton para cards
 */
export interface CardSkeletonProps {
  /**
   * Se true, inclui imagem no topo do card
   */
  withImage?: boolean;
  /**
   * Número de linhas de texto
   */
  lines?: number;
}

export function CardSkeleton({ withImage, lines = 3 }: CardSkeletonProps) {
  return (
    <div className="p-6 space-y-4 bg-white rounded-lg shadow" role="status" aria-label="Carregando card">
      {/* Image */}
      {withImage && <Skeleton className="h-48 w-full" />}

      {/* Title */}
      <Skeleton className="h-6 w-1/3" />

      {/* Text lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>

      <span className="sr-only">Carregando conteúdo do card...</span>
    </div>
  );
}

/**
 * Skeleton para formulários
 */
export interface FormSkeletonProps {
  fields?: number;
}

export function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <div className="space-y-6" role="status" aria-label="Carregando formulário">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          {/* Label */}
          <Skeleton className="h-4 w-24" />
          {/* Input */}
          <Skeleton className="h-12 w-full" />
        </div>
      ))}

      {/* Submit button */}
      <Skeleton className="h-12 w-32" />

      <span className="sr-only">Carregando formulário...</span>
    </div>
  );
}

/**
 * Skeleton para lista de itens
 */
export interface ListSkeletonProps {
  items?: number;
  /**
   * Se true, adiciona avatar ao lado esquerdo
   */
  withAvatar?: boolean;
}

export function ListSkeleton({ items = 5, withAvatar }: ListSkeletonProps) {
  return (
    <div className="space-y-4" role="status" aria-label="Carregando lista">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {withAvatar && <Skeleton className="h-12 w-12 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}

      <span className="sr-only">Carregando itens da lista...</span>
    </div>
  );
}

/**
 * Skeleton para Kanban board
 */
export interface KanbanSkeletonProps {
  columns?: number;
  cardsPerColumn?: number;
}

export function KanbanSkeleton({ columns = 4, cardsPerColumn = 3 }: KanbanSkeletonProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4" role="status" aria-label="Carregando kanban">
      {Array.from({ length: columns }).map((_, colIndex) => (
        <div key={colIndex} className="flex-shrink-0 w-80 space-y-3">
          {/* Column header */}
          <Skeleton className="h-10 w-full" />

          {/* Cards */}
          {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
            <div key={cardIndex} className="space-y-2 p-4 bg-white rounded-lg shadow">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      ))}

      <span className="sr-only">Carregando quadro kanban...</span>
    </div>
  );
}

/**
 * Skeleton para estatísticas/métricas
 */
export interface StatSkeletonProps {
  count?: number;
}

export function StatSkeleton({ count = 4 }: StatSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      role="status"
      aria-label="Carregando estatísticas"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-lg shadow space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}

      <span className="sr-only">Carregando estatísticas...</span>
    </div>
  );
}

/**
 * Skeleton para página completa
 */
export function PageSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Carregando página">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats */}
      <StatSkeleton />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TableSkeleton rows={8} />
        </div>
        <div className="space-y-4">
          <CardSkeleton lines={4} />
          <CardSkeleton lines={3} />
        </div>
      </div>

      <span className="sr-only">Carregando página...</span>
    </div>
  );
}

/**
 * Skeleton para texto (parágrafos)
 */
export interface TextSkeletonProps {
  lines?: number;
}

export function TextSkeleton({ lines = 3 }: TextSkeletonProps) {
  return (
    <div className="space-y-2" role="status" aria-label="Carregando texto">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}

      <span className="sr-only">Carregando texto...</span>
    </div>
  );
}
