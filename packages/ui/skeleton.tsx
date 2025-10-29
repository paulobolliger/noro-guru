import * as React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton shimmer ${className}`} />;
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl bg-[#0B1220] border border-white/5 p-4">
      <div className="mb-3 flex gap-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 w-24 rounded bg-white/5" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid grid-cols-5 gap-3">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-4 rounded bg-white/5" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function KpiSkeleton() {
  return (
    <div className="card-interactive p-5 skeleton shimmer">
      <div className="h-3 w-16 rounded bg-white/5" />
      <div className="h-8 w-24 rounded bg-white/5 mt-3" />
    </div>
  );
}

