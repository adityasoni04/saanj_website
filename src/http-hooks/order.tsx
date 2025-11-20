import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    requestExchange, // <-- 1. Import new function
    BackendOrder,
    UpdateOrderStatusInput,
    ManageExchangeInput,
    manageExchange,
    RequestExchangeInput
} from '@/services/order'; // Corrected path to orderService
import { useAuth } from '@/http-hooks/auth';
import { toast } from 'react-hot-toast';

/**
 * [User] Hook to fetch the logged-in user's order history.
 */
export const useGetUserOrders = () => {
    const { isAuthenticated } = useAuth(); // Get auth status

    return useQuery<BackendOrder[], Error>({
        queryKey: ['orders', 'my'], // Key for "my orders"
        queryFn: getUserOrders,
        enabled: !!isAuthenticated, // Only run if user is logged in
    });
};

/**
 * [User/Admin] Hook to fetch a single order by its ID.
 */
export const useGetOrderById = (orderId?: string) => {
    const { isAuthenticated } = useAuth();

    return useQuery<BackendOrder, Error>({
        queryKey: ['order', orderId], // Key for a single order
        queryFn: () => getOrderById(orderId!), // '!' is safe due to 'enabled'
        enabled: !!isAuthenticated && !!orderId, // Only run if user is logged in AND orderId is provided
    });
};

/**
 * [Admin] Hook to fetch ALL orders from all users.
 */
export const useGetAllOrders = () => {
    const { isAuthenticated, user } = useAuth();
    const isAdmin = isAuthenticated && (user as { role: string })?.role === 'admin';

    return useQuery<BackendOrder[], Error>({
        queryKey: ['orders', 'all'], // Key for "all orders"
        queryFn: getAllOrders,
        enabled: isAdmin, // Only run if user is logged in AND is an admin
    });
};

/**
 * [Admin] Hook to update an order's status.
 */
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation<
        BackendOrder,          // Type returned on success
        Error,                 // Type returned on error
        UpdateOrderStatusInput // Type of data passed to mutate()
    >({
        mutationFn: (updateData) => updateOrderStatus(updateData),

        onSuccess: (updatedOrder) => {
            toast.success('Order status updated!');

            // Invalidate all order lists
            queryClient.invalidateQueries({ queryKey: ['orders', 'all'] });
            queryClient.invalidateQueries({ queryKey: ['orders', 'my'] });

            // Also, instantly update the cache for this specific order
            queryClient.setQueryData(['order', updatedOrder._id], updatedOrder);
        },
        onError: (error: Error) => {
            console.error("Failed to update order status:", error.message);
            toast.error(error.message || "Failed to update status.");
        },
    });
};

// --- 2. ADD NEW HOOK ---
/**
 * [User] Hook to request an exchange for an order.
 */
export const useRequestExchange = () => {
    const queryClient = useQueryClient();

    return useMutation<
        BackendOrder, // Type returned on success
        Error,        // Type returned on error
        RequestExchangeInput        // Input type (orderId)
    >({
        mutationFn: (data) => requestExchange(data),
        onSuccess: (updatedOrder) => {
            toast.success('Exchange requested successfully!');
            // Update the cache for 'my orders'
            queryClient.invalidateQueries({ queryKey: ['orders', 'my'] });
            // Update the cache for this specific order
            queryClient.setQueryData(['order', updatedOrder._id], updatedOrder);
        },
        onError: (error: Error) => {
            console.error("Failed to request exchange:", error.message);
            toast.error(error.message || "Failed to request exchange.");
        },
    });
};

export const useManageExchange = () => {
    const queryClient = useQueryClient();

    return useMutation<
        BackendOrder,
        Error,
        ManageExchangeInput
    >({
        mutationFn: (data) => manageExchange(data),
        onSuccess: (updatedOrder) => {
            toast.success('Exchange status updated!');
            queryClient.invalidateQueries({ queryKey: ['orders', 'all'] });
            queryClient.invalidateQueries({ queryKey: ['orders', 'my'] });
            queryClient.setQueryData(['order', updatedOrder._id], updatedOrder);
        },
        onError: (error: Error) => {
            console.error("Failed to manage exchange:", error.message);
            toast.error(error.message || "Failed to update exchange.");
        },
    });
};