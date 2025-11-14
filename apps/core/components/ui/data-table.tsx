/**
 * DataTable Component
 *
 * Tabela de dados completa com sorting, seleção, actions e paginação.
 * Componente altamente configurável e acessível.
 *
 * @example
 * ```tsx
 * <DataTable
 *   data={leads}
 *   columns={[
 *     { key: 'nome', header: 'Nome', sortable: true },
 *     { key: 'email', header: 'Email' },
 *     { key: 'status', header: 'Status', render: (lead) => <Badge>{lead.status}</Badge> },
 *   ]}
 *   onRowClick={(lead) => router.push(`/leads/${lead.id}`)}
 *   loading={isLoading}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import { EmptyTableState } from './empty-state';
import { TableSkeleton } from './skeleton';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  /**
   * Chave da propriedade no objeto de dados
   */
  key: keyof T | string;

  /**
   * Texto do cabeçalho
   */
  header: string;

  /**
   * Função customizada de renderização
   */
  render?: (item: T, index: number) => React.ReactNode;

  /**
   * Se a coluna é ordenável
   */
  sortable?: boolean;

  /**
   * Largura da coluna (classes Tailwind)
   */
  width?: string;

  /**
   * Alinhamento do conteúdo
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Se true, oculta em mobile
   */
  hideOnMobile?: boolean;

  /**
   * Acessor customizado para sorting
   */
  sortAccessor?: (item: T) => any;
}

export interface RowAction<T> {
  /**
   * Label da ação
   */
  label: string;

  /**
   * Ícone (opcional)
   */
  icon?: React.ReactNode;

  /**
   * Handler da ação
   */
  onClick: (item: T) => void;

  /**
   * Se true, mostra como ação destrutiva (vermelho)
   */
  destructive?: boolean;

  /**
   * Condição para mostrar a ação
   */
  condition?: (item: T) => boolean;
}

export interface DataTableProps<T> {
  /**
   * Array de dados
   */
  data: T[];

  /**
   * Definição das colunas
   */
  columns: Column<T>[];

  /**
   * Função para extrair key única de cada linha
   */
  getRowKey: (item: T) => string | number;

  /**
   * Callback quando linha é clicada
   */
  onRowClick?: (item: T) => void;

  /**
   * Ações por linha (menu de 3 pontos)
   */
  rowActions?: RowAction<T>[];

  /**
   * Se true, permite seleção de múltiplas linhas
   */
  selectable?: boolean;

  /**
   * Linhas selecionadas (controlled)
   */
  selectedRows?: Set<string | number>;

  /**
   * Callback quando seleção muda
   */
  onSelectionChange?: (selected: Set<string | number>) => void;

  /**
   * Estado de loading
   */
  loading?: boolean;

  /**
   * Número de rows do skeleton (quando loading)
   */
  skeletonRows?: number;

  /**
   * Sorting (controlled)
   */
  sortBy?: keyof T | string;

  /**
   * Direção do sorting (controlled)
   */
  sortDirection?: SortDirection;

  /**
   * Callback quando sorting muda
   */
  onSortChange?: (key: keyof T | string, direction: SortDirection) => void;

  /**
   * Estado vazio customizado
   */
  emptyState?: React.ReactNode;

  /**
   * Nome da entidade (para estado vazio padrão)
   */
  entityName?: string;

  /**
   * Callback para criar novo (botão no estado vazio)
   */
  onCreateNew?: () => void;

  /**
   * Se true, mostra zebra striping
   */
  striped?: boolean;

  /**
   * Se true, mostra hover nas linhas
   */
  hoverable?: boolean;

  /**
   * Se true, usa layout compacto
   */
  compact?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  getRowKey,
  onRowClick,
  rowActions,
  selectable = false,
  selectedRows,
  onSelectionChange,
  loading = false,
  skeletonRows = 5,
  sortBy,
  sortDirection,
  onSortChange,
  emptyState,
  entityName = 'itens',
  onCreateNew,
  striped = false,
  hoverable = true,
  compact = false,
  className,
}: DataTableProps<T>) {
  const [localSort, setLocalSort] = React.useState<{
    key: keyof T | string;
    direction: SortDirection;
  }>({ key: '', direction: null });

  const [openActionMenu, setOpenActionMenu] = React.useState<
    string | number | null
  >(null);

  // Se não é controlled, usa estado local
  const currentSortKey = sortBy ?? localSort.key;
  const currentSortDirection = sortDirection ?? localSort.direction;

  // Handler de sort
  const handleSort = (key: keyof T | string) => {
    let newDirection: SortDirection = 'asc';

    if (currentSortKey === key) {
      if (currentSortDirection === 'asc') newDirection = 'desc';
      else if (currentSortDirection === 'desc') newDirection = null;
    }

    if (onSortChange) {
      onSortChange(key, newDirection);
    } else {
      setLocalSort({ key, direction: newDirection });
    }
  };

  // Dados ordenados (se não controlado)
  const sortedData = React.useMemo(() => {
    if (!currentSortKey || !currentSortDirection) return data;

    const column = columns.find((col) => col.key === currentSortKey);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = column.sortAccessor
        ? column.sortAccessor(a)
        : a[currentSortKey as keyof T];
      const bValue = column.sortAccessor
        ? column.sortAccessor(b)
        : b[currentSortKey as keyof T];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return currentSortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, currentSortKey, currentSortDirection, columns]);

  // Seleção
  const allSelected =
    selectable && selectedRows && data.length > 0
      ? data.every((item) => selectedRows.has(getRowKey(item)))
      : false;

  const someSelected =
    selectable && selectedRows && selectedRows.size > 0 && !allSelected;

  const handleSelectAll = () => {
    if (!selectable || !onSelectionChange) return;

    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      const newSelection = new Set(data.map((item) => getRowKey(item)));
      onSelectionChange(newSelection);
    }
  };

  const handleSelectRow = (key: string | number) => {
    if (!selectable || !onSelectionChange || !selectedRows) return;

    const newSelection = new Set(selectedRows);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    onSelectionChange(newSelection);
  };

  // Loading state
  if (loading) {
    return <TableSkeleton rows={skeletonRows} columns={columns.length} />;
  }

  // Empty state
  if (data.length === 0) {
    if (emptyState) return <>{emptyState}</>;

    return (
      <EmptyTableState
        entityName={entityName}
        onCreateNew={onCreateNew}
        className="my-8"
      />
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {/* Checkbox de seleção */}
            {selectable && (
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  aria-label="Selecionar todas as linhas"
                />
              </th>
            )}

            {/* Colunas */}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  compact ? 'px-3 py-2' : 'px-4 py-3',
                  'text-left text-sm font-semibold text-gray-700',
                  column.width,
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.hideOnMobile && 'hidden md:table-cell',
                  column.sortable && 'cursor-pointer select-none hover:bg-gray-100'
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div
                  className={cn(
                    'flex items-center gap-2',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}
                >
                  {column.header}
                  {column.sortable && (
                    <SortIcon
                      active={currentSortKey === column.key}
                      direction={
                        currentSortKey === column.key
                          ? currentSortDirection
                          : null
                      }
                    />
                  )}
                </div>
              </th>
            ))}

            {/* Coluna de ações */}
            {rowActions && rowActions.length > 0 && (
              <th className="w-12 px-4 py-3">
                <span className="sr-only">Ações</span>
              </th>
            )}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {sortedData.map((item, index) => {
            const rowKey = getRowKey(item);
            const isSelected = selectedRows?.has(rowKey) || false;

            return (
              <tr
                key={rowKey}
                className={cn(
                  'border-b border-gray-200 transition-colors',
                  hoverable && 'hover:bg-gray-50',
                  striped && index % 2 === 0 && 'bg-white',
                  striped && index % 2 === 1 && 'bg-gray-50',
                  isSelected && 'bg-primary-50',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(item)}
              >
                {/* Checkbox */}
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(rowKey);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      aria-label={`Selecionar linha ${index + 1}`}
                    />
                  </td>
                )}

                {/* Células */}
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      compact ? 'px-3 py-2' : 'px-4 py-3',
                      'text-sm text-gray-900',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.hideOnMobile && 'hidden md:table-cell'
                    )}
                  >
                    {column.render
                      ? column.render(item, index)
                      : (item[column.key as keyof T] as React.ReactNode)}
                  </td>
                ))}

                {/* Menu de Ações */}
                {rowActions && rowActions.length > 0 && (
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionMenu(
                            openActionMenu === rowKey ? null : rowKey
                          );
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 transition-colors"
                        aria-label="Menu de ações"
                        aria-expanded={openActionMenu === rowKey}
                      >
                        <MoreHorizontal size={18} className="text-gray-600" />
                      </button>

                      {openActionMenu === rowKey && (
                        <>
                          {/* Backdrop para fechar menu */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenu(null);
                            }}
                          />

                          {/* Menu */}
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            {rowActions
                              .filter((action) =>
                                action.condition ? action.condition(item) : true
                              )
                              .map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(item);
                                    setOpenActionMenu(null);
                                  }}
                                  className={cn(
                                    'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors',
                                    'hover:bg-gray-50',
                                    'first:rounded-t-lg last:rounded-b-lg',
                                    action.destructive
                                      ? 'text-red-700 hover:bg-red-50'
                                      : 'text-gray-900'
                                  )}
                                >
                                  {action.icon}
                                  {action.label}
                                </button>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * SortIcon - Ícone de ordenação
 */
interface SortIconProps {
  active: boolean;
  direction: SortDirection;
}

function SortIcon({ active, direction }: SortIconProps) {
  if (!active || !direction) {
    return <ChevronsUpDown size={14} className="text-gray-400" aria-hidden="true" />;
  }

  if (direction === 'asc') {
    return <ArrowUp size={14} className="text-primary-600" aria-hidden="true" />;
  }

  return <ArrowDown size={14} className="text-primary-600" aria-hidden="true" />;
}

/**
 * useTableSelection - Hook para gerenciar seleção de linhas
 */
export function useTableSelection<T>(
  data: T[],
  getRowKey: (item: T) => string | number
) {
  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(
    new Set()
  );

  const selectedItems = React.useMemo(() => {
    return data.filter((item) => selectedRows.has(getRowKey(item)));
  }, [data, selectedRows, getRowKey]);

  const clearSelection = React.useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const selectAll = React.useCallback(() => {
    setSelectedRows(new Set(data.map((item) => getRowKey(item))));
  }, [data, getRowKey]);

  return {
    selectedRows,
    setSelectedRows,
    selectedItems,
    selectedCount: selectedRows.size,
    clearSelection,
    selectAll,
    hasSelection: selectedRows.size > 0,
  };
}
