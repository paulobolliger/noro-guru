/**
 * Input Component
 *
 * Componente de input aprimorado com:
 * - Estados de erro e disabled
 * - Suporte a ícones à esquerda e direita
 * - Tipos variados (text, email, password, number, etc)
 * - Integração com FormField
 * - Acessibilidade completa
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   name="email"
 *   placeholder="seu@email.com"
 *   error={errors.email}
 *   leftIcon={<Mail size={20} />}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Se true, aplica estilos de erro
   */
  error?: boolean | string;

  /**
   * Ícone à esquerda do input
   */
  leftIcon?: React.ReactNode;

  /**
   * Ícone à direita do input
   */
  rightIcon?: React.ReactNode;

  /**
   * Variante do input
   */
  variant?: 'default' | 'outlined' | 'filled';

  /**
   * Tamanho do input
   */
  size?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      error,
      leftIcon,
      rightIcon,
      variant = 'default',
      size = 'md',
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    // Classes base
    const baseClasses =
      'w-full rounded-lg border transition-colors placeholder:text-gray-400';

    // Classes de variante
    const variantClasses = {
      default: 'border-gray-300 bg-white',
      outlined: 'border-2 border-gray-300 bg-transparent',
      filled: 'border-transparent bg-gray-100',
    };

    // Classes de tamanho
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg',
    };

    // Ajuste de padding quando há ícones
    const paddingClasses = {
      left: {
        sm: 'pl-10',
        md: 'pl-11',
        lg: 'pl-12',
      },
      right: {
        sm: 'pr-10',
        md: 'pr-11',
        lg: 'pr-12',
      },
    };

    // Classes de estado
    const stateClasses = cn(
      // Focus state
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      // Error state
      hasError &&
        'border-red-500 focus:ring-red-500 bg-red-50 text-red-900 placeholder:text-red-300',
      // Disabled state
      disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
    );

    return (
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
              hasError && 'text-red-500',
              disabled && 'opacity-60'
            )}
            aria-hidden="true"
          >
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            leftIcon && paddingClasses.left[size],
            rightIcon && paddingClasses.right[size],
            stateClasses,
            className
          )}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400',
              hasError && 'text-red-500',
              disabled && 'opacity-60'
            )}
            aria-hidden="true"
          >
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

/**
 * InputGroup - Agrupa input com label e addon
 */
export interface InputGroupProps {
  /**
   * Label do grupo
   */
  label?: string;

  /**
   * Addon antes do input (ex: "R$", "@")
   */
  leftAddon?: string;

  /**
   * Addon depois do input (ex: ".com", "kg")
   */
  rightAddon?: string;

  /**
   * Input element
   */
  children: React.ReactNode;

  /**
   * Classes adicionais
   */
  className?: string;
}

export function InputGroup({
  label,
  leftAddon,
  rightAddon,
  children,
  className,
}: InputGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex">
        {/* Left Addon */}
        {leftAddon && (
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            {leftAddon}
          </span>
        )}

        {/* Input (clonado com classes ajustadas) */}
        <div className="flex-1">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                className: cn(
                  child.props.className,
                  leftAddon && 'rounded-l-none',
                  rightAddon && 'rounded-r-none'
                ),
              });
            }
            return child;
          })}
        </div>

        {/* Right Addon */}
        {rightAddon && (
          <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            {rightAddon}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * NumberInput - Input específico para números com increment/decrement
 */
export interface NumberInputProps
  extends Omit<InputProps, 'type' | 'leftIcon' | 'rightIcon'> {
  /**
   * Valor mínimo
   */
  min?: number;

  /**
   * Valor máximo
   */
  max?: number;

  /**
   * Incremento/decremento
   */
  step?: number;

  /**
   * Callback quando valor muda
   */
  onValueChange?: (value: number | null) => void;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ min, max, step = 1, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? null : parseFloat(e.target.value);
      onValueChange?.(value);
      onChange?.(e);
    };

    return (
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

/**
 * SearchInput - Input de busca com ícone e clear button
 */
export interface SearchInputProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  /**
   * Callback quando limpar
   */
  onClear?: () => void;

  /**
   * Mostra botão de limpar
   */
  showClearButton?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, value, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState(value || '');

    React.useEffect(() => {
      setInputValue(value || '');
    }, [value]);

    const handleClear = () => {
      setInputValue('');
      onClear?.();
    };

    return (
      <div className="relative">
        <Input
          type="search"
          leftIcon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          ref={ref}
          {...props}
        />

        {/* Clear Button */}
        {showClearButton && inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Limpar busca"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

/**
 * PasswordInput - Input de senha com toggle de visibilidade
 */
export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /**
   * Se true, mostra botão de toggle
   */
  showToggle?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ showToggle = true, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input type={showPassword ? 'text' : 'password'} ref={ref} {...props} />

      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
