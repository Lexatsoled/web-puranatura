

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-emerald-100 animate-pulse h-full flex flex-col">
    {/* Image placeholder */}
    <div className="bg-emerald-100/50 aspect-[4/3] w-full" />
    
    {/* Content placeholder */}
    <div className="p-5 space-y-4 flex-1">
      {/* Category tag */}
      <div className="h-4 bg-emerald-100/50 rounded w-1/3" />
      
      {/* Title */}
      <div className="h-6 bg-emerald-100/50 rounded w-3/4" />
      
      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
      </div>
      
      {/* Price and Button */}
      <div className="pt-4 flex items-center justify-between mt-auto">
        <div className="h-6 bg-emerald-100/50 rounded w-1/4" />
        <div className="h-10 bg-emerald-100/50 rounded w-1/3" />
      </div>
    </div>
  </div>
);

export const StoreSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {[...Array(8)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
