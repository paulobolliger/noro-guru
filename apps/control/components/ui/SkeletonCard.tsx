// components/ui/SkeletonCard.tsx
'use client';

interface SkeletonCardProps {
  lines?: number;
  hasHeader?: boolean;
}

export function SkeletonCard({ lines = 3, hasHeader = true }: SkeletonCardProps) {
  return (
    <div className="noro-card">
      <div className="animate-pulse space-y-4">
        {/* Header */}
        {hasHeader && (
          <div className="space-y-2">
            <div className="h-6 bg-slate-300/20 rounded w-1/3" />
            <div className="h-4 bg-slate-300/20 rounded w-2/3" />
          </div>
        )}

        {/* Lines */}
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-slate-300/20 rounded"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
