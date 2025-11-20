import { fetcher } from '../lib/fetcher'; // Adjust path if needed

export interface CreateOrderInput {
    products: { productId: string; quantity: number }[]; // An array of products with ID and quantity
    shippingAddress: object; // Your shipping address object
    paymentMethod: 'Razorpay' | 'COD'; // <-- ADDED
}

// The response from Razorpay (embedded in our order)
interface RazorpayOrder {
    id: string; // This is the crucial razorpay_order_id
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: any[];
    created_at: number;
}

// The full Order object returned from our backend
export interface BackendOrder {
    _id: string;
    userId: string;
    products: {
        productId: string;
        quantity: number;
        price: number; // The price (in PAISE) at time of purchase
    }[];
    amount: number; // The total amount (in PAISE) calculated by the server
    shippingAddress: object;
    razorpayOrder?: RazorpayOrder; // <-- MADE OPTIONAL (for COD)
    paymentMethod: 'Razorpay' | 'COD'; // <-- ADDED
    isPaid: boolean;
    paymentInfo?: {
        paymentId: string;
        signature: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Input for Step 2: Verifying the payment
export interface VerifyPaymentInput {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

// Response from a successful verification
export interface VerifyPaymentResponse {
    message: string;
    orderId: string; // The MongoDB _id of the successfully paid order
}


export const createPaymentOrder = async (orderData: CreateOrderInput): Promise<BackendOrder> => {
    return fetcher('/payment/orders', {
        method: 'POST',
        data: orderData,
    });
};

export const verifyPayment = async (paymentData: VerifyPaymentInput): Promise<VerifyPaymentResponse> => {
    return fetcher('/payment/verify', {
        method: 'POST',
        data: paymentData,
    });
};

