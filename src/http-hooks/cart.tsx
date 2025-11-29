import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    Cart,
} from '@/services/cart'; // Adjust path as needed
import { toast } from 'sonner'; // Or your toast library
import { useAuth } from "@/http-hooks/auth";

export const useGetCart = () => {
    const { isAuthenticated } = useAuth();
    return useQuery<Cart, Error>({
        queryKey: ['cart'], // The main key for cart data
        queryFn: getCart,
        enabled: !!isAuthenticated,
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Cart,
        Error,
        { productId: string; quantity?: number }
    >({
        mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(['cart'], updatedCart);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success("Item added to cart!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to add item.");
        },
    });
};

/**
 * Hook to update the quantity of an item in the cart.
 */
export const useUpdateCartItemQuantity = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Cart,
        Error,
        { productId: string; quantity: number }
    >({
        mutationFn: ({ productId, quantity }) => updateCartItemQuantity(productId, quantity),
        onSuccess: (updatedCart) => {
            // FIX: Update the correct query key
            queryClient.setQueryData(['cart'], updatedCart);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success("Cart updated.");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update quantity.");
        },
    });
};

/**
 * Hook to remove an item from the cart.
 */
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Cart,
        Error,
        string // Input is productId
    >({
        mutationFn: (productId) => removeFromCart(productId),
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(['cart'], updatedCart);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success("Item removed from cart.");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to remove item.");
        },
    });
};

/**
 * Hook to clear all items from the cart.
 */
export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation<Cart, Error, void>({
        mutationFn: clearCart,
        onSuccess: (updatedCart) => {
            queryClient.setQueryData(['cart'], updatedCart);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success("Cart cleared.");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to clear cart.");
        },
    });
};