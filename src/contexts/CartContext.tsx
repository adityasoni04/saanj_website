import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from "react";
import { useAuth } from "@/http-hooks/auth"; // Import auth hook
import {
    useGetCart,
    useAddToCart,
    useRemoveFromCart,
    useUpdateCartItemQuantity,
    useClearCart, // Import DB CartItem type from service
} from "@/http-hooks/cart";
import {
    Cart,         // Import Cart type from service
    CartItem as DbCartItem
} from "@/services/cart"// Import your DB cart hooks
import { toast as sonnerToast } from "sonner";
// Import your BackendProduct type
// (Define it here if not available globally)
interface BackendProduct {
    _id: string; productId: string; productName: string; description: string;
    price: number; category: string; subcategory?: string; features: string[];
    specifications: { label: string; value: string }[]; images: string[];
    originalPrice?: number; stock?: number; featured?: boolean;
    createdAt: string; updatedAt: string;
}

// Type for GUEST cart (localStorage)
interface LocalCartItem {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
    category?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: BackendProduct, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isLoading: boolean;
    isMutating: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to get local cart
const getLocalCart = (): LocalCartItem[] => {
    try {
        const localData = localStorage.getItem("guestCart");
        return localData ? JSON.parse(localData) : [];
    } catch (error) { return []; }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const [localCart, setLocalCart] = useState<LocalCartItem[]>(getLocalCart);
    const { data: dbCart, isLoading: isDbCartLoading, isError, error } = useGetCart();
    const { mutate: addItemToDb, isPending: isAdding } = useAddToCart();
    const { mutate: updateDbItem, isPending: isUpdating } = useUpdateCartItemQuantity();
    const { mutate: removeItemFromDb, isPending: isRemoving } = useRemoveFromCart();
    const { mutate: clearDbCart, isPending: isClearing } = useClearCart();

    const [isMerging, setIsMerging] = useState(false);

    // --- Sync Local Cart to LocalStorage ---
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem("guestCart", JSON.stringify(localCart));
        }
    }, [localCart, isAuthenticated]);

    // --- Merge Local Cart to DB on Login ---
    useEffect(() => {
        if (isAuthenticated && localCart.length > 0 && !isDbCartLoading && !isMerging) {
            setIsMerging(true);
            sonnerToast.info("Syncing your cart...");

            Promise.all(
                localCart.map(item =>
                    addItemToDb({ productId: item.productId, quantity: item.quantity })
                )
            ).then(() => {
                setLocalCart([]);
                localStorage.removeItem("guestCart");
                sonnerToast.success("Cart synced!");
                setIsMerging(false);
            }).catch((err) => {
                console.error("Cart merge failed:", err);
                sonnerToast.error("Could not sync your local cart.");
                setIsMerging(false);
                setLocalCart([]);
                localStorage.removeItem("guestCart");
            });
        }
    }, [isAuthenticated, isDbCartLoading, localCart, addItemToDb, isMerging]);

    // --- Decide which cart items to display ---
    const items: CartItem[] = useMemo(() => {
        if (!isAuthenticated) {
            // GUEST
            return localCart.map(item => ({ ...item }));
        }
        if (dbCart?.items) {
            // LOGGED IN
            return dbCart.items.map(item => {
                const details = typeof item.productId === 'object' ? item.productId : null;
                return {
                    productId: details?.productId || (item.productId as string),
                    quantity: item.quantity,
                    name: details?.productName || "Product",
                    price: details?.price || 0,
                    image: details?.images?.[0] || "/placeholder.png",
                    category: details?.category || ""
                };
            });
        }
        return [];
    }, [isAuthenticated, dbCart, localCart]);

    // --- Universal Actions ---
    const addToCart = (product: BackendProduct, quantity: number = 1) => {
        if (isAuthenticated) {
            addItemToDb({ productId: product.productId, quantity });
        } else {
            setLocalCart(prevItems => {
                const existingItem = prevItems.find(item => item.productId === product.productId);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.productId === product.productId
                            ? { ...item, quantity: item.quantity + quantity } : item
                    );
                }
                return [...prevItems, {
                    productId: product.productId,
                    name: product.productName,
                    price: product.price,
                    image: product.images?.[0] || "/placeholder.png",
                    quantity
                }];
            });
            // sonnerToast.success("Item added to cart!");
        }
    };

    const removeFromCart = (productId: string) => {
        if (isAuthenticated) {
            removeItemFromDb(productId);
        } else {
            setLocalCart(prevItems => prevItems.filter(item => item.productId !== productId));
            sonnerToast.success("Item removed from cart.");
        }
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        if (isAuthenticated) {
            updateDbItem({ productId, quantity });
        } else {
            setLocalCart(prevItems =>
                prevItems.map(item =>
                    item.productId === productId ? { ...item, quantity } : item
                )
            );
            sonnerToast.success("Cart updated.");
        }
    };

    const clearCart = () => {
        if (isAuthenticated) {
            clearDbCart();
        } else {
            setLocalCart([]);
            sonnerToast.success("Cart cleared.");
        }
    };

    // --- Derived Values ---
    const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
    const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

    // Combined loading states
    const isLoading = (isAuthenticated && isDbCartLoading) || isMerging;
    const isMutating = isAdding || isUpdating || isRemoving || isClearing;

    const value = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        isMutating,
        cart: dbCart,
        isError,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};