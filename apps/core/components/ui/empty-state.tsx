/**
 * EmptyState Component
 *
 * Componente para estados vazios em tabelas, listas e seções.
 * Fornece feedback visual quando não há dados para exibir.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<Inbox size={48} />}
 *   title="Nenhum lead encontrado"
 *   description="Comece criando seu primeiro lead"
 *   action={{
 *     label: "Criar Lead",
 *     onClick: () => router.push('/leads/novo')
 *   }}
 * />
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search, Inbox, AlertCircle, Database, FileX } from 'lucide-react';

export interface EmptyStateAction {
  /**
   * Texto do botão de ação
   */
  label: string;

  /**
   * Handler do clique
   */
  onClick: () => void;

  /**
   * Variante do botão
   */
  variant?: 'primary' | 'secondary';

  /**
   * Ícone opcional do botão
   */
  icon?: React.ReactNode;
}

export interface EmptyStateProps {
  /**
   * Ícone principal (componente Lucide)
   */
  icon?: React.ReactNode;

  /**
   * Título do estado vazio
   */
  title: string;

  /**
   * Descrição/instrução para o usuário
   */
  description?: string;

  /**
   * Ação primária (botão)
   */
  action?: EmptyStateAction;

  /**
   * Ação secundária (link/botão)
   */
  secondaryAction?: EmptyStateAction;

  /**
   * Variante visual
   */
  variant?: 'default' | 'search' | 'error' | 'no-data';

  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Se true, reduz espaçamento (para uso em cards)
   */
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  className,
  compact = false,
}: EmptyStateProps) {
  // Ícones padrão por variante
  const defaultIcons = {
    default: <Inbox size={48} />,
    search: <Search size={48} />,
    error: <AlertCircle size={48} />,
    'no-data': <Database size={48} />,
  };

  const displayIcon = icon || defaultIcons[variant];

  // Classes de cor por variante
  const variantClasses = {
    default: 'text-gray-400',
    search: 'text-blue-400',
    error: 'text-red-400',
    'no-data': 'text-gray-400',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8 px-4' : 'py-12 px-6',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Ícone */}
      <div
        className={cn(
          'mb-4',
          variantClasses[variant]
        )}
        aria-hidden="true"
      >
        {displayIcon}
      </div>

      {/* Título */}
      <h3
        className={cn(
          'font-semibold text-gray-900',
          compact ? 'text-lg' : 'text-xl mb-2'
        )}
      >
        {title}
      </h3>

      {/* Descrição */}
      {description && (
        <p
          className={cn(
            'text-gray-500 max-w-md',
            compact ? 'text-sm mb-4' : 'text-base mb-6'
          )}
        >
          {description}
        </p>
      )}

      {/* Ações */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {/* Ação Primária */}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                action.variant === 'secondary'
                  ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              )}
            >
              {action.icon}
              {action.label}
            </button>
          )}

          {/* Ação Secundária */}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {secondaryAction.icon}
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * EmptySearchResults - Variante específica para resultados de busca
 */
export interface EmptySearchResultsProps {
  /**
   * Termo de busca que não retornou resultados
   */
  searchTerm: string;

  /**
   * Callback para limpar a busca
   */
  onClearSearch?: () => void;

  /**
   * Sugestões de ação
   */
  suggestions?: string[];

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function EmptySearchResults({
  searchTerm,
  onClearSearch,
  suggestions,
  className,
}: EmptySearchResultsProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Ícone */}
      <div className="mb-4 text-blue-400" aria-hidden="true">
        <Search size={48} />
      </div>

      {/* Título */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Nenhum resultado encontrado
      </h3>

      {/* Descrição com termo */}
      <p className="text-base text-gray-500 mb-6 max-w-md">
        Não encontramos resultados para{' '}
        <span className="font-semibold text-gray-700">"{searchTerm}"</span>
      </p>

      {/* Sugestões */}
      {suggestions && suggestions.length > 0 && (
        <div className="mb-6 text-left">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Sugestões:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ação de limpar */}
      {onClearSearch && (
        <button
          onClick={onClearSearch}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          Limpar busca
        </button>
      )}
    </div>
  );
}

/**
 * EmptyTableState - Variante específica para tabelas vazias
 */
export interface EmptyTableStateProps {
  /**
   * Tipo de entidade (ex: "leads", "clientes")
   */
  entityName: string;

  /**
   * Nome singular da entidade (ex: "lead", "cliente")
   */
  entityNameSingular?: string;

  /**
   * Callback para criar novo item
   */
  onCreateNew?: () => void;

  /**
   * Ícone customizado
   */
  icon?: React.ReactNode;

  /**
   * Se true, mostra mensagem de filtros ativos
   */
  hasActiveFilters?: boolean;

  /**
   * Callback para limpar filtros
   */
  onClearFilters?: () => void;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function EmptyTableState({
  entityName,
  entityNameSingular,
  onCreateNew,
  icon,
  hasActiveFilters,
  onClearFilters,
  className,
}: EmptyTableStateProps) {
  const singular = entityNameSingular || entityName.slice(0, -1);

  if (hasActiveFilters) {
    return (
      <EmptyState
        variant="search"
        title={`Nenhum ${singular} encontrado`}
        description="Nenhum resultado corresponde aos filtros aplicados. Tente ajustar ou limpar os filtros."
        action={
          onClearFilters
            ? {
                label: 'Limpar Filtros',
                onClick: onClearFilters,
                variant: 'secondary',
              }
            : undefined
        }
        className={className}
      />
    );
  }

  return (
    <EmptyState
      icon={icon}
      variant="no-data"
      title={`Nenhum ${singular} cadastrado`}
      description={`Você ainda não tem nenhum ${singular}. Comece criando o primeiro!`}
      action={
        onCreateNew
          ? {
              label: `Criar ${singular.charAt(0).toUpperCase() + singular.slice(1)}`,
              onClick: onCreateNew,
            }
          : undefined
      }
      className={className}
    />
  );
}

/**
 * EmptyCard - Estado vazio para cards/seções
 */
export interface EmptyCardProps {
  /**
   * Ícone
   */
  icon?: React.ReactNode;

  /**
   * Título
   */
  title: string;

  /**
   * Descrição
   */
  description?: string;

  /**
   * Ação
   */
  action?: EmptyStateAction;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function EmptyCard({
  icon = <FileX size={32} />,
  title,
  description,
  action,
  className,
}: EmptyCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300',
        className
      )}
      role="status"
    >
      {/* Ícone */}
      <div className="mb-3 text-gray-400" aria-hidden="true">
        {icon}
      </div>

      {/* Título */}
      <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>

      {/* Descrição */}
      {description && (
        <p className="text-xs text-gray-500 mb-3">{description}</p>
      )}

      {/* Ação */}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * EmptyErrorState - Estado de erro
 */
export interface EmptyErrorStateProps {
  /**
   * Título do erro
   */
  title?: string;

  /**
   * Mensagem de erro
   */
  message?: string;

  /**
   * Callback para tentar novamente
   */
  onRetry?: () => void;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function EmptyErrorState({
  title = 'Algo deu errado',
  message = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
  className,
}: EmptyErrorStateProps) {
  return (
    <EmptyState
      variant="error"
      title={title}
      description={message}
      action={
        onRetry
          ? {
              label: 'Tentar Novamente',
              onClick: onRetry,
              variant: 'secondary',
            }
          : undefined
      }
      className={className}
    />
  );
}
