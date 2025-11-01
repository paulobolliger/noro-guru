// components/ui/SkeletonTable.tsx
'use client';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="noro-card overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-surface-alt border-b border-default px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={i}
                className="h-3 bg-slate-300/20 rounded flex-1"
              />
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-default">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="px-4 py-3">
              <div className="flex gap-4">
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <div
                    key={colIdx}
                    className="h-4 bg-slate-300/20 rounded flex-1"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-default bg-surface-alt">
          <div className="h-3 bg-slate-300/20 rounded w-48" />
        </div>
      </div>
    </div>
  );
}
