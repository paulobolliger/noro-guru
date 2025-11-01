// components/ui/EnhancedToast.tsx
'use client';

import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
  error: 'bg-red-500/10 border-red-500/30 text-red-500',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
};

export function EnhancedToast({ type, title, description, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = icons[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <div
      className={`
        noro-card border-2 p-4 min-w-[320px] max-w-md
        ${colors[type]}
        transition-all duration-300
        ${isVisible ? 'animate-in slide-in-from-right' : 'animate-out slide-out-to-right opacity-0'}
      `}
    >
      <div className="flex gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-primary mb-1">{title}</h4>
          {description && <p className="text-sm text-secondary">{description}</p>}
        </div>
        <button
          onClick={handleClose}
          className="text-muted hover:text-primary transition-colors"
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Hook para usar o toast
export function useEnhancedToast() {
  const show = (props: Omit<ToastProps, 'onClose'>) => {
    // Implementação simplificada - você pode integrar com zustand ou context
    console.log('Toast:', props);
  };

  return {
    success: (title: string, description?: string) => show({ type: 'success', title, description }),
    error: (title: string, description?: string) => show({ type: 'error', title, description }),
    warning: (title: string, description?: string) => show({ type: 'warning', title, description }),
    info: (title: string, description?: string) => show({ type: 'info', title, description }),
  };
}
