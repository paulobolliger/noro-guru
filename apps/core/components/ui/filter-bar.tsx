/**
 * FilterBar Component
 *
 * Barra de filtros reutilizável para tabelas e listas.
 * Suporta busca, filtros por select, tags de filtros ativos e mais.
 *
 * @example
 * ```tsx
 * <FilterBar
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   searchPlaceholder="Buscar leads..."
 *   filters={[
 *     {
 *       label: 'Status',
 *       value: statusFilter,
 *       onChange: setStatusFilter,
 *       options: statusOptions,
 *     },
 *   ]}
 *   activeFiltersCount={2}
 *   onClearFilters={handleClearFilters}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { SearchInput } from './input';
import { SimpleSelect } from './select';
import { Badge } from './badge';

export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Filter {
  /**
   * Nome do filtro (usado como key)
   */
  name: string;

  /**
   * Label exibido
   */
  label: string;

  /**
   * Valor atual
   */
  value: string;

  /**
   * Callback quando valor muda
   */
  onChange: (value: string) => void;

  /**
   * Opções do select
   */
  options: FilterOption[];

  /**
   * Placeholder
   */
  placeholder?: string;
}

export interface ActiveFilter {
  /**
   * Label do filtro
   */
  label: string;

  /**
   * Valor exibido
   */
  displayValue: string;

  /**
   * Callback para remover
   */
  onRemove: () => void;
}

export interface FilterBarProps {
  /**
   * Valor da busca
   */
  searchValue?: string;

  /**
   * Callback quando busca muda
   */
  onSearchChange?: (value: string) => void;

  /**
   * Placeholder da busca
   */
  searchPlaceholder?: string;

  /**
   * Filtros (selects)
   */
  filters?: Filter[];

  /**
   * Filtros ativos (para exibir como tags)
   */
  activeFilters?: ActiveFilter[];

  /**
   * Contador de filtros ativos
   */
  activeFiltersCount?: number;

  /**
   * Callback para limpar todos os filtros
   */
  onClearFilters?: () => void;

  /**
   * Se true, mostra filtros sempre (sem botão toggle)
   * Default: false (filtros colapsáveis em mobile)
   */
  alwaysShowFilters?: boolean;

  /**
   * Ações customizadas (botões extras)
   */
  actions?: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function FilterBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  filters = [],
  activeFilters = [],
  activeFiltersCount = 0,
  onClearFilters,
  alwaysShowFilters = false,
  actions,
  className,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = React.useState(alwaysShowFilters);

  const hasActiveFilters = activeFiltersCount > 0 || activeFilters.length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Barra Principal */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Campo de Busca */}
        {onSearchChange && (
          <div className="flex-1">
            <SearchInput
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange('')}
              placeholder={searchPlaceholder}
              showClearButton
            />
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex items-center gap-2">
          {/* Botão de Toggle de Filtros (mobile) */}
          {!alwaysShowFilters && filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg',
                'text-sm font-medium transition-colors',
                'hover:bg-gray-50',
                showFilters
                  ? 'border-primary-500 text-primary-700 bg-primary-50'
                  : 'border-gray-300 text-gray-700 bg-white'
              )}
              aria-label="Toggle filtros"
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={18} aria-hidden="true" />
              <span className="hidden sm:inline">Filtros</span>
              {hasActiveFilters && (
                <Badge variant="default" className="ml-1">
                  {activeFiltersCount || activeFilters.length}
                </Badge>
              )}
              <ChevronDown
                size={16}
                className={cn(
                  'transition-transform',
                  showFilters && 'rotate-180'
                )}
                aria-hidden="true"
              />
            </button>
          )}

          {/* Botão de Limpar Filtros */}
          {hasActiveFilters && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              aria-label="Limpar filtros"
            >
              <X size={18} aria-hidden="true" />
              <span className="hidden sm:inline">Limpar</span>
            </button>
          )}

          {/* Ações Customizadas */}
          {actions}
        </div>
      </div>

      {/* Filtros (Selects) */}
      {(showFilters || alwaysShowFilters) && filters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filters.map((filter) => (
            <div key={filter.name}>
              <label
                htmlFor={`filter-${filter.name}`}
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {filter.label}
              </label>
              <SimpleSelect
                id={`filter-${filter.name}`}
                name={filter.name}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                options={filter.options}
                placeholder={filter.placeholder || `Todos`}
                selectSize="sm"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tags de Filtros Ativos */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Filtros ativos:
          </span>
          {activeFilters.map((filter, index) => (
            <FilterTag
              key={`${filter.label}-${index}`}
              label={filter.label}
              value={filter.displayValue}
              onRemove={filter.onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * FilterTag - Tag de filtro ativo
 */
interface FilterTagProps {
  label: string;
  value: string;
  onRemove: () => void;
}

function FilterTag({ label, value, onRemove }: FilterTagProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-sm">
      <span className="font-medium text-primary-900">{label}:</span>
      <span className="text-primary-700">{value}</span>
      <button
        onClick={onRemove}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 transition-colors"
        aria-label={`Remover filtro ${label}`}
      >
        <X size={12} className="text-primary-700" aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * useFilters - Hook para gerenciar estado de filtros
 */
export interface UseFiltersOptions<T extends Record<string, any>> {
  /**
   * Valores iniciais dos filtros
   */
  initialFilters: T;

  /**
   * Callback quando filtros mudam
   */
  onFiltersChange?: (filters: T) => void;
}

export interface UseFiltersReturn<T extends Record<string, any>> {
  /**
   * Valores atuais dos filtros
   */
  filters: T;

  /**
   * Atualiza um filtro específico
   */
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;

  /**
   * Atualiza múltiplos filtros
   */
  setFilters: (filters: Partial<T>) => void;

  /**
   * Limpa todos os filtros (volta ao inicial)
   */
  clearFilters: () => void;

  /**
   * Limpa um filtro específico
   */
  clearFilter: <K extends keyof T>(key: K) => void;

  /**
   * Verifica se um filtro está ativo (diferente do inicial)
   */
  isFilterActive: <K extends keyof T>(key: K) => boolean;

  /**
   * Número de filtros ativos
   */
  activeFiltersCount: number;

  /**
   * Se tem algum filtro ativo
   */
  hasActiveFilters: boolean;
}

export function useFilters<T extends Record<string, any>>({
  initialFilters,
  onFiltersChange,
}: UseFiltersOptions<T>): UseFiltersReturn<T> {
  const [filters, setFiltersState] = React.useState<T>(initialFilters);

  const setFilter = React.useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      const newFilters = { ...filters, [key]: value };
      setFiltersState(newFilters);
      onFiltersChange?.(newFilters);
    },
    [filters, onFiltersChange]
  );

  const setFilters = React.useCallback(
    (newFilters: Partial<T>) => {
      const updated = { ...filters, ...newFilters };
      setFiltersState(updated);
      onFiltersChange?.(updated);
    },
    [filters, onFiltersChange]
  );

  const clearFilters = React.useCallback(() => {
    setFiltersState(initialFilters);
    onFiltersChange?.(initialFilters);
  }, [initialFilters, onFiltersChange]);

  const clearFilter = React.useCallback(
    <K extends keyof T>(key: K) => {
      const newFilters = { ...filters, [key]: initialFilters[key] };
      setFiltersState(newFilters);
      onFiltersChange?.(newFilters);
    },
    [filters, initialFilters, onFiltersChange]
  );

  const isFilterActive = React.useCallback(
    <K extends keyof T>(key: K) => {
      return filters[key] !== initialFilters[key];
    },
    [filters, initialFilters]
  );

  const activeFiltersCount = React.useMemo(() => {
    return Object.keys(filters).filter((key) =>
      isFilterActive(key as keyof T)
    ).length;
  }, [filters, isFilterActive]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    clearFilter,
    isFilterActive,
    activeFiltersCount,
    hasActiveFilters,
  };
}

/**
 * SimpleFilterBar - Variante simplificada (apenas busca)
 */
export interface SimpleFilterBarProps {
  /**
   * Valor da busca
   */
  searchValue: string;

  /**
   * Callback quando busca muda
   */
  onSearchChange: (value: string) => void;

  /**
   * Placeholder
   */
  placeholder?: string;

  /**
   * Ações customizadas
   */
  actions?: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function SimpleFilterBar({
  searchValue,
  onSearchChange,
  placeholder = 'Buscar...',
  actions,
  className,
}: SimpleFilterBarProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Campo de Busca */}
      <div className="flex-1">
        <SearchInput
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          placeholder={placeholder}
          showClearButton
        />
      </div>

      {/* Ações */}
      {actions}
    </div>
  );
}
