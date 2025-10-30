'use client';

import { forwardRef } from 'react';
import { cn } from '@/../../packages/lib/utils';
import { LucideIcon } from 'lucide-react';

const variantStyles = {
  default: 'bg-[var(--color-surface-alt)] text-primary',
  error: 'bg-red-100/10 text-red-400',
  success: 'bg-emerald-100/10 text-emerald-400',
  warning: 'bg-amber-100/10 text-amber-400',
  info: 'bg-blue-100/10 text-blue-400'
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantStyles;
  icon?: React.ReactNode;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', children, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex items-center gap-2 rounded-lg px-4 py-3',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <div className="text-sm">{children}</div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };