/**
 * Combobox Component
 *
 * Componente de seleção com busca/autocomplete, navegação por teclado e acessibilidade.
 * Segue o padrão ARIA Combobox para máxima acessibilidade.
 *
 * @example
 * ```tsx
 * <Combobox
 *   options={[
 *     { value: '1', label: 'Cliente A' },
 *     { value: '2', label: 'Cliente B' }
 *   ]}
 *   value={selectedValue}
 *   onChange={(value) => setSelectedValue(value)}
 *   placeholder="Buscar cliente..."
 *   searchable
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X, Search, Loader2, Plus } from 'lucide-react';

export interface ComboboxOption {
  /**
   * Valor da opção
   */
  value: string;

  /**
   * Label exibido
   */
  label: string;

  /**
   * Descrição opcional
   */
  description?: string;

  /**
   * Se true, opção está desabilitada
   */
  disabled?: boolean;

  /**
   * Ícone customizado
   */
  icon?: React.ReactNode;

  /**
   * Metadados adicionais
   */
  meta?: Record<string, any>;
}

export interface ComboboxProps {
  /**
   * Opções disponíveis
   */
  options: ComboboxOption[];

  /**
   * Valor selecionado
   */
  value?: string;

  /**
   * Callback quando valor muda
   */
  onChange?: (value: string) => void;

  /**
   * Placeholder
   */
  placeholder?: string;

  /**
   * Label
   */
  label?: string;

  /**
   * Erro
   */
  error?: string;

  /**
   * Se true, permite busca
   */
  searchable?: boolean;

  /**
   * Se true, permite criar nova opção
   */
  creatable?: boolean;

  /**
   * Callback para criar nova opção
   */
  onCreate?: (inputValue: string) => void | Promise<void>;

  /**
   * Se true, mostra loading
   */
  loading?: boolean;

  /**
   * Se true, desabilita
   */
  disabled?: boolean;

  /**
   * Se true, limpa seleção
   */
  clearable?: boolean;

  /**
   * Mensagem quando não há opções
   */
  emptyMessage?: string;

  /**
   * Se true, campo é obrigatório
   */
  required?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  label,
  error,
  searchable = true,
  creatable = false,
  onCreate,
  loading = false,
  disabled = false,
  clearable = false,
  emptyMessage = 'Nenhuma opção encontrada',
  required = false,
  className,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const [isCreating, setIsCreating] = React.useState(false);

  const comboboxRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxRef = React.useRef<HTMLUListElement>(null);

  // Filtra opções baseado na busca
  const filteredOptions = React.useMemo(() => {
    if (!search || !searchable) return options;
    const searchLower = search.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchLower) ||
        option.description?.toLowerCase().includes(searchLower)
    );
  }, [options, search, searchable]);

  // Opção selecionada
  const selectedOption = options.find((opt) => opt.value === value);

  // Fecha dropdown ao clicar fora
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Reset highlighted index quando filtro muda
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  // Scroll para opção highlighted
  React.useEffect(() => {
    if (!isOpen || !listboxRef.current) return;

    const highlightedElement = listboxRef.current.children[
      highlightedIndex
    ] as HTMLElement;
    if (highlightedElement) {
      highlightedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearch('');
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
    setSearch('');
  };

  const handleCreate = async () => {
    if (!search.trim() || !onCreate) return;

    setIsCreating(true);
    try {
      await onCreate(search.trim());
      setSearch('');
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao criar opção:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen && filteredOptions.length > 0) {
          const option = filteredOptions[highlightedIndex];
          if (option && !option.disabled) {
            handleSelect(option.value);
          }
        } else if (isOpen && creatable && search.trim() && onCreate) {
          handleCreate();
        } else {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        inputRef.current?.blur();
        break;

      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setSearch('');
        }
        break;
    }
  };

  return (
    <div className={cn('relative', className)} ref={comboboxRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input/Trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between gap-2 px-4 py-2 text-left',
            'border rounded-lg bg-white transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error
              ? 'border-red-500'
              : isOpen
              ? 'border-primary-500'
              : 'border-gray-300',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-50'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? 'combobox-label' : undefined}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedOption?.icon && (
              <span className="flex-shrink-0">{selectedOption.icon}</span>
            )}
            <span
              className={cn(
                'truncate',
                selectedOption ? 'text-gray-900' : 'text-gray-500'
              )}
            >
              {selectedOption?.label || placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {clearable && selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Limpar seleção"
              >
                <X size={14} className="text-gray-500" />
              </button>
            )}
            {loading ? (
              <Loader2 size={16} className="text-gray-400 animate-spin" />
            ) : (
              <ChevronsUpDown size={16} className="text-gray-400" />
            )}
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden flex flex-col">
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Options list */}
            <ul
              ref={listboxRef}
              role="listbox"
              className="overflow-y-auto flex-1"
              tabIndex={-1}
            >
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-gray-500">
                  {emptyMessage}
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                      option.value === value && 'bg-primary-50',
                      index === highlightedIndex &&
                        option.value !== value &&
                        'bg-gray-100',
                      option.disabled &&
                        'opacity-50 cursor-not-allowed bg-gray-50'
                    )}
                  >
                    {/* Icon */}
                    {option.icon && (
                      <span className="flex-shrink-0">{option.icon}</span>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-xs text-gray-600 truncate">
                          {option.description}
                        </p>
                      )}
                    </div>

                    {/* Check icon */}
                    {option.value === value && (
                      <Check size={16} className="text-primary-600 flex-shrink-0" />
                    )}
                  </li>
                ))
              )}

              {/* Create option */}
              {creatable && search.trim() && filteredOptions.length === 0 && (
                <li
                  role="option"
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-gray-100 transition-colors border-t border-gray-200"
                >
                  {isCreating ? (
                    <Loader2 size={16} className="text-gray-400 animate-spin" />
                  ) : (
                    <Plus size={16} className="text-primary-600" />
                  )}
                  <span className="text-sm text-gray-700">
                    Criar "<strong>{search}</strong>"
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * MultiCombobox - Seleção múltipla
 */
export interface MultiComboboxProps
  extends Omit<ComboboxProps, 'value' | 'onChange' | 'clearable'> {
  /**
   * Valores selecionados
   */
  value?: string[];

  /**
   * Callback quando valores mudam
   */
  onChange?: (values: string[]) => void;

  /**
   * Máximo de seleções
   */
  maxSelections?: number;
}

export function MultiCombobox({
  options,
  value = [],
  onChange,
  placeholder = 'Selecione...',
  label,
  error,
  searchable = true,
  loading = false,
  disabled = false,
  emptyMessage = 'Nenhuma opção encontrada',
  required = false,
  maxSelections,
  className,
}: MultiComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const comboboxRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxRef = React.useRef<HTMLUListElement>(null);

  const filteredOptions = React.useMemo(() => {
    if (!search || !searchable) return options;
    const searchLower = search.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchLower)
    );
  }, [options, search, searchable]);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  const handleToggle = (optionValue: string) => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      onChange?.(value.filter((v) => v !== optionValue));
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return;
      }
      onChange?.([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== optionValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen && filteredOptions.length > 0) {
          const option = filteredOptions[highlightedIndex];
          if (option && !option.disabled) {
            handleToggle(option.value);
          }
        } else {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        break;

      case 'Backspace':
        if (search === '' && value.length > 0) {
          onChange?.(value.slice(0, -1));
        }
        break;
    }
  };

  return (
    <div className={cn('relative', className)} ref={comboboxRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 text-left min-h-[42px]',
            'border rounded-lg bg-white transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error
              ? 'border-red-500'
              : isOpen
              ? 'border-primary-500'
              : 'border-gray-300',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-50'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-500 text-sm py-0.5">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-sm"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(option.value, e)}
                    className="hover:bg-primary-200 rounded transition-colors"
                    aria-label={`Remover ${option.label}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))
            )}
          </div>

          {loading ? (
            <Loader2 size={16} className="text-gray-400 animate-spin flex-shrink-0" />
          ) : (
            <ChevronsUpDown size={16} className="text-gray-400 flex-shrink-0" />
          )}
        </button>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden flex flex-col">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <ul ref={listboxRef} role="listbox" className="overflow-y-auto flex-1">
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-gray-500">
                  {emptyMessage}
                </li>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = value.includes(option.value);
                  const isMaxReached =
                    maxSelections !== undefined &&
                    value.length >= maxSelections &&
                    !isSelected;

                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() =>
                        !option.disabled && !isMaxReached && handleToggle(option.value)
                      }
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors',
                        isSelected && 'bg-primary-50',
                        index === highlightedIndex && !isSelected && 'bg-gray-100',
                        (option.disabled || isMaxReached) &&
                          'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {/* Checkbox visual */}
                      <div
                        className={cn(
                          'flex items-center justify-center w-4 h-4 border-2 rounded transition-colors',
                          isSelected
                            ? 'bg-primary-600 border-primary-600'
                            : 'border-gray-300'
                        )}
                      >
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>

                      {option.icon && (
                        <span className="flex-shrink-0">{option.icon}</span>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {option.label}
                        </p>
                        {option.description && (
                          <p className="text-xs text-gray-600 truncate">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>

            {maxSelections && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
                {value.length} / {maxSelections} selecionado(s)
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * AsyncCombobox - Combobox com carregamento assíncrono
 */
export interface AsyncComboboxProps
  extends Omit<ComboboxProps, 'options' | 'loading'> {
  /**
   * Função para buscar opções
   */
  loadOptions: (search: string) => Promise<ComboboxOption[]>;

  /**
   * Debounce em ms
   */
  debounce?: number;

  /**
   * Opções iniciais (cache)
   */
  defaultOptions?: ComboboxOption[];
}

export function AsyncCombobox({
  loadOptions,
  debounce = 300,
  defaultOptions = [],
  searchable = true,
  ...props
}: AsyncComboboxProps) {
  const [options, setOptions] = React.useState<ComboboxOption[]>(defaultOptions);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const debounceTimeout = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (!searchable || search === '') {
      setOptions(defaultOptions);
      return;
    }

    // Debounce da busca
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await loadOptions(search);
        setOptions(results);
      } catch (error) {
        console.error('Erro ao carregar opções:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, debounce);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search, loadOptions, debounce, searchable, defaultOptions]);

  return (
    <Combobox
      {...props}
      options={options}
      loading={loading}
      searchable={searchable}
    />
  );
}

/**
 * useCombobox - Hook para gerenciar estado do combobox
 */
export interface UseComboboxOptions {
  /**
   * Valor inicial
   */
  initialValue?: string;

  /**
   * Callback onChange
   */
  onChange?: (value: string) => void;
}

export function useCombobox(options: UseComboboxOptions = {}) {
  const { initialValue = '', onChange } = options;

  const [value, setValue] = React.useState(initialValue);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = React.useCallback(
    (newValue: string) => {
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  const clear = React.useCallback(() => {
    setValue('');
    onChange?.('');
  }, [onChange]);

  return {
    value,
    setValue: handleChange,
    clear,
    isOpen,
    setIsOpen,
  };
}
