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
  const { addToCart, items: cartItems, updateQuantity, isMutating: isCartMutating } = useCart()
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
  }, [cartItems, product])

  const isInCart = !!cartItem
  const cartQuantity = cartItem?.quantity || 0

  const isWishlisted = useMemo(() => {
    if (!product || !wishlist?.items) return false
    return wishlist.items.some((item) => item.productId === product.productId)
  }, [wishlist, product])

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
    <div className="min-h-screen flex flex-col bg-background">
      <main className="pt-20 md:pt-24 pb-20 flex-grow">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 md:px-8 pb-4 md:pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors whitespace-nowrap">
              Home
            </Link>
            {categoryInfo && (
              <>
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                <Link
                  to={`/category/${categoryInfo.slug}`}
                  className="hover:text-accent transition-colors whitespace-nowrap"
                >
                  {categoryInfo.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-foreground font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
              {product.productName}
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">

            {/* --- LEFT: IMAGE GALLERY --- */}
            <div className="flex flex-col gap-4 w-full">
              {/* Main Image Container */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full rounded-xl overflow-hidden bg-white border border-border/50 shadow-sm
                           h-[380px] sm:h-[450px] lg:h-[600px] flex items-center justify-center"
              >
                <img
                  src={product.images?.[selectedImage] || "/placeholder.png"}
                  alt={product.productName}
                  // p-1 ensures inner image is large as requested
                  className="w-full h-full object-contain p-1 transition-transform duration-500 hover:scale-110 cursor-zoom-in"
                  onError={(e) => {
                    ; (e.target as HTMLImageElement).src = "/placeholder.png"
                  }}
                />
              </motion.div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="grid grid-cols-5 gap-3 md:gap-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-white transition-all duration-200 
                        ${selectedImage === index
                          ? "border-accent ring-2 ring-accent/20 ring-offset-2"
                          : "border-transparent hover:border-accent/50"
                        }`}
                    >
                      <img
                        src={image || "/placeholder.png"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          ; (e.target as HTMLImageElement).src = "/placeholder.png"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* --- RIGHT: PRODUCT INFO --- */}
            <div className="flex flex-col lg:sticky lg:top-32 lg:py-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4 md:space-y-6 lg:space-y-7"
              >
                {/* Header Info */}
                <div className="space-y-3 md:space-y-4">
                  {/* FONT SIZE ADJUSTMENT: Reduced from text-5xl to text-3xl for better desktop balance */}
                  <h1 className="font-serif text-2xl md:text-3xl lg:text-3xl font-bold text-primary leading-tight">
                    {product.productName}
                  </h1>

                  <div className="flex items-baseline gap-2 md:gap-3 pb-4 border-b border-border flex-wrap">
                    <span className="text-xl md:text-2xl lg:text-3xl font-bold text-accent">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-sm md:text-lg text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs md:text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}

                    <span className="text-xs text-muted-foreground ml-1">
                      Incl. taxes
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-sm text-muted-foreground">
                  <p className="leading-relaxed text-sm md:text-base">
                    {product.description}
                  </p>
                </div>

                {/* Features Highlights (FIXED ALIGNMENT) */}
                {product.features?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-foreground uppercase tracking-wide">Highlights</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-xs md:text-sm text-muted-foreground">
                          {/* FIX: Use a CSS circle instead of text bullet for perfect alignment */}
                          <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-[0.5rem]" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specifications Section (ADDED) */}
                {product.specifications?.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-border/50">
                    <h3 className="font-semibold text-sm text-foreground uppercase tracking-wide mb-3">
                      Specifications
                    </h3>
                    <div className="grid grid-cols-1 gap-y-3">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 text-xs md:text-sm">
                          <span className="text-muted-foreground font-medium">{spec.label}</span>
                          <span className="col-span-2 text-foreground">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Area - STRUCTURED LIKE MOBILE CODE */}
                <div className="pt-2 flex flex-col gap-4">
                  {isInCart ? (
                    <div className="mb-1 md:mb-2">
                      <Label className="block text-xs font-semibold mb-2">Quantity in Cart</Label>
                      {/* Original Style Counter */}
                      <div className="flex items-center gap-1 md:gap-2 bg-secondary/30 rounded-lg p-1 w-fit mb-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleDecreaseCartQty}
                          disabled={isCartMutating || cartQuantity <= 1}
                          className="hover:bg-accent/10 hover:text-accent h-8 w-8 md:h-9 md:w-9"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                        <span className="text-base md:text-lg font-semibold w-8 md:w-10 text-center select-none tabular-nums">
                          {cartQuantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleIncreaseCartQty}
                          disabled={isCartMutating}
                          className="hover:bg-accent/10 hover:text-accent h-8 w-8 md:h-9 md:w-9"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to="/cart">
                          <Button
                            size="lg"
                            variant="secondary"
                            className="w-full text-sm md:text-base py-3 md:py-6 font-semibold hover:bg-accent hover:text-accent-foreground shadow-sm"
                          >
                            ✓ In Cart - Go to Cart
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-1 md:mb-2">
                      <Label className="block text-xs font-semibold mb-2">Quantity</Label>
                      {/* Original Style Counter */}
                      <div className="flex items-center gap-1 md:gap-2 bg-secondary/30 rounded-lg p-1 w-fit mb-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="hover:bg-accent/10 hover:text-accent h-8 w-8 md:h-9 md:w-9"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                        <span className="text-base md:text-lg font-semibold w-8 md:w-10 text-center select-none tabular-nums">
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQuantity(quantity + 1)}
                          className="hover:bg-accent/10 hover:text-accent h-8 w-8 md:h-9 md:w-9"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="lg"
                          className="w-full text-sm md:text-base py-3 md:py-6 shadow-md"
                          onClick={handleAddToCart}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Add to Cart
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Wishlist Button - Original Style */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full text-xs md:text-sm py-3 md:py-6 bg-transparent border-solid border-border"
                      onClick={handleWishlistToggle}
                      disabled={isMutatingWishlist}
                    >
                      {isMutatingWishlist ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Heart
                          className="mr-2 h-4 w-4"
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
                </div>

                {/* Trust Badges - Cards Layout (Requested) */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border mt-2">
                  {[
                    { text: "Free shipping", icon: true },
                    { text: "100% Genuine", icon: true },
                    { text: "7-days Exchange", icon: true },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center p-3 text-center bg-secondary/10 rounded-lg border border-border/50 h-full"
                    >
                      <span className="text-accent text-lg font-bold mb-1">✓</span>
                      <span className="text-[10px] md:text-xs font-medium text-foreground leading-tight">{item.text}</span>
                    </div>
                  ))}
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