/**
 * Alert Component
 *
 * Componente de alerta para mensagens inline com diferentes variantes e ações.
 * Suporta ícones, dismissível, links e ações customizadas.
 *
 * @example
 * ```tsx
 * <Alert
 *   variant="success"
 *   title="Sucesso!"
 *   description="Cliente criado com sucesso"
 *   dismissible
 *   onDismiss={() => setShowAlert(false)}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertAction {
  /**
   * Label do botão/link
   */
  label: string;

  /**
   * Handler do clique
   */
  onClick: () => void;

  /**
   * Se true, renderiza como link ao invés de botão
   */
  asLink?: boolean;

  /**
   * Ícone opcional
   */
  icon?: React.ReactNode;
}

export interface AlertProps {
  /**
   * Variante do alerta
   */
  variant?: AlertVariant;

  /**
   * Título do alerta
   */
  title?: string;

  /**
   * Descrição/mensagem
   */
  description?: string | React.ReactNode;

  /**
   * Ícone customizado (substitui o padrão da variante)
   */
  icon?: React.ReactNode;

  /**
   * Se true, mostra botão de fechar
   */
  dismissible?: boolean;

  /**
   * Callback quando alerta é fechado
   */
  onDismiss?: () => void;

  /**
   * Ações (botões/links)
   */
  actions?: AlertAction[];

  /**
   * Children (conteúdo customizado)
   */
  children?: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function Alert({
  variant = 'info',
  title,
  description,
  icon,
  dismissible = false,
  onDismiss,
  actions,
  children,
  className,
}: AlertProps) {
  const [dismissed, setDismissed] = React.useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  // Ícones padrão por variante
  const defaultIcons = {
    info: <Info size={20} />,
    success: <CheckCircle2 size={20} />,
    warning: <AlertTriangle size={20} />,
    error: <AlertCircle size={20} />,
  };

  const displayIcon = icon || defaultIcons[variant];

  // Classes por variante
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border-red-200 text-red-900',
  };

  const iconClasses = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  const buttonClasses = {
    info: 'text-blue-700 hover:bg-blue-100',
    success: 'text-green-700 hover:bg-green-100',
    warning: 'text-yellow-700 hover:bg-yellow-100',
    error: 'text-red-700 hover:bg-red-100',
  };

  const linkClasses = {
    info: 'text-blue-700 hover:text-blue-800 underline',
    success: 'text-green-700 hover:text-green-800 underline',
    warning: 'text-yellow-700 hover:text-yellow-800 underline',
    error: 'text-red-700 hover:text-red-800 underline',
  };

  return (
    <div
      className={cn(
        'flex gap-3 p-4 border rounded-lg',
        variantClasses[variant],
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Ícone */}
      <div className={cn('flex-shrink-0 mt-0.5', iconClasses[variant])} aria-hidden="true">
        {displayIcon}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        {/* Título */}
        {title && (
          <h3 className="text-sm font-semibold mb-1">{title}</h3>
        )}

        {/* Descrição */}
        {description && (
          <div className="text-sm">
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        )}

        {/* Children customizados */}
        {children && <div className="text-sm mt-2">{children}</div>}

        {/* Ações */}
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {actions.map((action, index) => (
              action.asLink ? (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    'inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
                    linkClasses[variant]
                  )}
                >
                  {action.label}
                  {action.icon || <ExternalLink size={14} />}
                </button>
              ) : (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    buttonClasses[variant]
                  )}
                >
                  {action.icon}
                  {action.label}
                </button>
              )
            ))}
          </div>
        )}
      </div>

      {/* Botão de fechar */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={cn(
            'flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded transition-colors',
            buttonClasses[variant]
          )}
          aria-label="Fechar alerta"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/**
 * SimpleAlert - Variante compacta apenas com mensagem
 */
export interface SimpleAlertProps {
  /**
   * Variante
   */
  variant?: AlertVariant;

  /**
   * Mensagem
   */
  children: React.ReactNode;

  /**
   * Se true, mostra botão de fechar
   */
  dismissible?: boolean;

  /**
   * Callback quando fechar
   */
  onDismiss?: () => void;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function SimpleAlert({
  variant = 'info',
  children,
  dismissible = false,
  onDismiss,
  className,
}: SimpleAlertProps) {
  const [dismissed, setDismissed] = React.useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    error: 'bg-red-50 border-red-200 text-red-900',
  };

  const buttonClasses = {
    info: 'text-blue-700 hover:bg-blue-100',
    success: 'text-green-700 hover:bg-green-100',
    warning: 'text-yellow-700 hover:bg-yellow-100',
    error: 'text-red-700 hover:bg-red-100',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 border rounded-lg text-sm',
        variantClasses[variant],
        className
      )}
      role="alert"
    >
      <div className="flex-1">{children}</div>

      {dismissible && (
        <button
          onClick={handleDismiss}
          className={cn(
            'flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded transition-colors',
            buttonClasses[variant]
          )}
          aria-label="Fechar"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/**
 * AlertList - Container para múltiplos alertas empilhados
 */
export interface AlertListProps {
  /**
   * Alertas
   */
  children: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function AlertList({ children, className }: AlertListProps) {
  return (
    <div className={cn('space-y-3', className)} role="region" aria-label="Alertas">
      {children}
    </div>
  );
}

/**
 * InlineAlert - Variante inline para uso em forms
 */
export interface InlineAlertProps {
  /**
   * Variante
   */
  variant?: AlertVariant;

  /**
   * Mensagem
   */
  children: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function InlineAlert({
  variant = 'error',
  children,
  className,
}: InlineAlertProps) {
  const defaultIcons = {
    info: <Info size={16} />,
    success: <CheckCircle2 size={16} />,
    warning: <AlertTriangle size={16} />,
    error: <AlertCircle size={16} />,
  };

  const variantClasses = {
    info: 'text-blue-700 bg-blue-50',
    success: 'text-green-700 bg-green-50',
    warning: 'text-yellow-700 bg-yellow-50',
    error: 'text-red-700 bg-red-50',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-2 px-3 py-2 rounded-md text-sm',
        variantClasses[variant],
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
        {defaultIcons[variant]}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/**
 * BannerAlert - Alerta em formato de banner (full-width)
 */
export interface BannerAlertProps {
  /**
   * Variante
   */
  variant?: AlertVariant;

  /**
   * Mensagem
   */
  children: React.ReactNode;

  /**
   * Ação (botão/link)
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Se true, mostra botão de fechar
   */
  dismissible?: boolean;

  /**
   * Callback quando fechar
   */
  onDismiss?: () => void;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function BannerAlert({
  variant = 'info',
  children,
  action,
  dismissible = false,
  onDismiss,
  className,
}: BannerAlertProps) {
  const [dismissed, setDismissed] = React.useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  const variantClasses = {
    info: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-gray-900',
    error: 'bg-red-600 text-white',
  };

  const buttonClasses = {
    info: 'text-white hover:bg-blue-700',
    success: 'text-white hover:bg-green-700',
    warning: 'text-gray-900 hover:bg-yellow-600',
    error: 'text-white hover:bg-red-700',
  };

  return (
    <div
      className={cn('px-4 py-3', variantClasses[variant], className)}
      role="alert"
    >
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex-1 text-sm font-medium">{children}</div>

        <div className="flex items-center gap-3">
          {/* Ação */}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-semibold transition-colors',
                buttonClasses[variant]
              )}
            >
              {action.label}
            </button>
          )}

          {/* Fechar */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className={cn(
                'inline-flex items-center justify-center w-8 h-8 rounded transition-colors',
                buttonClasses[variant]
              )}
              aria-label="Fechar"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
