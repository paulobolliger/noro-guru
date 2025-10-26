// components/ui/use-toast.tsx

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

// =======================================================================
// 1. Definições de Tipos e Lógica de Estado
//    (Implementação do sistema de notificação como um singleton hook)
// =======================================================================

const TOAST_LIMIT = 3;
const TOAST_DURATION = 5000;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastAction;
  variant: 'default' | 'destructive' | 'success' | 'info';
  duration?: number;
};

type ToastAction = {
  label: string;
  onClick: () => void;
};

type State = {
  toasts: Toast[];
};

const initialState: State = {
  toasts: [],
};

type Action =
  | {
      type: 'ADD_TOAST';
      toast: Omit<Toast, 'id' | 'duration'> & {
        id?: string;
        duration?: number;
      };
    }
  | {
      type: 'DISMISS_TOAST';
      toastId?: string;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [
          {
            id: action.toast.id || genId(),
            ...action.toast,
          } as Toast,
          ...state.toasts.slice(0, TOAST_LIMIT - 1),
        ],
      };

    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };

    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let state = initialState;

function dispatch(action: Action) {
  state = reducer(state, action);
  listeners.forEach((listener) => listener(state));
}

function toast(
  props: Omit<Toast, 'id' | 'duration'> & {
    id?: string;
    duration?: number;
  }
) {
  dispatch({
    type: 'ADD_TOAST',
    toast: props,
  });
}

function dismiss(toastId?: string) {
  dispatch({ type: 'DISMISS_TOAST', toastId });
}

export function useToast() {
  const [localState, setLocalState] = React.useState(state);

  React.useEffect(() => {
    listeners.push(setLocalState);
    return () => {
      listeners.splice(listeners.indexOf(setLocalState), 1);
    };
  }, [localState]);

  return {
    ...localState,
    toast,
    dismiss,
  };
}

// =======================================================================
// 2. Componentes de UI (Toast, ToastViewport, Toaster)
//    (Permite renderizar os toasts e utiliza o hook acima)
// =======================================================================

const iconMap: Record<Toast['variant'], React.ReactNode> = {
    default: <Info size={18} />,
    destructive: <AlertCircle size={18} />,
    success: <CheckCircle2 size={18} />,
    info: <Info size={18} />,
};

const variantClasses: Record<Toast['variant'], string> = {
    default: 'border-gray-200 bg-white text-gray-900',
    destructive: 'border-red-500 bg-red-600 text-white',
    success: 'border-green-500 bg-green-600 text-white',
    info: 'border-blue-500 bg-blue-600 text-white',
};

const titleClasses: Record<Toast['variant'], string> = {
    default: 'text-gray-900',
    destructive: 'text-white',
    success: 'text-white',
    info: 'text-white',
};

const descriptionClasses: Record<Toast['variant'], string> = {
    default: 'text-gray-600',
    destructive: 'text-white/80',
    success: 'text-white/80',
    info: 'text-white/80',
};

type ToastProps = Toast & {
  onDismiss: (id: string) => void;
};

const ToastComponent = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, action, variant = 'default', duration, onDismiss, ...props }, ref) => {
    const [open, setOpen] = React.useState(true);
    const timerRef = React.useRef<number | null>(null);

    const handleDismiss = React.useCallback(() => {
      setOpen(false);
      setTimeout(() => onDismiss(id), 150); // Tempo para animação de saída
    }, [id, onDismiss]);

    React.useEffect(() => {
      if (duration !== 0) {
        timerRef.current = window.setTimeout(handleDismiss, duration || TOAST_DURATION);
      }

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [duration, handleDismiss]);

    const Icon = iconMap[variant] || iconMap.default;

    return (
      <div
        ref={ref}
        className={cn(
          'min-w-[300px] p-4 rounded-lg shadow-lg flex items-start space-x-3 mt-4 transition-all duration-150',
          variantClasses[variant]
        )}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
        }}
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5">
            {Icon}
        </div>
        <div className="flex-1">
          {title && <div className={cn('font-semibold', titleClasses[variant])}>{title}</div>}
          {description && <div className={cn('text-sm', descriptionClasses[variant])}>{description}</div>}
        </div>

        <button
            onClick={handleDismiss}
            className={cn(
                'flex-shrink-0 p-1 rounded-md transition-colors ml-auto mt-0.5',
                variant === 'default' ? 'text-gray-400 hover:text-gray-800 hover:bg-gray-50' : 'text-white/80 hover:text-white hover:bg-white/10'
            )}
        >
            <X size={16} />
        </button>
      </div>
    );
  }
);
ToastComponent.displayName = 'Toast';

// Onde os Toasts serão renderizados no DOM
const ToastViewport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Posição: Canto inferior direito (padrão desktop)
        'fixed top-0 right-0 z-[100] flex flex-col-reverse p-4 sm:top-auto sm:bottom-0 sm:right-0 sm:flex-col md:max-w-[420px]',
        className
      )}
      {...props}
    />
  )
);
ToastViewport.displayName = 'ToastViewport';

// =======================================================================
// 3. O COMPONENTE PRINCIPAL (Para o RootLayout)
// =======================================================================

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastViewport>
      {toasts.map((toast) => {
        const { id, title, description, action, variant, duration } = toast;
        return (
          <ToastComponent
            key={id}
            id={id}
            title={title}
            description={description}
            action={action}
            variant={variant}
            duration={duration}
            onDismiss={dismiss}
          />
        );
      })}
    </ToastViewport>
  );
}

// Exports principais para o sistema funcionar
export { ToastComponent as Toast, type ToastProps };