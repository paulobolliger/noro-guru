'use client';

import { useState, useEffect } from 'react';
import { Filter, X, Calendar, Check } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

// Importar DatePickerWithRange de packages/ui
// Se não estiver disponível, vamos criar um placeholder simples
interface DatePickerWithRangeProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
}

function DatePickerWithRange({ value, onChange }: DatePickerWithRangeProps) {
  // Placeholder simples - você pode implementar com Radix UI Popover + react-day-picker depois
  return (
    <div className="flex gap-2">
      <input
        type="date"
        value={value?.from ? value.from.toISOString().split('T')[0] : ''}
        onChange={(e) => {
          const newDate = e.target.value ? new Date(e.target.value) : undefined;
          onChange(newDate ? { from: newDate, to: value?.to } : undefined);
        }}
        className="flex-1 px-3 py-2 rounded-lg bg-surface border border-default text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
        placeholder="De"
      />
      <input
        type="date"
        value={value?.to ? value.to.toISOString().split('T')[0] : ''}
        onChange={(e) => {
          const newDate = e.target.value ? new Date(e.target.value) : undefined;
          onChange(value?.from ? { from: value.from, to: newDate } : undefined);
        }}
        className="flex-1 px-3 py-2 rounded-lg bg-surface border border-default text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
        placeholder="Até"
      />
    </div>
  );
}

export interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'multi-select' | 'date-range' | 'single-select';
  options?: FilterOption[];
}

export interface ActiveFilter {
  key: string;
  label: string;
  values?: string[];
  dateRange?: DateRange;
}

interface FilterBarProps {
  filters: FilterConfig[];
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  showSaveButton?: boolean;
  storageKey?: string;
}

export function FilterBar({
  filters,
  activeFilters,
  onFiltersChange,
  showSaveButton = false,
  storageKey,
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterConfig | null>(null);
  const [savedFilters, setSavedFilters] = useState<Record<string, ActiveFilter[]>>({});

  // Carregar filtros salvos do localStorage
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(`filters_${storageKey}`);
      if (saved) {
        try {
          setSavedFilters(JSON.parse(saved));
        } catch (e) {
          console.error('Erro ao carregar filtros salvos:', e);
        }
      }
    }
  }, [storageKey]);

  const handleAddFilter = (filter: FilterConfig) => {
    setSelectedFilter(filter);
  };

  const handleMultiSelectChange = (filterKey: string, value: string, checked: boolean) => {
    const existingFilter = activeFilters.find((f) => f.key === filterKey);
    const filterConfig = filters.find((f) => f.key === filterKey);

    if (checked) {
      if (existingFilter) {
        onFiltersChange(
          activeFilters.map((f) =>
            f.key === filterKey
              ? { ...f, values: [...(f.values || []), value] }
              : f
          )
        );
      } else {
        onFiltersChange([
          ...activeFilters,
          {
            key: filterKey,
            label: filterConfig?.label || filterKey,
            values: [value],
          },
        ]);
      }
    } else {
      const newValues = existingFilter?.values?.filter((v) => v !== value) || [];
      if (newValues.length === 0) {
        onFiltersChange(activeFilters.filter((f) => f.key !== filterKey));
      } else {
        onFiltersChange(
          activeFilters.map((f) =>
            f.key === filterKey ? { ...f, values: newValues } : f
          )
        );
      }
    }
  };

  const handleDateRangeChange = (filterKey: string, dateRange: DateRange | undefined) => {
    const filterConfig = filters.find((f) => f.key === filterKey);
    
    if (dateRange?.from) {
      const existingFilter = activeFilters.find((f) => f.key === filterKey);
      if (existingFilter) {
        onFiltersChange(
          activeFilters.map((f) =>
            f.key === filterKey ? { ...f, dateRange } : f
          )
        );
      } else {
        onFiltersChange([
          ...activeFilters,
          {
            key: filterKey,
            label: filterConfig?.label || filterKey,
            dateRange,
          },
        ]);
      }
    } else {
      onFiltersChange(activeFilters.filter((f) => f.key !== filterKey));
    }
  };

  const handleRemoveFilter = (filterKey: string) => {
    onFiltersChange(activeFilters.filter((f) => f.key !== filterKey));
  };

  const handleClearAll = () => {
    onFiltersChange([]);
    setSelectedFilter(null);
  };

  const handleSaveFilters = () => {
    if (!storageKey) return;

    const filterName = prompt('Nome para este conjunto de filtros:');
    if (!filterName) return;

    const newSaved = {
      ...savedFilters,
      [filterName]: activeFilters,
    };
    setSavedFilters(newSaved);
    localStorage.setItem(`filters_${storageKey}`, JSON.stringify(newSaved));
  };

  const handleLoadSavedFilter = (filterName: string) => {
    const saved = savedFilters[filterName];
    if (saved) {
      onFiltersChange(saved);
    }
  };

  const getFilterBadgeLabel = (filter: ActiveFilter): string => {
    if (filter.values && filter.values.length > 0) {
      return `${filter.label}: ${filter.values.length}`;
    }
    if (filter.dateRange?.from) {
      const from = filter.dateRange.from.toLocaleDateString('pt-BR');
      const to = filter.dateRange.to?.toLocaleDateString('pt-BR') || from;
      return `${filter.label}: ${from} - ${to}`;
    }
    return filter.label;
  };

  const isFilterActive = (filterKey: string): boolean => {
    return activeFilters.some((f) => f.key === filterKey);
  };

  return (
    <div className="space-y-3">
      {/* Barra de filtros ativos */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
            isOpen || activeFilters.length > 0
              ? 'bg-accent/10 border-accent text-accent'
              : 'bg-surface border-default text-muted hover:border-accent hover:text-accent'
          }`}
        >
          <Filter size={16} />
          <span className="text-sm font-medium">Filtros</span>
          {activeFilters.length > 0 && (
            <span className="text-xs bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </button>

        {/* Badges de filtros ativos */}
        {activeFilters.map((filter) => (
          <div
            key={filter.key}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent text-accent text-sm"
          >
            <span>{getFilterBadgeLabel(filter)}</span>
            <button
              onClick={() => handleRemoveFilter(filter.key)}
              className="hover:bg-accent/20 rounded p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Botão limpar todos */}
        {activeFilters.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            Limpar todos
          </button>
        )}

        {/* Botão salvar filtros */}
        {showSaveButton && activeFilters.length > 0 && (
          <button
            onClick={handleSaveFilters}
            className="text-sm text-accent hover:text-accent/80 transition-colors ml-auto"
          >
            Salvar filtros
          </button>
        )}
      </div>

      {/* Painel de seleção de filtros */}
      {isOpen && (
        <div className="bg-surface border border-default rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-primary">{filter.label}</label>
                  {isFilterActive(filter.key) && (
                    <Check size={16} className="text-accent" />
                  )}
                </div>

                {filter.type === 'multi-select' && filter.options && (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {filter.options.map((option) => {
                      const activeFilter = activeFilters.find((f) => f.key === filter.key);
                      const isChecked = activeFilter?.values?.includes(option.value) || false;

                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-alt cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              handleMultiSelectChange(filter.key, option.value, e.target.checked)
                            }
                            className="rounded border-default text-accent focus:ring-accent focus:ring-offset-0"
                          />
                          <span className="text-sm text-primary flex-1">{option.label}</span>
                          {option.color && (
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: option.color }}
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}

                {filter.type === 'date-range' && (
                  <div className="pt-2">
                    <DatePickerWithRange
                      value={activeFilters.find((f) => f.key === filter.key)?.dateRange}
                      onChange={(range) => handleDateRangeChange(filter.key, range)}
                    />
                  </div>
                )}

                {filter.type === 'single-select' && filter.options && (
                  <select
                    value={activeFilters.find((f) => f.key === filter.key)?.values?.[0] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        handleMultiSelectChange(filter.key, value, true);
                      } else {
                        handleRemoveFilter(filter.key);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-default text-primary text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          {/* Filtros salvos */}
          {storageKey && Object.keys(savedFilters).length > 0 && (
            <div className="pt-4 border-t border-default">
              <h4 className="text-sm font-medium text-primary mb-2">Filtros salvos:</h4>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(savedFilters).map((filterName) => (
                  <button
                    key={filterName}
                    onClick={() => handleLoadSavedFilter(filterName)}
                    className="px-3 py-1.5 rounded-lg bg-surface-alt border border-default text-sm text-primary hover:border-accent hover:text-accent transition-colors"
                  >
                    {filterName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
