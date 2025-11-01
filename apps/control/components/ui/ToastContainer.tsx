// components/ui/ToastContainer.tsx
'use client';

import { useEffect } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore, Toast, ToastType } from '@/stores/toastStore';

const icons: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors: Record<ToastType, string> = {
  success: 'bg-green-500/10 border-green-500/20 text-green-400',
  error: 'bg-red-500/10 border-red-500/20 text-red-400',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
};

const iconColors: Record<ToastType, string> = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((state) => state.removeToast);
  const Icon = icons[toast.type];

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
        animate-in slide-in-from-right duration-300
        ${colors[toast.type]}
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[toast.type]}`} />
      
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-primary">{toast.title}</div>
        {toast.message && (
          <div className="text-sm text-muted mt-1">{toast.message}</div>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="text-sm font-medium mt-2 hover:underline text-accent"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        className="text-muted hover:text-primary transition-colors flex-shrink-0"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  // Limitar a 5 toasts visíveis
  const visibleToasts = toasts.slice(-5);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
