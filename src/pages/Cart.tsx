import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // --- MODIFIED: Added useNavigate ---
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItemSkeleton } from "@/components/ui/CartItemSkeleton";
import { CartSummarySkeleton } from "@/components/ui/CartSummarySkeleton";
// --- ADDED: Dialog components for the modal ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetCart,
  useRemoveFromCart,
  useUpdateCartItemQuantity,
} from "@/http-hooks/cart";
import { toast as sonnerToast } from "sonner";
import { useAuth } from "@/http-hooks/auth";

// --- Types ---
interface CartProductDetails {
  _id: string;
  productId: string;
  productName: string;
  price: number;
  images: string[];
  category: string;
  subcategory?: string;
}

interface DbCartItem {
  productId: CartProductDetails | string;
  quantity: number;
}

interface LocalCartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  category?: string;
}

const Cart = () => {
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const localData = localStorage.getItem("guestCart");
        if (localData) setLocalCart(JSON.parse(localData));
      } catch {
        setLocalCart([]);
      }
    }
  }, [isAuthenticated]);

  const {
    data: dbCart,
    isLoading: isDbCartLoading,
    isError,
    error,
  } = useGetCart();
  const { mutate: removeItemFromDb, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: updateDbQuantity, isPending: isUpdating } = useUpdateCartItemQuantity();

  const items = useMemo(() => {
    if (isAuthenticated) {
      return (
        dbCart?.items?.map((item: DbCartItem) => {
          const details =
            typeof item.productId === "object"
              ? (item.productId as CartProductDetails)
              : null;
          return {
            productId: details?.productId || (item.productId as string),
            quantity: item.quantity,
            name: details?.productName || "Product",
            price: details?.price || 0,
            image: details?.images?.[0] || "/placeholder.png",
            category: details?.category || "",
          };
        }) || []
      );
    }
    return localCart;
  }, [isAuthenticated, dbCart, localCart]);

  const updateLocalQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      const updated = localCart.filter((i) => i.productId !== productId);
      setLocalCart(updated);
      localStorage.setItem("guestCart", JSON.stringify(updated));
      sonnerToast.success("Item removed from cart.");
      return;
    }
    const updated = localCart.map((i) =>
      i.productId === productId ? { ...i, quantity: newQty } : i
    );
    setLocalCart(updated);
    localStorage.setItem("guestCart", JSON.stringify(updated));
    sonnerToast.success("Cart updated.");
  };

  const removeLocalItem = (productId: string) => {
    const updated = localCart.filter((i) => i.productId !== productId);
    setLocalCart(updated);
    localStorage.setItem("guestCart", JSON.stringify(updated));
    sonnerToast.success("Item removed from cart.");
  };

  // --- Calculate total price ---
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // --- ADDED: Auto-close modal and redirect on login ---
  useEffect(() => {
    if (isAuthenticated && isLoginModalOpen) {
      setIsLoginModalOpen(false);
      sonnerToast.success("Logged in! Redirecting to checkout...");
      navigate("/checkout");
    }
  }, [isAuthenticated, isLoginModalOpen, navigate]);

  // --- ADDED: Checkout Click Handler ---
  const handleCheckoutClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault(); // Stop the <Link> from navigating
      sonnerToast.error("Please log in to proceed to checkout.");
      setIsLoginModalOpen(true); // Open the login modal
    }
  };

  // --- Handle loading state ---
  if (isAuthenticated && isDbCartLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="pt-24 pb-16 flex-grow">
          <div className="px-4 py-12">
            <Skeleton className="h-10 w-1/3 mb-8 rounded bg-muted" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <CartItemSkeleton />
                <CartItemSkeleton />
                <CartItemSkeleton />
              </div>
              <div className="lg:col-span-1">
                <CartSummarySkeleton />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- Error state ---
  if (isAuthenticated && isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-destructive mb-4">
              Error Loading Cart
            </h1>
            <p className="text-muted-foreground mb-6">
              Could not fetch your cart data. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        </main>
      </div>
    );
  }

  // --- Empty cart state ---
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="font-serif text-3xl font-bold text-primary mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven’t added any items yet.
            </p>
            <Link to="/all-categories">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // --- Cart with items ---
  return (
    <div className="min-h-screen flex flex-col">
      <main className="pt-10 pb-16 flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl font-bold text-primary mb-8">
            Shopping Cart
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.productId || `local-${index}`}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-card border border-border rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 relative"
                  >
                    {(isRemoving || isUpdating) && isAuthenticated && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}

                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-full sm:w-32 h-32 object-contain rounded-lg bg-muted"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-lg sm:text-xl font-semibold text-primary">
                          {item.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            isAuthenticated
                              ? removeItemFromDb(item.productId)
                              : removeLocalItem(item.productId)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              isAuthenticated
                                ? updateDbQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity - 1,
                                })
                                : updateLocalQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                            }
                            disabled={item.quantity <= 1 || isUpdating || isRemoving}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              isAuthenticated
                                ? updateDbQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity + 1,
                                })
                                : updateLocalQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                            }
                            disabled={isUpdating || isRemoving}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="font-serif text-xl font-bold text-primary">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-28">
                <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="font-serif text-xl font-bold text-primary">
                        Total
                      </span>
                      <span className="font-serif text-xl font-bold text-primary">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
                {/* --- MODIFIED: Added onClick handler to the Link --- */}
                <Link to="/checkout" onClick={handleCheckoutClick}>
                  <Button
                    size="lg"
                    className="w-full mb-3"
                    disabled={items.length === 0 || isRemoving || isUpdating}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link to="/all-categories">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- ADDED: Login Modal --- */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-center">
              Sign in to Continue
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <p className="text-muted-foreground text-center text-sm">
              Please log in to proceed to checkout.
            </p>
            <Button
              variant="outline"
              className="w-full flex items-center gap-3 py-6 hover:bg-accent/10"
              onClick={loginWithGoogle} // Use the login function from useAuth
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h12.8c-.57 2.73-2.21 4.97-4.54 6.51l7.38 5.71C44.97 35.53 46.98 30.49 46.98 24.55z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.38-5.71c-2.11 1.41-4.8 2.26-7.51 2.26-5.26 0-9.74-3.51-11.33-8.19l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              <span className="font-medium">Login with Google</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;