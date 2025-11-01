// components/ui/LoadingStates.tsx
'use client';

import { Loader2 } from 'lucide-react';

// Skeleton para cards
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`noro-card animate-pulse ${className}`}>
      <div className="h-4 w-24 bg-slate-300/20 rounded mb-3" />
      <div className="h-8 w-32 bg-slate-300/20 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-300/20 rounded" />
    </div>
  );
}

// Skeleton para tabelas
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 animate-pulse">
          <div className="h-4 w-1/4 bg-slate-300/20 rounded" />
          <div className="h-4 w-1/3 bg-slate-300/20 rounded" />
          <div className="h-4 w-1/5 bg-slate-300/20 rounded" />
          <div className="h-4 w-1/6 bg-slate-300/20 rounded" />
        </div>
      ))}
    </div>
  );
}

// Loading overlay para ações
export function LoadingOverlay({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="noro-card p-6 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm text-primary font-medium">{message}</p>
      </div>
    </div>
  );
}

// Spinner inline
export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return <Loader2 className={`${sizeClasses[size]} text-accent animate-spin ${className}`} />;
}

// Empty state
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: { 
  icon: any; 
  title: string; 
  description?: string; 
  action?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-300/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-heading mb-2">{title}</h3>
      {description && <p className="text-sm text-muted mb-6 max-w-md">{description}</p>}
      {action}
    </div>
  );
}

// Skeleton para KPIs
export function SkeletonKpi({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="noro-card">
          <div className="animate-pulse space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-300/20 rounded w-20" />
                <div className="h-8 bg-slate-300/20 rounded w-24" />
              </div>
              <div className="w-10 h-10 bg-slate-300/20 rounded-lg" />
            </div>
            <div className="h-3 bg-slate-300/20 rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

