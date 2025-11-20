import { Skeleton } from "@/components/ui/skeleton"; // Import your base skeleton component

export const CartSummarySkeleton = () => (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-28 opacity-75">
        {/* Title Placeholder */}
        <Skeleton className="h-8 w-3/5 mb-6 rounded" />

        {/* Summary Lines Placeholder */}
        <div className="space-y-4 mb-6">
            <div className="flex justify-between">
                <Skeleton className="h-5 w-1/4 rounded" />
                <Skeleton className="h-5 w-1/3 rounded" />
            </div>
            <div className="flex justify-between">
                <Skeleton className="h-5 w-1/3 rounded" />
                <Skeleton className="h-5 w-1/4 rounded" />
            </div>
            <div className="border-t border-border pt-4 mt-4">
                 <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/4 rounded" />
                    <Skeleton className="h-6 w-1/3 rounded" />
                 </div>
            </div>
        </div>

        {/* Button Placeholders */}
        <Skeleton className="h-12 w-full mb-3 rounded" />
        <Skeleton className="h-12 w-full rounded" />
    </div>
);