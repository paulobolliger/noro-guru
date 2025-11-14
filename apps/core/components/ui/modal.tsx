/**
 * Modal Component
 *
 * Componente de modal/dialog acessível com portal, backdrop, focus trap e animações.
 * Segue as melhores práticas de acessibilidade (ARIA).
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Editar Cliente"
 *   description="Atualize as informações do cliente"
 * >
 *   <form>...</form>
 * </Modal>
 * ```
 */

'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  /**
   * Se o modal está aberto
   */
  isOpen: boolean;

  /**
   * Callback quando modal deve fechar
   */
  onClose: () => void;

  /**
   * Título do modal
   */
  title?: string;

  /**
   * Descrição/subtítulo
   */
  description?: string;

  /**
   * Conteúdo do modal
   */
  children: React.ReactNode;

  /**
   * Footer customizado (botões de ação)
   */
  footer?: React.ReactNode;

  /**
   * Tamanho do modal
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Se true, não fecha ao clicar no backdrop
   */
  disableBackdropClick?: boolean;

  /**
   * Se true, não fecha ao pressionar ESC
   */
  disableEscapeKey?: boolean;

  /**
   * Se true, não mostra botão de fechar (X)
   */
  hideCloseButton?: boolean;

  /**
   * Classes CSS adicionais para o conteúdo
   */
  className?: string;

  /**
   * Classes CSS para o backdrop
   */
  backdropClassName?: string;

  /**
   * Callback após animação de abertura
   */
  onAfterOpen?: () => void;

  /**
   * Callback após animação de fechamento
   */
  onAfterClose?: () => void;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  disableBackdropClick = false,
  disableEscapeKey = false,
  hideCloseButton = false,
  className,
  backdropClassName,
  onAfterOpen,
  onAfterClose,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  // Client-side only rendering (para portal)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Animação de abertura/fechamento
  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Salva elemento ativo para restaurar depois
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Bloqueia scroll do body
      document.body.style.overflow = 'hidden';
      onAfterOpen?.();
    } else {
      // Restaura scroll do body
      document.body.style.overflow = '';
      // Restaura foco
      setTimeout(() => {
        previousActiveElement.current?.focus();
        setIsAnimating(false);
        onAfterClose?.();
      }, 200); // Tempo da animação
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, onAfterOpen, onAfterClose]);

  // ESC key handler
  React.useEffect(() => {
    if (!isOpen || disableEscapeKey) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, disableEscapeKey, onClose]);

  // Focus trap
  React.useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Foca primeiro elemento
    setTimeout(() => firstElement?.focus(), 0);

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  // Handler de click no backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableBackdropClick) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Classes de tamanho
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4',
  };

  if (!mounted || (!isOpen && !isAnimating)) return null;

  const modal = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200',
        isOpen ? 'opacity-100' : 'opacity-0',
        backdropClassName
      )}
      onClick={handleBackdropClick}
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-white rounded-xl shadow-2xl w-full transition-all duration-200',
          sizeClasses[size],
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || description || !hideCloseButton) && (
          <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex-1 pr-4">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-gray-900"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-sm text-gray-600"
                >
                  {description}
                </p>
              )}
            </div>

            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Fechar modal"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

/**
 * ModalHeader - Header customizado
 */
export interface ModalHeaderProps {
  /**
   * Título
   */
  title: string;

  /**
   * Descrição opcional
   */
  description?: string;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function ModalHeader({ title, description, className }: ModalHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
}

/**
 * ModalBody - Body customizado
 */
export interface ModalBodyProps {
  /**
   * Conteúdo
   */
  children: React.ReactNode;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

/**
 * ModalFooter - Footer customizado
 */
export interface ModalFooterProps {
  /**
   * Conteúdo (geralmente botões)
   */
  children: React.ReactNode;

  /**
   * Alinhamento
   */
  align?: 'left' | 'center' | 'right' | 'between';

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function ModalFooter({
  children,
  align = 'right',
  className,
}: ModalFooterProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50',
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * useModal - Hook para gerenciar estado do modal
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}

/**
 * DrawerModal - Variante de modal que desliza da lateral
 */
export interface DrawerModalProps extends Omit<ModalProps, 'size'> {
  /**
   * Lado de onde o drawer aparece
   */
  side?: 'left' | 'right';

  /**
   * Largura do drawer
   */
  width?: string;
}

export function DrawerModal({
  isOpen,
  onClose,
  side = 'right',
  width = 'max-w-md',
  className,
  children,
  ...props
}: DrawerModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const sideClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  const translateClasses = {
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
  };

  const drawer = (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Drawer */}
      <div
        className={cn(
          'absolute top-0 bottom-0 bg-white shadow-2xl transition-transform duration-300',
          'w-full',
          width,
          sideClasses[side],
          translateClasses[side],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
