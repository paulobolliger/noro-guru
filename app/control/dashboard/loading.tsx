export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-72 bg-white/10 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-5 animate-pulse"
          >
            <div className="h-5 w-40 bg-white/10 rounded mb-3" />
            <div className="h-4 w-56 bg-white/10 rounded mb-4" />
            <div className="flex justify-between text-sm">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-4 w-20 bg-white/10 rounded" />
            </div>
            <div className="mt-3 h-3 w-40 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

