/**
 * Pagination Component
 *
 * Componente de paginação com suporte a navegação numérica,
 * seleção de itens por página e informações de total.
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 *   totalItems={150}
 *   itemsPerPage={10}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  /**
   * Página atual (1-indexed)
   */
  currentPage: number;

  /**
   * Total de páginas
   */
  totalPages: number;

  /**
   * Callback quando página muda
   */
  onPageChange: (page: number) => void;

  /**
   * Total de itens (para exibir info)
   */
  totalItems?: number;

  /**
   * Itens por página
   */
  itemsPerPage?: number;

  /**
   * Callback quando itens por página muda
   */
  onItemsPerPageChange?: (itemsPerPage: number) => void;

  /**
   * Opções de itens por página
   */
  itemsPerPageOptions?: number[];

  /**
   * Máximo de botões de página para exibir
   * Default: 7
   */
  maxPageButtons?: number;

  /**
   * Se true, mostra botões de primeira/última página
   * Default: true
   */
  showFirstLast?: boolean;

  /**
   * Se true, mostra informação de itens (ex: "1-10 de 100")
   * Default: true
   */
  showItemsInfo?: boolean;

  /**
   * Se true, mostra seletor de itens por página
   * Default: false
   */
  showItemsPerPage?: boolean;

  /**
   * Variante de tamanho
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Se true, desabilita a paginação
   */
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  maxPageButtons = 7,
  showFirstLast = true,
  showItemsInfo = true,
  showItemsPerPage = false,
  size = 'md',
  className,
  disabled = false,
}: PaginationProps) {
  // Calcula range de itens exibidos
  const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems
    ? Math.min(currentPage * itemsPerPage, totalItems)
    : 0;

  // Gera array de números de página para exibir
  const pageNumbers = React.useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= maxPageButtons) {
      // Se cabe tudo, mostra todas as páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica complexa para mostrar páginas relevantes com ellipsis
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      // Sempre mostra primeira página
      pages.push(1);

      if (shouldShowLeftEllipsis) {
        pages.push('ellipsis');
      } else if (leftSiblingIndex === 2) {
        pages.push(2);
      }

      // Páginas do meio
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (shouldShowRightEllipsis) {
        pages.push('ellipsis');
      } else if (rightSiblingIndex === totalPages - 1) {
        pages.push(totalPages - 1);
      }

      // Sempre mostra última página
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxPageButtons]);

  // Classes de tamanho
  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3 text-base',
    lg: 'h-12 px-4 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // Handler de mudança de página
  const handlePageChange = (page: number) => {
    if (disabled) return;
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav
      className={cn('flex items-center justify-between', className)}
      aria-label="Paginação"
    >
      {/* Info de itens (esquerda) */}
      <div className="flex items-center gap-4">
        {showItemsInfo && totalItems && (
          <p className="text-sm text-gray-700">
            Exibindo <span className="font-medium">{startItem}</span> a{' '}
            <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{totalItems}</span> resultado
            {totalItems !== 1 ? 's' : ''}
          </p>
        )}

        {/* Seletor de itens por página */}
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-700">
              Por página:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              disabled={disabled}
              className={cn(
                'border border-gray-300 rounded-lg text-sm bg-white',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'disabled:bg-gray-100 disabled:cursor-not-allowed',
                sizeClasses[size]
              )}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Botões de navegação (direita) */}
      <div className="flex items-center gap-1">
        {/* Primeira página */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            className={cn(
              'inline-flex items-center justify-center border border-gray-300 rounded-lg bg-white',
              'hover:bg-gray-50 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
              sizeClasses[size]
            )}
            aria-label="Primeira página"
          >
            <ChevronsLeft size={iconSizes[size]} aria-hidden="true" />
          </button>
        )}

        {/* Página anterior */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          className={cn(
            'inline-flex items-center justify-center border border-gray-300 rounded-lg bg-white',
            'hover:bg-gray-50 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
            sizeClasses[size]
          )}
          aria-label="Página anterior"
        >
          <ChevronLeft size={iconSizes[size]} aria-hidden="true" />
        </button>

        {/* Números de página */}
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className={cn(
                  'inline-flex items-center justify-center text-gray-500',
                  sizeClasses[size]
                )}
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={disabled}
              className={cn(
                'inline-flex items-center justify-center border rounded-lg font-medium transition-colors min-w-[40px]',
                isActive
                  ? 'border-primary-600 bg-primary-600 text-white hover:bg-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sizeClasses[size]
              )}
              aria-label={`Página ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}

        {/* Próxima página */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          className={cn(
            'inline-flex items-center justify-center border border-gray-300 rounded-lg bg-white',
            'hover:bg-gray-50 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
            sizeClasses[size]
          )}
          aria-label="Próxima página"
        >
          <ChevronRight size={iconSizes[size]} aria-hidden="true" />
        </button>

        {/* Última página */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            className={cn(
              'inline-flex items-center justify-center border border-gray-300 rounded-lg bg-white',
              'hover:bg-gray-50 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white',
              sizeClasses[size]
            )}
            aria-label="Última página"
          >
            <ChevronsRight size={iconSizes[size]} aria-hidden="true" />
          </button>
        )}
      </div>
    </nav>
  );
}

/**
 * SimplePagination - Variante simplificada (apenas prev/next)
 */
export interface SimplePaginationProps {
  /**
   * Se existe página anterior
   */
  hasPrevious: boolean;

  /**
   * Se existe próxima página
   */
  hasNext: boolean;

  /**
   * Callback para página anterior
   */
  onPrevious: () => void;

  /**
   * Callback para próxima página
   */
  onNext: () => void;

  /**
   * Texto do botão anterior
   */
  previousLabel?: string;

  /**
   * Texto do botão próximo
   */
  nextLabel?: string;

  /**
   * Informação de página atual (opcional)
   */
  pageInfo?: string;

  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Se true, desabilita
   */
  disabled?: boolean;
}

export function SimplePagination({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  previousLabel = 'Anterior',
  nextLabel = 'Próximo',
  pageInfo,
  className,
  disabled = false,
}: SimplePaginationProps) {
  return (
    <nav
      className={cn('flex items-center justify-between', className)}
      aria-label="Paginação"
    >
      {/* Botão anterior */}
      <button
        onClick={onPrevious}
        disabled={disabled || !hasPrevious}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white',
          'text-sm font-medium text-gray-700',
          'hover:bg-gray-50 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
        )}
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        {previousLabel}
      </button>

      {/* Info de página (opcional) */}
      {pageInfo && (
        <span className="text-sm text-gray-700 font-medium">{pageInfo}</span>
      )}

      {/* Botão próximo */}
      <button
        onClick={onNext}
        disabled={disabled || !hasNext}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white',
          'text-sm font-medium text-gray-700',
          'hover:bg-gray-50 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
        )}
        aria-label="Próxima página"
      >
        {nextLabel}
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}

/**
 * usePagination - Hook para gerenciar estado de paginação
 */
export interface UsePaginationOptions {
  /**
   * Total de itens
   */
  totalItems: number;

  /**
   * Itens por página inicial
   */
  initialItemsPerPage?: number;

  /**
   * Página inicial
   */
  initialPage?: number;
}

export interface UsePaginationReturn {
  /**
   * Página atual (1-indexed)
   */
  currentPage: number;

  /**
   * Total de páginas
   */
  totalPages: number;

  /**
   * Itens por página
   */
  itemsPerPage: number;

  /**
   * Índice do primeiro item da página atual (0-indexed)
   */
  startIndex: number;

  /**
   * Índice do último item da página atual (0-indexed)
   */
  endIndex: number;

  /**
   * Handler para mudar página
   */
  setPage: (page: number) => void;

  /**
   * Handler para mudar itens por página
   */
  setItemsPerPage: (items: number) => void;

  /**
   * Ir para próxima página
   */
  nextPage: () => void;

  /**
   * Ir para página anterior
   */
  previousPage: () => void;

  /**
   * Ir para primeira página
   */
  firstPage: () => void;

  /**
   * Ir para última página
   */
  lastPage: () => void;

  /**
   * Se pode ir para página anterior
   */
  canGoPrevious: boolean;

  /**
   * Se pode ir para próxima página
   */
  canGoNext: boolean;
}

export function usePagination({
  totalItems,
  initialItemsPerPage = 10,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = React.useState(
    initialItemsPerPage
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Garante que currentPage está dentro dos limites
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const setPage = React.useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const setItemsPerPage = React.useCallback(
    (items: number) => {
      setItemsPerPageState(items);
      setCurrentPage(1); // Reseta para primeira página
    },
    []
  );

  const nextPage = React.useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const previousPage = React.useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  const firstPage = React.useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = React.useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    setPage,
    setItemsPerPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    canGoPrevious: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
}
