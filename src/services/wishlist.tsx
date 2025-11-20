import { fetcher } from '../lib/fetcher'; // Adjust path if needed

// --- vvv TYPE DEFINITIONS (EXPORTED) vvv ---

// Defines the full product structure returned by the backend
// (Based on your previous product schema)
export interface BackendProduct {
    _id: string;
    productId: string;
    productName: string;
    description: string;
    price: number;
    category: string;
    subcategory?: string;
    features: string[];
    specifications: { label: string; value: string }[];
    images: string[];
    originalPrice?: number;
    stock?: number;
    featured?: boolean;
    createdAt: string;
    updatedAt: string;
}

// Defines the full wishlist object returned from the backend
export interface Wishlist {
    _id: string | null;
    userId: string;
    items: BackendProduct[]; // The backend populates this with full product details
    createdAt?: string;
    updatedAt?: string;
}

// --- ^^^ END TYPE DEFINITIONS ^^^ ---


// --- SERVICE FUNCTIONS ---

/**
 * Fetches the user's current wishlist (populated).
 * GET /api/wishlist
 */
export const getWishlist = async (): Promise<Wishlist> => {
    return fetcher('/wishlist', { method: 'GET' });
};

/**
 * Adds an item to the wishlist.
 * POST /api/wishlist
 * @param {string} productId - The unique product ID to add.
 */
export const addToWishlist = async (productId: string): Promise<Wishlist> => {
    return fetcher('/wishlist', {
        method: 'POST',
        data: { productId },
    });
};

/**
 * Removes an item from the wishlist.
 * DELETE /api/wishlist/:productId
 * @param {string} productId - The unique product ID to remove.
 */
export const removeFromWishlist = async (productId: string): Promise<Wishlist> => {
    return fetcher(`/wishlist/${productId}`, {
        method: 'DELETE',
    });
};