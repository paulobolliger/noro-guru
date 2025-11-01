// components/ui/DataTable.tsx
'use client';

import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterBar, type FilterConfig, type ActiveFilter } from './FilterBar';

type SortDirection = 'asc' | 'desc' | null;

// Função auxiliar para exportar para CSV
function exportToCSV<T>(data: T[], columns: Column<T>[], filename: string) {
  // Cabeçalho CSV
  const headers = columns.map(col => col.label).join(',');
  
  // Linhas de dados
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key as keyof T];
      // Escapar valores que contenham vírgulas ou aspas
      const stringValue = String(value || '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  }).join('\n');
  
  const csv = `${headers}\n${rows}`;
  
  // Criar blob e download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface BulkAction<T> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  confirmMessage?: string;
  action: (selectedRows: T[]) => Promise<void>;
}

export interface ExportConfig {
  filename?: string;
  formats?: ('csv' | 'excel')[];
  includeFiltered?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  filters?: FilterConfig[];
  onFilteredDataChange?: (data: T[]) => void;
  filterStorageKey?: string;
  bulkActions?: BulkAction<T>[];
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  exportable?: boolean;
  exportConfig?: ExportConfig;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum registro encontrado',
  rowKey,
  onRowClick,
  loading = false,
  filters,
  onFilteredDataChange,
  filterStorageKey,
  bulkActions,
  selectable = false,
  pagination = false,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  exportable = false,
  exportConfig,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isExecutingBulkAction, setIsExecutingBulkAction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [isExporting, setIsExporting] = useState(false);

  // Aplicar filtros avançados
  const applyAdvancedFilters = (rows: T[]): T[] => {
    if (activeFilters.length === 0) return rows;

    return rows.filter((row) => {
      return activeFilters.every((filter) => {
        // Filtro de valores múltiplos
        if (filter.values && filter.values.length > 0) {
          const rowValue = String(row[filter.key as keyof T] || '');
          return filter.values.some((value) =>
            rowValue.toLowerCase().includes(value.toLowerCase())
          );
        }

        // Filtro de data range
        if (filter.dateRange?.from) {
          const rowValue = row[filter.key as keyof T];
          if (!rowValue) return false;

          const rowDate = new Date(rowValue);
          const fromDate = filter.dateRange.from;
          const toDate = filter.dateRange.to || fromDate;

          return rowDate >= fromDate && rowDate <= toDate;
        }

        return true;
      });
    });
  };

  // Filtrar por busca
  const filteredData = useMemo(() => {
    let result = data;

    // Aplicar filtros avançados
    result = applyAdvancedFilters(result);

    // Aplicar busca de texto
    if (searchable && searchQuery) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Notificar mudanças
    onFilteredDataChange?.(result);

    return result;
  }, [data, activeFilters, searchQuery, searchable]);

  // Ordenar
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aValue = a[sortColumn as keyof T];
    const bValue = b[sortColumn as keyof T];

    if (aValue === bValue) return 0;

    const comparison = aValue > bValue ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginação
  const totalPages = pagination ? Math.ceil(sortedData.length / currentPageSize) : 1;
  const paginatedData = pagination 
    ? sortedData.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize)
    : sortedData;

  // Resetar para página 1 quando filtros mudarem
  useMemo(() => {
    setCurrentPage(1);
  }, [activeFilters, searchQuery]);

  // Funções de paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows(new Set()); // Limpar seleção ao mudar de página
  };

  const handlePageSizeChange = (size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
    setSelectedRows(new Set());
  };

  // Função de exportação
  const handleExport = async (format: 'csv' | 'excel') => {
    setIsExporting(true);
    try {
      const dataToExport = exportConfig?.includeFiltered ? sortedData : data;
      
      if (format === 'csv') {
        exportToCSV(dataToExport, columns, exportConfig?.filename || 'export');
      } else {
        // Excel export pode ser implementado com biblioteca como xlsx
        exportToCSV(dataToExport, columns, exportConfig?.filename || 'export');
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Funções de seleção múltipla
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedData.map(row => String(row[rowKey])));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };

  const getSelectedRowsData = (): T[] => {
    return sortedData.filter(row => selectedRows.has(String(row[rowKey])));
  };

  const handleBulkAction = async (action: BulkAction<T>) => {
    const selected = getSelectedRowsData();
    if (selected.length === 0) return;

    // Confirmar ação destrutiva
    if (action.confirmMessage) {
      const confirmed = confirm(action.confirmMessage.replace('{count}', String(selected.length)));
      if (!confirmed) return;
    }

    setIsExecutingBulkAction(true);
    try {
      await action.action(selected);
      setSelectedRows(new Set()); // Limpar seleção após ação
    } catch (error) {
      console.error('Erro ao executar ação em lote:', error);
    } finally {
      setIsExecutingBulkAction(false);
    }
  };

  const allSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < paginatedData.length;

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const key = column.key;

    if (sortColumn === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const key = column.key;
    if (sortColumn !== key) {
      return <ChevronsUpDown size={14} className="text-muted" />;
    }

    return sortDirection === 'asc' ? (
      <ChevronUp size={14} className="text-accent" />
    ) : (
      <ChevronDown size={14} className="text-accent" />
    );
  };

  if (loading) {
    return (
      <div className="noro-card overflow-hidden">
        <div className="animate-pulse space-y-2 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-slate-300/20 rounded flex-1" />
              <div className="h-4 bg-slate-300/20 rounded flex-1" />
              <div className="h-4 bg-slate-300/20 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      {filters && filters.length > 0 && (
        <FilterBar
          filters={filters}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          showSaveButton={!!filterStorageKey}
          storageKey={filterStorageKey}
        />
      )}

      {/* Barra flutuante de ações em lote */}
      {selectable && selectedRows.size > 0 && bulkActions && bulkActions.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-accent text-white rounded-lg shadow-2xl border border-accent/20 px-6 py-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{selectedRows.size}</span>
              <span className="text-sm opacity-90">
                {selectedRows.size === 1 ? 'item selecionado' : 'itens selecionados'}
              </span>
            </div>
            
            <div className="w-px h-6 bg-white/20" />
            
            <div className="flex gap-2">
              {bulkActions.map((action) => {
                const variantStyles = {
                  default: 'bg-white/10 hover:bg-white/20',
                  danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-100',
                  success: 'bg-green-500/20 hover:bg-green-500/30 text-green-100',
                  warning: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100',
                };
                
                return (
                  <button
                    key={action.id}
                    onClick={() => handleBulkAction(action)}
                    disabled={isExecutingBulkAction}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                      ${variantStyles[action.variant || 'default']}
                    `}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                );
              })}
              
              <button
                onClick={() => setSelectedRows(new Set())}
                disabled={isExecutingBulkAction}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="noro-card overflow-hidden">
        {/* Search bar */}
        {searchable && (
          <div className="p-4 border-b border-default">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-surface-alt border border-default rounded-lg text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              />
            </div>
          </div>
        )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg">
        <table className="w-full bg-white dark:bg-[#1a1625]">
          <thead className="bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-default text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    px-4 py-3 text-left text-xs font-bold text-[#D4AF37] uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-white/5 transition-colors' : ''}
                    ${column.className || ''}
                  `}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-gray-600 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const rowId = String(row[rowKey]);
                const isSelected = selectedRows.has(rowId);
                
                return (
                  <tr
                    key={rowId}
                    className={`
                      transition-colors border-l-2 border-transparent
                      ${isSelected ? 'bg-accent/5 border-l-accent' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02] hover:border-l-accent'}
                      ${onRowClick && !selectable ? 'cursor-pointer' : ''}
                    `}
                  >
                    {selectable && (
                      <td className="px-4 py-3 w-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-default text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const value = row[column.key as keyof T];
                      return (
                        <td
                          key={String(column.key)}
                          onClick={() => !selectable && onRowClick?.(row)}
                          className={`px-4 py-3 text-sm text-gray-900 dark:text-white ${column.className || ''}`}
                        >
                          {column.render ? column.render(value, row) : String(value || '-')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer com contador, paginação e exportação */}
      {sortedData.length > 0 && (
        <div className="px-4 py-3 border-t border-default bg-surface-alt">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Contador e page size */}
            <div className="flex items-center gap-4">
              <div className="text-xs text-muted">
                Exibindo{' '}
                <span className="font-semibold text-primary">
                  {pagination ? `${(currentPage - 1) * currentPageSize + 1}-${Math.min(currentPage * currentPageSize, sortedData.length)}` : sortedData.length}
                </span>{' '}
                de <span className="font-semibold text-primary">{sortedData.length}</span> registros
                {sortedData.length !== data.length && (
                  <span className="text-muted"> (filtrados de {data.length})</span>
                )}
              </div>

              {/* Page size selector */}
              {pagination && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">Por página:</span>
                  <select
                    value={currentPageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-2 py-1 text-xs rounded border border-default bg-surface text-primary focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    {pageSizeOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Paginação e Exportação */}
            <div className="flex items-center gap-4">
              {/* Botões de exportação */}
              {exportable && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border border-default bg-surface text-primary hover:border-accent hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download size={14} />
                    {isExporting ? 'Exportando...' : 'Exportar CSV'}
                  </button>
                </div>
              )}

              {/* Controles de paginação */}
              {pagination && totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded border border-default bg-surface text-primary hover:border-accent hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`
                            px-3 py-1 text-xs rounded border transition-colors
                            ${currentPage === pageNum
                              ? 'bg-accent text-white border-accent'
                              : 'border-default bg-surface text-primary hover:border-accent hover:text-accent'
                            }
                          `}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded border border-default bg-surface text-primary hover:border-accent hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>

                  <span className="text-xs text-muted ml-2">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
