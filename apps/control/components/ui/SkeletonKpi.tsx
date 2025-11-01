// components/ui/SkeletonKpi.tsx
'use client';

interface SkeletonKpiProps {
  count?: number;
}

export function SkeletonKpi({ count = 4 }: SkeletonKpiProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="noro-card">
          <div className="animate-pulse space-y-3">
            {/* Icon + Value */}
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-300/20 rounded w-20" />
                <div className="h-8 bg-slate-300/20 rounded w-24" />
              </div>
              <div className="w-10 h-10 bg-slate-300/20 rounded-lg" />
            </div>

            {/* Subtitle */}
            <div className="h-3 bg-slate-300/20 rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
