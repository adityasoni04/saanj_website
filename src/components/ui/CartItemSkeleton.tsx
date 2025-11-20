import { Skeleton } from "@/components/ui/skeleton"; // Import your base skeleton component

export const CartItemSkeleton = () => (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 opacity-75">
        {/* Image Placeholder */}
        <Skeleton className="w-full sm:w-32 h-32 rounded-lg flex-shrink-0" />

        {/* Details Placeholder */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
                <div className="flex justify-between items-start mb-1 sm:mb-2 gap-2">
                    {/* Product Name Placeholder */}
                    <Skeleton className="h-6 w-3/5 rounded" />
                    {/* Remove Button Placeholder */}
                    <Skeleton className="h-8 w-8 rounded shrink-0" />
                </div>
                {/* Category Placeholder */}
                <Skeleton className="h-4 w-1/4 rounded mt-1" />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-3 sm:mt-4">
                {/* Quantity Placeholder */}
                <Skeleton className="h-9 w-28 rounded-lg mb-3 sm:mb-0" />
                {/* Price Placeholder */}
                <Skeleton className="h-8 w-24 rounded shrink-0" />
            </div>
        </div>
    </div>
);