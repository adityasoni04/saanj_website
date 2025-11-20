"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { categories } from "@/data/categories"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronRight, ShoppingCart, Heart, Plus, Minus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/CartContext"
import { useGetProductById } from "@/http-hooks/product"
import { useAuth } from "@/http-hooks/auth"
import { useGetWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/http-hooks/wishlist"
import { toast as sonnerToast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductDetailSkeleton } from "@/components/ui/ProductDetailSkeleton"

interface BackendProduct {
  _id: string
  productId: string
  productName: string
  description: string
  price: number
  category: string
  subcategory?: string
  features: string[]
  specifications: { label: string; value: string }[]
  images: string[]
  originalPrice?: number
  stock?: number
  featured?: boolean
  createdAt: string
  updatedAt: string
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>()
  const { toast } = useToast()
  const { addToCart, items: cartItems, updateQuantity, isMutating: isCartMutating } = useCart() // updated
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // --- Hooks ---
  const { data: product, isLoading, isError, error } = useGetProductById(productId)
  const { isAuthenticated, loginWithGoogle } = useAuth()
  const { data: wishlist } = useGetWishlist()
  const { mutate: addItemToWishlist, isPending: isAddingToWishlist } = useAddToWishlist()
  const { mutate: removeItemFromWishlist, isPending: isRemovingFromWishlist } = useRemoveFromWishlist()

  const isMutatingWishlist = isAddingToWishlist || isRemovingFromWishlist

  // --- Derived State ---
  const cartItem = useMemo(() => {
    if (!product || !cartItems) return null
    return cartItems.find((item) => item.productId === product.productId)
  }, [cartItems, product]) // updated

  const isInCart = !!cartItem
  const cartQuantity = cartItem?.quantity || 0

  const isWishlisted = useMemo(() => {
    if (!product || !wishlist?.items) return false
    return wishlist.items.some((item) => item.productId === product.productId)
  }, [wishlist, product]) // updated

  // --- Effects ---
  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching product details:", error)
      sonnerToast.error(error.message || "Failed to load product details.")
    }
  }, [isError, error])

  useEffect(() => {
    if (product?.images?.length) setSelectedImage(0)
  }, [product?.productId])

  useEffect(() => {
    if (isAuthenticated && isLoginModalOpen) setIsLoginModalOpen(false)
  }, [isAuthenticated, isLoginModalOpen])

  // --- Handlers ---
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      toast({
        title: "Added to cart!",
        description: `${quantity} x ${product.productName} added.`,
      })
    }
  }

  const handleIncreaseCartQty = () => {
    if (cartItem) updateQuantity(cartItem.productId, cartItem.quantity + 1)
  }

  const handleDecreaseCartQty = () => {
    if (cartItem && cartItem.quantity > 1) updateQuantity(cartItem.productId, cartItem.quantity - 1)
  }

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      sonnerToast.error("Please log in to manage your wishlist.")
      setIsLoginModalOpen(true)
      return
    }
    if (isWishlisted) removeItemFromWishlist(product.productId)
    else addItemToWishlist(product.productId)
  }

  const categoryInfo = product ? categories.find((cat) => cat.slug === product.category) : undefined

  // --- UI ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="pt-24 pb-16 flex-grow">
          <ProductDetailSkeleton />
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">Sorry, we couldn't find the product you're looking for.</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="pt-20 md:pt-24 pb-16 flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 mb-1 md:mb-2">
          <div className="flex flex-wrap items-center gap-1 md:gap-2 text-xs md:text-xs text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors whitespace-nowrap">
              Home
            </Link>
            {categoryInfo && (
              <>
                <ChevronRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <Link
                  to={`/category/${categoryInfo.slug}`}
                  className="hover:text-accent transition-colors whitespace-nowrap"
                >
                  {categoryInfo.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span className="text-foreground font-medium whitespace-nowrap text-xs">{product.productName}</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
            {/* IMAGE GALLERY */}
            <div className="lg:col-span-3 flex flex-col">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="h-48 md:h-64 lg:h-80 bg-muted rounded-lg overflow-hidden shadow-lg mb-2 md:mb-3 flex items-center justify-center"
              >
                <img
                  src={product.images?.[selectedImage] || "/placeholder.png"}
                  alt={product.productName}
                  className="max-h-full max-w-full object-contain p-2 md:p-3 transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    ; (e.target as HTMLImageElement).src = "/placeholder.png"
                  }}
                />
              </motion.div>

              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 md:gap-2 mt-1 md:mt-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-12 md:h-16 rounded-lg overflow-hidden border-2 bg-muted flex items-center justify-center transition-all duration-200 ${selectedImage === index ? "border-accent shadow-md scale-105" : "border-border hover:border-accent/50"}`}
                    >
                      <img
                        src={image || "/placeholder.png"}
                        alt={`${product.productName} thumbnail ${index + 1}`}
                        className="max-h-full max-w-full object-contain p-1"
                        onError={(e) => {
                          ; (e.target as HTMLImageElement).src = "/placeholder.png"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT INFO */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:sticky lg:top-28"
              >
                <h1 className="font-serif text-base md:text-lg lg:text-xl font-bold text-primary mb-1 md:mb-2">
                  {product.productName}
                </h1>

                <div className="flex items-baseline gap-1 md:gap-2 mb-2 md:mb-3 pb-2 md:pb-3 border-b border-border">
                  <span className="text-lg md:text-xl font-bold text-accent">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs md:text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">Incl. taxes</span>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 leading-relaxed">
                  {product.description}
                </p>

                {product.features?.length > 0 && (
                  <div className="mb-2 md:mb-3">
                    <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">Key Features</h3>
                    <div className="space-y-0.5 md:space-y-1">
                      {product.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 md:gap-2 text-xs md:text-sm leading-relaxed"
                        >
                          <span className="text-accent font-bold">•</span>
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.specifications?.length > 0 && (
                  <div className="mb-2 md:mb-3">
                    <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">Specifications</h3>
                    <div className="space-y-0.5 md:space-y-1">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between py-0.5 md:py-1 border-b border-border text-xs">
                          <span className="text-muted-foreground">{spec.label}</span>
                          <span className="font-medium text-right">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isInCart ? (
                  <div className="mb-1 md:mb-2">
                    <Label className="block text-xs font-semibold mb-1 md:mb-2">Quantity in Cart</Label>
                    <div className="flex items-center gap-1 md:gap-2 bg-secondary/30 rounded-lg p-1 w-fit">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDecreaseCartQty}
                        disabled={isCartMutating || cartQuantity <= 1}
                        className="hover:bg-background h-6 w-6 md:h-7 md:w-7"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      </Button>
                      <span className="text-base md:text-lg font-semibold w-8 md:w-10 text-center select-none">
                        {cartQuantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleIncreaseCartQty}
                        disabled={isCartMutating}
                        className="hover:bg-background h-6 w-6 md:h-7 md:w-7"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-2 mt-1 md:mt-2">
                      <Link to="/cart">
                        <Button
                          size="lg"
                          variant="secondary"
                          className="w-full text-xs md:text-sm py-2 md:py-3 font-semibold hover:bg-accent hover:text-accent-foreground"
                        >
                          ✓ In Cart - Go to Cart
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mb-1 md:mb-2">
                    <Label className="block text-xs font-semibold mb-1 md:mb-2">Quantity</Label>
                    <div className="flex items-center gap-1 md:gap-2 bg-secondary/30 rounded-lg p-1 w-fit">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="hover:bg-background h-6 w-6 md:h-7 md:w-7"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      </Button>
                      <span className="text-base md:text-lg font-semibold w-8 md:w-10 text-center select-none">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        className="hover:bg-background h-6 w-6 md:h-7 md:w-7"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-2 mt-1 md:mt-2">
                      <Button size="lg" className="w-full text-xs md:text-sm py-2 md:py-3" onClick={handleAddToCart}>
                        <ShoppingCart className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1 md:gap-2">
                  <Button
                    variant="outline"
                    className="w-full text-xs md:text-sm py-2 md:py-3 bg-transparent"
                    onClick={handleWishlistToggle}
                    disabled={isMutatingWishlist}
                  >
                    {isMutatingWishlist ? (
                      <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                    ) : (
                      <Heart
                        className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4"
                        fill={isWishlisted ? "#ef4444" : "none"}
                        color={isWishlisted ? "#ef4444" : "currentColor"}
                      />
                    )}
                    {isAddingToWishlist
                      ? "Adding..."
                      : isRemovingFromWishlist
                        ? "Removing..."
                        : isWishlisted
                          ? "In Wishlist"
                          : "Add to Wishlist"}
                  </Button>
                </div>

                <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border space-y-1.5 md:space-y-2 text-sm md:text-base">
                  <div className="flex items-center gap-1 md:gap-2 text-muted-foreground font-medium">
                    <span className="text-accent text-lg md:text-xl">✓</span>
                    <span>Free shipping</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 text-muted-foreground font-medium">
                    <span className="text-accent text-lg md:text-xl">✓</span>
                    <span>100% Genuine</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 text-muted-foreground font-medium">
                    <span className="text-accent text-lg md:text-xl">✓</span>
                    <span>7-days Exchange</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* LOGIN MODAL */}
        <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-center">Welcome to Saanj</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-6">
              <p className="text-muted-foreground text-center text-sm">
                Sign in to access your account and manage your orders
              </p>
              <Button
                variant="outline"
                className="w-full flex items-center gap-3 py-6 hover:bg-accent/10 bg-transparent"
                onClick={loginWithGoogle}
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
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C6.51 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l-7.97 6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.38-5.71c-2.11 1.41-4.8 2.26-7.51 2.26-5.26 0-9.74-3.51-11.33-8.19l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                </svg>
                <span className="font-medium">Login with Google</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default ProductDetail
