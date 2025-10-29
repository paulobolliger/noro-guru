// components/ui/badge.tsx
import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-md border border-white/10 bg-white/5 text-slate-300 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400/40 ${className}`}
      {...props}
    />
  );
}

export { Badge };
