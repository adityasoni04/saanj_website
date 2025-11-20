import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createPaymentOrder,
    verifyPayment,
    BackendOrder,
    CreateOrderInput,
    VerifyPaymentInput,
    VerifyPaymentResponse
} from '@/services/payment'; // Adjust path
import { toast } from 'react-hot-toast'; // Or your preferred toast library


export const useCreatePaymentOrder = () => {
    return useMutation<
        BackendOrder,      // Type returned on success
        Error,             // Type returned on error
        CreateOrderInput   
    >({
        mutationFn: (orderData) => createPaymentOrder(orderData),
        onError: (error: Error) => {
            console.error("Failed to create order:", error.message);
            toast.error(error.message || "Failed to create order. Please try again.");
        },
    });
};

/**
 * Hook for Step 2: Verifying the payment.
 * This is called by the Razorpay success 'handler' function.
 */
export const useVerifyPayment = () => {
    const queryClient = useQueryClient();

    return useMutation<
        VerifyPaymentResponse, // Type returned on success
        Error,                 // Type returned on error
        VerifyPaymentInput     // Type of data passed to mutate()
    >({
        mutationFn: (paymentData) => verifyPayment(paymentData),
        
        onSuccess: (data) => {
            toast.success(data.message || "Payment successful!");

            // Invalidate the cart query to refetch it (it should be empty now)
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            
            // Invalidate user's orders to show the new order
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: Error) => {
            console.error("Payment verification failed:", error.message);
            toast.error(error.message || "Payment verification failed. Please contact support.");
        },
    });
};