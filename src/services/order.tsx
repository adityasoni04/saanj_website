import { fetcher } from '../lib/fetcher'; // Adjust path if needed

// --- 1. TYPE DEFINITIONS ---

// The populated product details
export interface OrderProductDetails {
    _id: string;
    productId: string;
    productName: string;
    price: number; // This is the price *in Rupees* from the product model
    images: string[];
    category: string;
    subcategory?: string;
}

// The populated product item in an order
export interface PopulatedOrderProduct {
    quantity: number;
    price: number; // Price (in PAISE) at time of order
    productDetails: OrderProductDetails | null; // This is the populated object
}

// The user info that gets populated in admin 'getAllOrders'
export interface PopulatedUser {
    _id: string;
    displayName: string;
    email: string;
}

// The shipping address
export interface ShippingAddress {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

// The main Order object - THIS IS THE MAIN UPDATE
export interface BackendOrder {
    _id: string;
    userId: string | PopulatedUser; // Can be a string or a populated object
    products: PopulatedOrderProduct[]; // <-- UPDATED
    amount: number; // Total amount in paise
    shippingAddress: ShippingAddress;
    isPaid: boolean;
    receiptId?: string;
    // --- UPDATED/ADDED FIELDS ---
    orderStatus: string; // Use string for flexibility, or the long enum from backend
    paymentMethod: 'Razorpay' | 'COD'; // <-- ADDED
    razorpayOrder?: { // <-- MADE OPTIONAL (for COD)
        id: string;
        receipt: string;
        [key: string]: any;
    };
    paymentInfo?: {
        paymentId: string;
        signature: string;
    };
    deliveredAt?: string; // <-- ADDED
    exchangeStatus?: string; // <-- ADDED
    shippingInfo?: { // <-- ADDED
        provider: string;
        trackingId: string;
    };
    // --- END UPDATES ---

    createdAt: string;
    updatedAt: string;
    exchangeReason?: string;
}

export interface ManageExchangeInput {
    orderId: string;
    action: 'approve' | 'reject';
}

// Input for the updateStatus mutation
export interface UpdateOrderStatusInput {
    orderId: string;
    status: string; // Use string for flexibility
    trackingId?: string; // <-- ADDED (optional)
}

export interface RequestExchangeInput {
    orderId: string;
    reason: string;
}
/**
 * [User] Fetches all orders (populated) for the logged-in user.
 */
export const getUserOrders = async (): Promise<BackendOrder[]> => {
    return fetcher('/orders/myorders', { method: 'GET' });
};

/**
 * [User/Admin] Fetches a single order by its MongoDB _id (populated).
 */
export const getOrderById = async (orderId: string): Promise<BackendOrder> => {
    return fetcher(`/orders/${orderId}`, { method: 'GET' });
};

/**
 * [Admin] Fetches all orders from all users (populated).
 */
export const getAllOrders = async (): Promise<BackendOrder[]> => {
    return fetcher('/orders', { method: 'GET' });
};

/**
 * [Admin] Updates the status of a specific order.
 */
// --- UPDATED FUNCTION ---
export const updateOrderStatus = async ({ orderId, status, trackingId }: UpdateOrderStatusInput): Promise<BackendOrder> => {
    return fetcher(`/orders/${orderId}/status`, {
        method: 'PUT',
        data: { status, trackingId }, // <-- Pass trackingId
    });
};

export const requestExchange = async ({ orderId, reason }: RequestExchangeInput): Promise<BackendOrder> => {
    return fetcher(`/orders/${orderId}/request-exchange`, {
        method: 'POST',
        data: { reason } // <-- Send the reason in the body
    });
};

export const manageExchange = async ({ orderId, action }: ManageExchangeInput): Promise<BackendOrder> => {
    return fetcher(`/orders/${orderId}/manage-exchange`, {
        method: 'PUT',
        data: { action }
    });
};