/**
 * ConfirmDialog Component
 *
 * Dialog de confirmação para ações destrutivas ou importantes.
 * Construído em cima do Modal com UX otimizada para confirmações.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   onConfirm={handleDelete}
 *   title="Deletar cliente?"
 *   description="Esta ação não pode ser desfeita."
 *   variant="danger"
 *   confirmText="Deletar"
 *   cancelText="Cancelar"
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { Modal } from './modal';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Loader2 } from 'lucide-react';

export type ConfirmVariant = 'default' | 'danger' | 'warning' | 'success';

export interface ConfirmDialogProps {
  /**
   * Se o dialog está aberto
   */
  isOpen: boolean;

  /**
   * Callback quando dialog fecha
   */
  onClose: () => void;

  /**
   * Callback quando usuário confirma
   */
  onConfirm: () => void | Promise<void>;

  /**
   * Título do dialog
   */
  title: string;

  /**
   * Descrição/mensagem
   */
  description?: string;

  /**
   * Conteúdo customizado (substitui description)
   */
  children?: React.ReactNode;

  /**
   * Variante (define cores e ícone)
   */
  variant?: ConfirmVariant;

  /**
   * Texto do botão de confirmar
   */
  confirmText?: string;

  /**
   * Texto do botão de cancelar
   */
  cancelText?: string;

  /**
   * Se true, o usuário precisa digitar para confirmar
   * Útil para ações muito destrutivas
   */
  requiresConfirmation?: boolean;

  /**
   * Texto que o usuário precisa digitar para confirmar
   * Default: "confirmar"
   */
  confirmationText?: string;

  /**
   * Se true, mostra loading no botão de confirmar
   */
  loading?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  children,
  variant = 'default',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  requiresConfirmation = false,
  confirmationText = 'confirmar',
  loading = false,
  className,
}: ConfirmDialogProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [confirmInput, setConfirmInput] = React.useState('');

  // Reset input quando fecha
  React.useEffect(() => {
    if (!isOpen) {
      setConfirmInput('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    // Validação do input de confirmação
    if (requiresConfirmation && confirmInput !== confirmationText) {
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Erro ao confirmar:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = loading || isProcessing;
  const canConfirm = !requiresConfirmation || confirmInput === confirmationText;

  // Ícones por variante
  const icons = {
    default: <Info size={24} className="text-blue-600" />,
    danger: <AlertCircle size={24} className="text-red-600" />,
    warning: <AlertTriangle size={24} className="text-yellow-600" />,
    success: <CheckCircle2 size={24} className="text-green-600" />,
  };

  // Classes do botão de confirmar por variante
  const confirmButtonClasses = {
    default: 'bg-primary-600 hover:bg-primary-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      disableBackdropClick={isLoading}
      disableEscapeKey={isLoading}
      hideCloseButton={isLoading}
      className={className}
    >
      <div className="space-y-4">
        {/* Ícone + Título */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
            {icons[variant]}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            )}
          </div>
        </div>

        {/* Conteúdo customizado */}
        {children && <div className="text-sm text-gray-600">{children}</div>}

        {/* Input de confirmação */}
        {requiresConfirmation && (
          <div className="space-y-2">
            <label
              htmlFor="confirm-input"
              className="block text-sm font-medium text-gray-700"
            >
              Digite <span className="font-semibold">"{confirmationText}"</span> para
              confirmar:
            </label>
            <input
              id="confirm-input"
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={confirmationText}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoComplete="off"
            />
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLoading || !canConfirm}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              confirmButtonClasses[variant]
            )}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/**
 * useConfirmDialog - Hook para gerenciar ConfirmDialog
 */
export interface UseConfirmDialogOptions {
  /**
   * Título padrão
   */
  title?: string;

  /**
   * Descrição padrão
   */
  description?: string;

  /**
   * Variante padrão
   */
  variant?: ConfirmVariant;

  /**
   * Callback de confirmação
   */
  onConfirm?: () => void | Promise<void>;
}

export function useConfirmDialog(options: UseConfirmDialogOptions = {}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<UseConfirmDialogOptions>(options);

  const open = React.useCallback((customConfig?: Partial<UseConfirmDialogOptions>) => {
    setConfig((prev) => ({ ...prev, ...customConfig }));
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const confirm = React.useCallback(async () => {
    await config.onConfirm?.();
    close();
  }, [config, close]);

  return {
    isOpen,
    open,
    close,
    confirm,
    config,
  };
}

/**
 * DeleteConfirmDialog - Variante específica para deleção
 */
export interface DeleteConfirmDialogProps {
  /**
   * Se está aberto
   */
  isOpen: boolean;

  /**
   * Callback de fechar
   */
  onClose: () => void;

  /**
   * Callback de deletar
   */
  onDelete: () => void | Promise<void>;

  /**
   * Nome do item sendo deletado
   */
  itemName?: string;

  /**
   * Tipo do item (ex: "cliente", "lead", "pedido")
   */
  itemType?: string;

  /**
   * Se true, requer digitação para confirmar
   */
  requiresConfirmation?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onDelete,
  itemName,
  itemType = 'item',
  requiresConfirmation = false,
  loading = false,
}: DeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onDelete}
      variant="danger"
      title={`Deletar ${itemType}?`}
      description={
        itemName
          ? `Tem certeza que deseja deletar "${itemName}"? Esta ação não pode ser desfeita.`
          : `Tem certeza que deseja deletar este ${itemType}? Esta ação não pode ser desfeita.`
      }
      confirmText="Deletar"
      cancelText="Cancelar"
      requiresConfirmation={requiresConfirmation}
      confirmationText="deletar"
      loading={loading}
    />
  );
}

/**
 * DiscardChangesDialog - Dialog para descartar alterações não salvas
 */
export interface DiscardChangesDialogProps {
  /**
   * Se está aberto
   */
  isOpen: boolean;

  /**
   * Callback de fechar
   */
  onClose: () => void;

  /**
   * Callback de descartar
   */
  onDiscard: () => void;

  /**
   * Callback de salvar (opcional)
   */
  onSave?: () => void | Promise<void>;

  /**
   * Loading state
   */
  loading?: boolean;
}

export function DiscardChangesDialog({
  isOpen,
  onClose,
  onDiscard,
  onSave,
  loading = false,
}: DiscardChangesDialogProps) {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle size={24} className="text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Descartar alterações?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Você tem alterações não salvas. Deseja descartar essas alterações?
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading || isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continuar Editando
          </button>

          {onSave && (
            <button
              onClick={handleSave}
              disabled={loading || isSaving}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              Salvar
            </button>
          )}

          <button
            onClick={() => {
              onDiscard();
              onClose();
            }}
            disabled={loading || isSaving}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Descartar
          </button>
        </div>
      </div>
    </Modal>
  );
}
