/**
 * ListItem Component
 *
 * Componente de item de lista consistente e reutilizável.
 * Ideal para listas verticais, feeds, históricos e mobile-friendly alternatives a tabelas.
 *
 * @example
 * ```tsx
 * <ListItem
 *   title="João da Silva"
 *   subtitle="joao@email.com"
 *   avatar={<Avatar src={user.photo} />}
 *   badge={<Badge variant="success">Ativo</Badge>}
 *   actions={[
 *     { label: 'Editar', onClick: handleEdit },
 *     { label: 'Deletar', onClick: handleDelete, destructive: true },
 *   ]}
 *   onClick={() => router.push(`/users/${user.id}`)}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, MoreVertical } from 'lucide-react';

export interface ListItemAction {
  /**
   * Label da ação
   */
  label: string;

  /**
   * Ícone (opcional)
   */
  icon?: React.ReactNode;

  /**
   * Handler do clique
   */
  onClick: () => void;

  /**
   * Se true, estilo destrutivo
   */
  destructive?: boolean;
}

export interface ListItemProps {
  /**
   * Título principal
   */
  title: string | React.ReactNode;

  /**
   * Subtítulo/descrição
   */
  subtitle?: string | React.ReactNode;

  /**
   * Terceira linha de texto (meta info)
   */
  meta?: string | React.ReactNode;

  /**
   * Avatar/ícone à esquerda
   */
  avatar?: React.ReactNode;

  /**
   * Conteúdo à direita (badge, status, etc)
   */
  badge?: React.ReactNode;

  /**
   * Ações (menu de 3 pontos)
   */
  actions?: ListItemAction[];

  /**
   * Callback quando item é clicado
   */
  onClick?: () => void;

  /**
   * Se true, mostra seta à direita (indica navegação)
   */
  showChevron?: boolean;

  /**
   * Se true, item está selecionado
   */
  selected?: boolean;

  /**
   * Se true, item está desabilitado
   */
  disabled?: boolean;

  /**
   * Checkbox (se fornecido, mostra checkbox)
   */
  checkbox?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  };

  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Variante de tamanho
   */
  size?: 'sm' | 'md' | 'lg';
}

export function ListItem({
  title,
  subtitle,
  meta,
  avatar,
  badge,
  actions,
  onClick,
  showChevron,
  selected = false,
  disabled = false,
  checkbox,
  className,
  size = 'md',
}: ListItemProps) {
  const [showActionMenu, setShowActionMenu] = React.useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const avatarSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b border-gray-200 bg-white transition-colors',
        onClick && !disabled && 'cursor-pointer hover:bg-gray-50',
        selected && 'bg-primary-50 border-primary-200',
        disabled && 'opacity-60 cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      onClick={() => !disabled && onClick?.()}
    >
      {/* Checkbox */}
      {checkbox && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            checkbox.onChange(!checkbox.checked);
          }}
        >
          <input
            type="checkbox"
            checked={checkbox.checked}
            onChange={() => {}} // Controlled pelo onClick do wrapper
            disabled={disabled}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            aria-label="Selecionar item"
          />
        </div>
      )}

      {/* Avatar */}
      {avatar && (
        <div
          className={cn(
            'flex-shrink-0 rounded-full overflow-hidden bg-gray-200',
            avatarSizes[size]
          )}
        >
          {avatar}
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 min-w-0">
        {/* Título */}
        <div className="flex items-center gap-2">
          {typeof title === 'string' ? (
            <h4
              className={cn(
                'font-semibold text-gray-900 truncate',
                size === 'sm' && 'text-sm',
                size === 'md' && 'text-base',
                size === 'lg' && 'text-lg'
              )}
            >
              {title}
            </h4>
          ) : (
            title
          )}
        </div>

        {/* Subtítulo */}
        {subtitle && (
          <div className="mt-0.5">
            {typeof subtitle === 'string' ? (
              <p
                className={cn(
                  'text-gray-600 truncate',
                  size === 'sm' && 'text-xs',
                  size === 'md' && 'text-sm',
                  size === 'lg' && 'text-base'
                )}
              >
                {subtitle}
              </p>
            ) : (
              subtitle
            )}
          </div>
        )}

        {/* Meta */}
        {meta && (
          <div className="mt-1">
            {typeof meta === 'string' ? (
              <p className="text-xs text-gray-500">{meta}</p>
            ) : (
              meta
            )}
          </div>
        )}
      </div>

      {/* Badge */}
      {badge && <div className="flex-shrink-0">{badge}</div>}

      {/* Ações */}
      {actions && actions.length > 0 && (
        <div className="flex-shrink-0 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActionMenu(!showActionMenu);
            }}
            disabled={disabled}
            className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 transition-colors disabled:hover:bg-transparent"
            aria-label="Menu de ações"
            aria-expanded={showActionMenu}
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>

          {showActionMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionMenu(false);
                }}
              />

              {/* Menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                      setShowActionMenu(false);
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
      )}

      {/* Chevron */}
      {showChevron && (
        <div className="flex-shrink-0">
          <ChevronRight size={20} className="text-gray-400" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

/**
 * ListGroup - Container para agrupar ListItems
 */
export interface ListGroupProps {
  /**
   * Título do grupo
   */
  title?: string;

  /**
   * Ações do grupo (ex: "Ver todos")
   */
  action?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Children (ListItems)
   */
  children: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Se true, adiciona borda e arredondamento
   */
  bordered?: boolean;
}

export function ListGroup({
  title,
  action,
  children,
  className,
  bordered = false,
}: ListGroupProps) {
  return (
    <div
      className={cn(
        bordered && 'border border-gray-200 rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Header */}
      {(title || action) && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          {title && (
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      )}

      {/* Items */}
      <div>{children}</div>
    </div>
  );
}

/**
 * SimpleListItem - Variante simplificada
 */
export interface SimpleListItemProps {
  /**
   * Texto principal
   */
  children: React.ReactNode;

  /**
   * Ícone à esquerda
   */
  icon?: React.ReactNode;

  /**
   * Callback de clique
   */
  onClick?: () => void;

  /**
   * Se true, item está ativo/selecionado
   */
  active?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function SimpleListItem({
  children,
  icon,
  onClick,
  active = false,
  className,
}: SimpleListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 transition-colors',
        onClick && 'cursor-pointer hover:bg-gray-50',
        active && 'bg-primary-50 text-primary-700 font-medium',
        className
      )}
      onClick={onClick}
    >
      {icon && <div className="flex-shrink-0 text-gray-600">{icon}</div>}
      <div className="flex-1 text-sm text-gray-900">{children}</div>
    </div>
  );
}

/**
 * CompactListItem - Variante compacta para listas densas
 */
export interface CompactListItemProps {
  /**
   * Label principal
   */
  label: string;

  /**
   * Valor à direita
   */
  value: string | React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function CompactListItem({ label, value, className }: CompactListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-2 border-b border-gray-200 last:border-b-0',
        className
      )}
    >
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
