import { fetcher } from '../lib/fetcher'; // Adjust path if needed

// --- vvv TYPE DEFINITIONS (EXPORTED) vvv ---

// Defines the populated product details
export interface CartProductDetails {
    _id: string;
    productId: string;
    productName: string;
    price: number;
    images: string[];
    category: string;
    subcategory?: string;
}

// Defines a cart item (productId can be populated or just a string)
export interface CartItem {
    productId: CartProductDetails | string;
    quantity: number;
}

// Defines the full cart object returned from the backend
export interface Cart {
    _id: string | null;
    userId: string;
    items: CartItem[];
    createdAt?: string;
    updatedAt?: string;
}
// --- ^^^ END TYPE DEFINITIONS ^^^ ---


/**
 * Fetches the user's current shopping cart. (GET /api/cart)
 */
export const getCart = async (): Promise<Cart> => {
    return fetcher('/cart', { method: 'GET' });
};

/**
 * Adds an item to the cart or updates quantity. (POST /api/cart)
 */
export const addToCart = async (productId: string, quantity: number = 1): Promise<Cart> => {
    return fetcher('/cart', {
        method: 'POST',
        data: { productId, quantity },
    });
};

/**
 * Updates item quantity in the cart. (PUT /api/cart/:productId)
 */
export const updateCartItemQuantity = async (productId: string, quantity: number): Promise<Cart> => {
    if (quantity < 1) {
        throw new Error("Quantity must be at least 1.");
    }
    return fetcher(`/cart/${productId}`, {
        method: 'PUT',
        data: { quantity },
    });
};

/**
 * Removes an item from the cart. (DELETE /api/cart/:productId)
 */
export const removeFromCart = async (productId: string): Promise<Cart> => {
    return fetcher(`/cart/${productId}`, {
        method: 'DELETE',
    });
};

/**
 * Clears the entire cart. (DELETE /api/cart/clear)
 */
export const clearCart = async (): Promise<Cart> => {
    return fetcher('/cart/clear', {
        method: 'DELETE',
    });
};