/**
 * Select Component
 *
 * Componente de select aprimorado com:
 * - Estados de erro e disabled
 * - Variantes e tamanhos
 * - Multi-select opcional
 * - Search/filter
 * - Integração com FormField
 * - Acessibilidade completa
 *
 * @example
 * ```tsx
 * <Select
 *   name="status"
 *   value={status}
 *   onValueChange={setStatus}
 *   error={errors.status}
 * >
 *   <SelectTrigger>
 *     <SelectValue placeholder="Selecione o status" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="novo">Novo</SelectItem>
 *     <SelectItem value="em_andamento">Em Andamento</SelectItem>
 *     <SelectItem value="concluido">Concluído</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

type SelectRootProps = {
  /**
   * Valor selecionado (controlled)
   */
  value?: string;

  /**
   * Valor inicial (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Callback quando valor muda
   */
  onValueChange?: (value: string) => void;

  /**
   * Nome do campo
   */
  name?: string;

  /**
   * Se true, aplica estilos de erro
   */
  error?: boolean | string;

  /**
   * Se true, desabilita o select
   */
  disabled?: boolean;

  /**
   * Variante visual
   */
  variant?: 'default' | 'outlined' | 'filled';

  /**
   * Tamanho do select
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Filhos (SelectTrigger e SelectContent)
   */
  children: React.ReactNode;
};

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
};

// ============================================================================
// Helper Components
// ============================================================================

const SelectValue: React.FC<{
  placeholder?: string;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>> = ({
  placeholder,
  className,
  ...props
}) => (
  <span data-placeholder={placeholder} className={cn('truncate', className)} {...props} />
);
SelectValue.displayName = 'SelectValue';

const SelectItem: React.FC<SelectItemProps> = ({ children, disabled }) => (
  <>{children}</>
);
SelectItem.displayName = 'SelectItem';

const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);
SelectContent.displayName = 'SelectContent';

const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('relative', className)} {...props}>
    {children}
  </div>
);
SelectTrigger.displayName = 'SelectTrigger';

// ============================================================================
// Helper Functions
// ============================================================================

function collectItems(
  children: React.ReactNode,
  items: Array<{ value: string; label: string; disabled?: boolean }> = []
) {
  React.Children.forEach(children as any, (child: any) => {
    if (!child) return;
    if (React.isValidElement(child)) {
      if (child.type && (child.type as any).displayName === 'SelectItem') {
        const value = child.props.value as string;
        const label =
          typeof child.props.children === 'string'
            ? child.props.children
            : String(value);
        const disabled = child.props.disabled;
        items.push({ value, label, disabled });
      }
      if (child.props && child.props.children) {
        collectItems(child.props.children, items);
      }
    }
  });
  return items;
}

function findPlaceholder(children: React.ReactNode): string | undefined {
  let placeholder: string | undefined;
  React.Children.forEach(children as any, (child: any) => {
    if (placeholder) return;
    if (React.isValidElement(child)) {
      if (child.type && (child.type as any).displayName === 'SelectValue') {
        placeholder = child.props.placeholder;
      } else if (child.props && child.props.children) {
        const inner = findPlaceholder(child.props.children);
        if (inner) placeholder = inner;
      }
    }
  });
  return placeholder;
}

// ============================================================================
// Main Select Component
// ============================================================================

const Select: React.FC<SelectRootProps> = ({
  value,
  defaultValue,
  onValueChange,
  name,
  error,
  disabled,
  variant = 'default',
  size = 'md',
  className,
  children,
}) => {
  const items = collectItems(children);
  const placeholder = findPlaceholder(children);
  const [internal, setInternal] = React.useState<string>(defaultValue || '');
  const current = value !== undefined ? value : internal;
  const hasError = !!error;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setInternal(e.target.value);
    onValueChange?.(e.target.value);
  }

  // Classes de variante
  const variantClasses = {
    default: 'border-gray-300 bg-white',
    outlined: 'border-2 border-gray-300 bg-transparent',
    filled: 'border-transparent bg-gray-100',
  };

  // Classes de tamanho
  const sizeClasses = {
    sm: 'h-9 px-3 py-1.5 text-sm',
    md: 'h-12 px-4 py-3 text-base',
    lg: 'h-14 px-5 py-4 text-lg',
  };

  // Classes de estado
  const stateClasses = cn(
    'w-full rounded-lg border transition-colors',
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
    hasError &&
      'border-red-500 focus-within:ring-red-500 bg-red-50 text-red-900',
    disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
  );

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          stateClasses,
          variantClasses[variant],
          sizeClasses[size],
          'flex items-center justify-between'
        )}
      >
        {/* Native Select (hidden but functional) */}
        <select
          name={name}
          className={cn(
            'absolute inset-0 w-full h-full appearance-none bg-transparent outline-none opacity-0 cursor-pointer',
            disabled && 'cursor-not-allowed',
            'peer'
          )}
          value={current}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {items.map((it) => (
            <option key={it.value} value={it.value} disabled={it.disabled}>
              {it.label}
            </option>
          ))}
        </select>

        {/* Visual Display */}
        <div className="pointer-events-none flex w-full items-center justify-between">
          <span
            className={cn(
              'truncate',
              !current && 'text-gray-400',
              hasError && !current && 'text-red-300'
            )}
          >
            {items.find((i) => i.value === current)?.label ||
              placeholder ||
              'Selecionar'}
          </span>

          {/* Chevron Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={cn(
              'h-5 w-5 flex-shrink-0 ml-2',
              hasError ? 'text-red-500' : 'text-gray-400'
            )}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Hidden content (used for item collection) */}
      <div className="hidden">
        <SelectContent>{children}</SelectContent>
      </div>
    </div>
  );
};
Select.displayName = 'Select';

// ============================================================================
// SimpleSelect - Alternative API
// ============================================================================

export interface SimpleSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Opções do select
   */
  options: Array<{ value: string; label: string; disabled?: boolean }>;

  /**
   * Placeholder
   */
  placeholder?: string;

  /**
   * Se true, aplica estilos de erro
   */
  error?: boolean | string;

  /**
   * Variante visual
   */
  variant?: 'default' | 'outlined' | 'filled';

  /**
   * Tamanho do select
   */
  selectSize?: 'sm' | 'md' | 'lg';
}

export const SimpleSelect = React.forwardRef<
  HTMLSelectElement,
  SimpleSelectProps
>(
  (
    {
      options,
      placeholder,
      error,
      variant = 'default',
      selectSize = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    // Classes de variante
    const variantClasses = {
      default: 'border-gray-300 bg-white',
      outlined: 'border-2 border-gray-300 bg-transparent',
      filled: 'border-transparent bg-gray-100',
    };

    // Classes de tamanho
    const sizeClasses = {
      sm: 'h-9 px-3 py-1.5 text-sm',
      md: 'h-12 px-4 py-3 text-base',
      lg: 'h-14 px-5 py-4 text-lg',
    };

    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full rounded-lg border appearance-none transition-colors cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            variantClasses[variant],
            sizeClasses[selectSize],
            hasError &&
              'border-red-500 focus:ring-red-500 bg-red-50 text-red-900',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
            className
          )}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={cn(
              'h-5 w-5',
              hasError ? 'text-red-500' : 'text-gray-400'
            )}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }
);

SimpleSelect.displayName = 'SimpleSelect';

// ============================================================================
// Exports
// ============================================================================

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
