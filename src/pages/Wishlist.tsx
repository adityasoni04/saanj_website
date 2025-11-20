import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Loader2, X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWishlist, useRemoveFromWishlist } from "@/http-hooks/wishlist";
import { useAddToCart } from "@/http-hooks/cart";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

// --- Type Definitions ---
interface Specification { label: string; value: string; }
interface BackendProduct {
    _id: string; productId: string; productName: string;
    description: string; price: number; category: string;
    subcategory?: string; features: string[]; specifications: Specification[];
    images: string[]; originalPrice?: number; stock?: number;
    featured?: boolean; createdAt: string; updatedAt: string;
}

// --- Skeleton Component ---
const WishlistCardSkeleton = () => (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full">
        <Skeleton className="w-full aspect-square bg-muted p-4" />
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div className="space-y-1">
                <Skeleton className="h-4 w-1/3 rounded bg-muted" />
                <Skeleton className="h-5 w-full rounded bg-muted" />
                <Skeleton className="h-5 w-3/4 rounded bg-muted" />
            </div>
            <div className="space-y-3 pt-2">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-1/2 rounded bg-muted" />
                    <Skeleton className="h-4 w-1/3 rounded bg-muted" />
                </div>
                <Skeleton className="h-10 w-full rounded" />
            </div>
        </div>
    </div>
);

// --- Wishlist Card Component ---
interface WishlistCardProps {
    product: BackendProduct;
    onRemove: (productId: string) => void;
    isRemoving: boolean;
    cartItems: { productId: string; quantity: number }[];
    onAddToCart: (product: BackendProduct, qty: number) => void;
    onUpdateQuantity: (productId: string, qty: number) => void;
    isAddingToCart: boolean;
    isCartMutating: boolean;
}

const WishlistCard = ({
    product,
    onRemove,
    isRemoving,
    cartItems,
    onAddToCart,
    onUpdateQuantity,
    isAddingToCart,
    isCartMutating
}: WishlistCardProps) => {

    const navigate = useNavigate();
    const { toast } = useToast();

    const cartItem = useMemo(() =>
        cartItems.find(item => item.productId === product.productId),
        [cartItems, product.productId]);

    const currentQuantity = cartItem?.quantity || 0;
    const isInCart = currentQuantity > 0;

    const handleClick = () => navigate(`/product/${product.productId}`);
    const handleRemoveFromWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(product.productId);
    };
    const handleQuickAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart(product, 1);
        toast({
            title: "Added to cart",
            description: `${product.productName} has been added to your cart.`,
        });
    };
    const handleIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateQuantity(product.productId, currentQuantity + 1);
    };
    const handleDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateQuantity(product.productId, currentQuantity - 1);
    };

    const { productName, price, originalPrice, images, category } = product;
    const image1 = images?.[0] || '/placeholder.png';
    const image2 = images?.[1] || null;

    // Hover state to control image swap
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="group cursor-pointer bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Remove Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 h-10 w-10 rounded-full bg-red-100 text-red-600 
             hover:bg-red-200 hover:text-red-700 hover:scale-110 transition-all duration-200"
                onClick={handleRemoveFromWishlist}
                disabled={isRemoving}
                aria-label="Remove from wishlist"
                title="Remove from wishlist"
            >
                {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>

            {/* In Cart Chip */}
            {isInCart && (
                <div className="absolute top-2 left-2 z-20 px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
                    In Cart
                </div>
            )}

            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-muted flex items-center justify-center" onClick={handleClick}>
                <motion.img
                    src={image1}
                    alt={productName}
                    className="absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300"
                    animate={{ opacity: isHovered && image2 ? 0 : 1 }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                />
                {image2 && (
                    <motion.img
                        src={image2}
                        alt={`${productName} hover`}
                        className="absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300"
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                    />
                )}
            </div>

            {/* Text & Price Section */}
            <div className="p-4 flex flex-col flex-grow justify-between">
                <div className="space-y-1" onClick={handleClick}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider capitalize">
                        {category.replace(/-/g, ' ')}
                    </p>
                    <h3 className="font-serif text-lg font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
                        {productName}
                    </h3>
                </div>

                <div className="space-y-3 pt-2">
                    <div onClick={handleClick}>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-xl font-semibold text-accent">
                                ₹{price.toLocaleString('en-IN')}
                            </p>
                            {originalPrice && originalPrice > price && (
                                <p className="text-sm text-muted-foreground line-through">
                                    ₹{originalPrice.toLocaleString('en-IN')}
                                </p>
                            )}
                        </div>
                        {originalPrice && originalPrice > price && (
                            <p className="text-xs font-bold text-green-600">
                                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                            </p>
                        )}
                    </div>

                    {/* Cart Button */}
                    <div className="pt-2">
                        {!isInCart ? (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleQuickAdd}
                                aria-label={`Add ${productName} to cart`}
                                disabled={isAddingToCart || product.stock === 0}
                            >
                                {isAddingToCart ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                                {product.stock === 0 ? "Out of Stock" : (isAddingToCart ? "Adding..." : "Add to Cart")}
                            </Button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 rounded-lg p-1 h-10 border" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted" onClick={handleDecrease} disabled={isCartMutating} aria-label="Decrease quantity">
                                    <Minus className="h-4 w-4 text-primary" />
                                </Button>
                                <span className="w-8 text-center font-medium text-primary select-none">{currentQuantity}</span>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted" onClick={handleIncrease} disabled={isCartMutating} aria-label="Increase quantity">
                                    <Plus className="h-4 w-4 text-primary" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Wishlist Page ---
const Wishlist = () => {
    const { data: wishlist, isLoading, isError, error } = useGetWishlist();
    const { mutate: removeItem, isPending: isRemoving } = useRemoveFromWishlist();
    const { items: cartItems, addToCart, updateQuantity, isMutating: isCartMutating } = useCart();
    const { isPending: isAddingToCart } = useAddToCart();
    const items: BackendProduct[] = useMemo(() => wishlist?.items || [], [wishlist]);

    useEffect(() => {
        if (isError && error) {
            console.error("Error fetching wishlist:", error);
            sonnerToast.error(error.message || "Failed to load wishlist.");
        }
    }, [isError, error]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                {/* <Navbar /> */}
                <main className="pt-24 pb-16 flex-grow">
                    <div className="container mx-auto px-4 py-12">
                        <Skeleton className="h-10 w-1/3 mb-8 rounded bg-muted" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            <WishlistCardSkeleton /><WishlistCardSkeleton />
                            <WishlistCardSkeleton /><WishlistCardSkeleton />
                        </div>
                    </div>
                </main>
                {/* <Footer /> */}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex flex-col">
                {/* <Navbar /> */}
                <main className="flex-grow flex items-center justify-center">
                    <div className="container mx-auto px-4 py-20 text-center">
                        <h1 className="text-3xl font-bold text-destructive mb-4">Error Loading Wishlist</h1>
                        <p className="text-muted-foreground mb-6">Could not fetch your wishlist. Please try again later.</p>
                        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
                    </div>
                </main>
                {/* <Footer /> */}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                {/* <Navbar /> */}
                <main className="flex-grow flex items-center justify-center">
                    <div className="container mx-auto px-4 py-20">
                        <div className="text-center max-w-md mx-auto">
                            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
                            <h1 className="font-serif text-3xl font-bold text-primary mb-4">Your Wishlist is Empty</h1>
                            <p className="text-muted-foreground mb-8">Explore our collections and save your favorite items to see them here.</p>
                            <Link to="/all-categories"><Button size="lg">Continue Shopping</Button></Link>
                        </div>
                    </div>
                </main>
                {/* <Footer /> */}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* <Navbar /> */}
            <main className="pt-24 pb-16 flex-grow">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="font-serif text-4xl font-bold text-primary mb-8">My Wishlist</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        <AnimatePresence>
                            {items.map((product) => (
                                <WishlistCard
                                    key={product.productId}
                                    product={product}
                                    onRemove={removeItem}
                                    isRemoving={isRemoving}
                                    cartItems={cartItems}
                                    onAddToCart={addToCart}
                                    onUpdateQuantity={updateQuantity}
                                    isAddingToCart={isAddingToCart}
                                    isCartMutating={isCartMutating}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default Wishlist;
