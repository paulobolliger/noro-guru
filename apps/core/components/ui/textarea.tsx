/**
 * Textarea Component
 *
 * Componente de textarea aprimorado com:
 * - Estados de erro e disabled
 * - Auto-resize opcional
 * - Contador de caracteres
 * - Integração com FormField
 * - Acessibilidade completa
 *
 * @example
 * ```tsx
 * <Textarea
 *   name="descricao"
 *   placeholder="Digite a descrição..."
 *   rows={4}
 *   maxLength={500}
 *   showCharCount
 *   error={errors.descricao}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Se true, aplica estilos de erro
   */
  error?: boolean | string;

  /**
   * Variante do textarea
   */
  variant?: 'default' | 'outlined' | 'filled';

  /**
   * Se true, mostra contador de caracteres
   * Requer maxLength para funcionar
   */
  showCharCount?: boolean;

  /**
   * Se true, ajusta altura automaticamente conforme conteúdo
   */
  autoResize?: boolean;

  /**
   * Altura mínima em linhas (quando autoResize = true)
   */
  minRows?: number;

  /**
   * Altura máxima em linhas (quando autoResize = true)
   */
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      variant = 'default',
      showCharCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      maxLength,
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [charCount, setCharCount] = React.useState(0);

    // Combina refs (externo + interno)
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // Auto-resize logic
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);

        // Reset height para calcular scrollHeight correto
        textarea.style.height = 'auto';

        // Calcula nova altura
        const minHeight = minRows * lineHeight;
        const maxHeight = maxRows * lineHeight;
        const newHeight = Math.min(
          Math.max(textarea.scrollHeight, minHeight),
          maxHeight
        );

        textarea.style.height = `${newHeight}px`;
      }
    }, [value, autoResize, minRows, maxRows]);

    // Atualiza contador de caracteres
    React.useEffect(() => {
      if (showCharCount) {
        const count =
          typeof value === 'string'
            ? value.length
            : textareaRef.current?.value.length || 0;
        setCharCount(count);
      }
    }, [value, showCharCount]);

    // Handler de onChange
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (showCharCount) {
        setCharCount(e.target.value.length);
      }
    };

    // Classes base
    const baseClasses =
      'w-full rounded-lg border transition-colors placeholder:text-gray-400 resize-none';

    // Classes de variante
    const variantClasses = {
      default: 'border-gray-300 bg-white',
      outlined: 'border-2 border-gray-300 bg-transparent',
      filled: 'border-transparent bg-gray-100',
    };

    // Classes de padding e tamanho
    const sizeClasses = 'px-4 py-3 text-base';

    // Classes de estado
    const stateClasses = cn(
      // Focus state
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      // Error state
      hasError &&
        'border-red-500 focus:ring-red-500 bg-red-50 text-red-900 placeholder:text-red-300',
      // Disabled state
      disabled && 'bg-gray-100 cursor-not-allowed opacity-60',
      // Auto-resize
      autoResize && 'overflow-hidden'
    );

    return (
      <div className="relative">
        <textarea
          ref={textareaRef}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses,
            stateClasses,
            className
          )}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={hasError ? 'true' : 'false'}
          {...props}
        />

        {/* Contador de caracteres */}
        {showCharCount && maxLength && (
          <div
            className={cn(
              'absolute bottom-2 right-3 text-xs',
              charCount > maxLength * 0.9
                ? 'text-red-600 font-semibold'
                : 'text-gray-500'
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {charCount} / {maxLength}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };

/**
 * RichTextarea - Textarea com ferramentas de formatação básica
 * (Placeholder para futura implementação de rich text editor)
 */
export interface RichTextareaProps extends Omit<TextareaProps, 'autoResize'> {
  /**
   * Se true, mostra barra de ferramentas de formatação
   */
  showToolbar?: boolean;
}

export const RichTextarea = React.forwardRef<
  HTMLTextAreaElement,
  RichTextareaProps
>(({ showToolbar = false, ...props }, ref) => {
  // Por enquanto, apenas renderiza Textarea normal
  // TODO: Implementar toolbar com formatação Markdown
  return (
    <div className="space-y-2">
      {showToolbar && (
        <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
            title="Negrito"
            onClick={() => {
              // TODO: Implementar inserção de Markdown
              console.log('Negrito');
            }}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 3h8a4 4 0 010 8H3V3zm0 9h9a4 4 0 010 8H3v-8zm3 1v6h6a3 3 0 000-6H6zm0-9v6h5a3 3 0 000-6H6z" />
            </svg>
          </button>

          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
            title="Itálico"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8 3h8v2h-2.5l-3 10H13v2H5v-2h2.5l3-10H8V3z" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300" />

          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
            title="Lista"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4h2v2H3V4zm4 0h10v2H7V4zm0 5h10v2H7V9zm0 5h10v2H7v-2zM3 9h2v2H3V9zm0 5h2v2H3v-2z" />
            </svg>
          </button>

          <button
            type="button"
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
            title="Link"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
            </svg>
          </button>
        </div>
      )}

      <Textarea
        ref={ref}
        className={showToolbar ? 'rounded-t-none' : ''}
        {...props}
      />
    </div>
  );
});

RichTextarea.displayName = 'RichTextarea';

/**
 * CodeTextarea - Textarea otimizada para código
 */
export interface CodeTextareaProps extends TextareaProps {
  /**
   * Linguagem do código (para syntax highlighting futuro)
   */
  language?: string;

  /**
   * Se true, usa fonte monospace
   */
  monospace?: boolean;
}

export const CodeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CodeTextareaProps
>(({ language, monospace = true, className, ...props }, ref) => {
  return (
    <Textarea
      ref={ref}
      className={cn(monospace && 'font-mono text-sm', className)}
      spellCheck={false}
      {...props}
    />
  );
});

CodeTextarea.displayName = 'CodeTextarea';
