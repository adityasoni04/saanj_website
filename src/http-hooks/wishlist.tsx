import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    Wishlist, // Import type from service
} from '@/services/wishlist'; // Adjust path as needed
import { useAuth } from '@/http-hooks/auth'; // Import auth hook
import { toast } from 'react-hot-toast'; // Or your toast library

/**
 * Hook to fetch the user's wishlist.
 * This query is only enabled if the user is authenticated.
 */
export const useGetWishlist = () => {
    const { isAuthenticated } = useAuth(); // Get user's auth status

    return useQuery<Wishlist, Error>({
        queryKey: ['wishlist'], // The global key for caching the user's wishlist
        queryFn: getWishlist,
        enabled: !!isAuthenticated, // Only run this query if the user is logged in
        staleTime: 1000 * 60 * 5, // Optional: 5 minutes stale time
    });
};

/**
 * Hook to add an item to the wishlist.
 */
export const useAddToWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Wishlist, // Return type on success
        Error,    // Error type
        string    // Input type (productId)
    >({
        mutationFn: (productId) => addToWishlist(productId),
        onSuccess: (updatedWishlist) => {
            // Instantly update the 'wishlist' cache with the new data
            queryClient.setQueryData(['wishlist'], updatedWishlist);
            toast.success("Added to wishlist!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add item to wishlist.");
        },
    });
};

/**
 * Hook to remove an item from the wishlist.
 */
export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Wishlist, // Return type on success
        Error,    // Error type
        string    // Input type (productId)
    >({
        mutationFn: (productId) => removeFromWishlist(productId),
        onSuccess: (updatedWishlist) => {
            // Instantly update the 'wishlist' cache
            queryClient.setQueryData(['wishlist'], updatedWishlist);
            toast.success("Removed from wishlist.");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to remove item from wishlist.");
        },
    });
};