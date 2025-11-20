import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        
        {/* Image Gallery Skeleton */}
        <div className="lg:col-span-3 flex flex-col">
          <Skeleton className="aspect-square w-full rounded-lg shadow-lg mb-6" />
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-2">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
          </div>
        </div>
        
        {/* Product Info Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-12 w-3/4 rounded" />
          <div className="space-y-3 pb-6 border-b">
            <Skeleton className="h-10 w-1/2 rounded" />
            <Skeleton className="h-6 w-1/3 rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
          </div>
          <div className="space-y-3">
             <Skeleton className="h-6 w-32 rounded" />
             <Skeleton className="h-12 w-40 rounded-lg" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
        </div>
        
      </div>
    </div>
  );
};