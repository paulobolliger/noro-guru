export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-[#2E2E3A]/50 rounded-2xl p-8 border border-[#2E2E3A]">
      <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-2/3 mb-6"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function PricingCardSkeleton() {
  return (
    <div className="animate-pulse bg-[#2E2E3A]/50 rounded-2xl p-8 border border-[#2E2E3A]">
      <div className="mb-6">
        <div className="h-8 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
      <div className="mb-6">
        <div className="h-12 bg-gray-700 rounded w-2/3"></div>
      </div>
      <div className="h-12 bg-gray-700 rounded w-full mb-6"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-5 h-5 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded flex-1"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl p-8 border-2 border-gray-200">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-5 h-5 bg-gray-300 rounded"></div>
        ))}
      </div>
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
      </div>
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B1220] animate-pulse">
      <div className="container mx-auto px-6 py-20">
        <div className="h-12 bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
        <div className="h-6 bg-gray-700 rounded w-2/3 mx-auto mb-12"></div>
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
