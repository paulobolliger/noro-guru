/**
 * FormField Component
 *
 * Wrapper component para campos de formulário com:
 * - Label consistente
 * - Error messages
 * - Help text
 * - Required indicator
 * - Acessibilidade completa
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Email"
 *   name="email"
 *   required
 *   error={errors.email}
 *   help="Usaremos este email para contato"
 * >
 *   <Input type="email" name="email" />
 * </FormField>
 * ```
 */

import { AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  /**
   * Label do campo
   */
  label: string;

  /**
   * Nome do campo (usado para IDs e acessibilidade)
   */
  name: string;

  /**
   * Mensagem de erro (se houver)
   */
  error?: string;

  /**
   * Se true, marca o campo como obrigatório
   */
  required?: boolean;

  /**
   * Texto de ajuda que aparece abaixo do campo
   */
  help?: string;

  /**
   * Elemento do campo (Input, Textarea, Select, etc)
   */
  children: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Se true, oculta o label visualmente (mas mantém para screen readers)
   */
  srOnlyLabel?: boolean;
}

export function FormField({
  label,
  name,
  error,
  required,
  help,
  children,
  className,
  srOnlyLabel,
}: FormFieldProps) {
  const hasError = !!error;
  const helpTextId = `${name}-help`;
  const errorId = `${name}-error`;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <label
        htmlFor={name}
        className={cn(
          'block text-sm font-medium text-gray-700',
          srOnlyLabel && 'sr-only'
        )}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="obrigatório">
            *
          </span>
        )}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        {children}

        {/* Error Icon */}
        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <AlertCircle className="text-red-500" size={20} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Help Text (only shown if no error) */}
      {help && !hasError && (
        <p
          id={helpTextId}
          className="text-xs text-gray-500 flex items-start gap-1"
        >
          <Info size={14} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{help}</span>
        </p>
      )}

      {/* Error Message */}
      {hasError && (
        <p
          id={errorId}
          className="text-xs text-red-600 flex items-start gap-1"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/**
 * FormSection - Agrupa múltiplos campos relacionados
 */
export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * FormGrid - Layout de grid para formulários
 */
export interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FormGrid({ children, columns = 2, className }: FormGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
}

/**
 * FormActions - Container para botões de ação do formulário
 */
export interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function FormActions({
  children,
  align = 'right',
  className,
}: FormActionsProps) {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 pt-6 border-t border-gray-200',
        alignClass[align],
        className
      )}
    >
      {children}
    </div>
  );
}
