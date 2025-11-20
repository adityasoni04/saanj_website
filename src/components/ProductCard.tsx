import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

// Props
interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image1: string;
  image2: string;
  category: string;
  productId: string;
}

// Backend type definition
interface BackendProduct {
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

const ProductCard = ({ name, price, originalPrice, image1, image2, category, productId }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // <-- Used for navigation
  const { toast } = useToast();
  const { items, addToCart, updateQuantity } = useCart(); // <-- Used for cart

  const cartItem = useMemo(() =>
    items.find(item => item.productId === productId),
    [items, productId]
  );

  const currentQuantity = cartItem?.quantity || 0;

  // --- 1. NAVIGATION LOGIC IS HERE ---
  const handleClick = () => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  // --- 2. CART LOGIC IS HERE ---
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    const productForCart: Partial<BackendProduct> = {
      productId: productId,
      productName: name,
      price: price,
      originalPrice: originalPrice,
      images: [image1, image2],
      category: category,
      _id: '', description: '', features: [], specifications: [], createdAt: '', updatedAt: '',
    };

    addToCart(productForCart as BackendProduct, 1);

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (productId) {
      updateQuantity(productId, currentQuantity + 1);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (productId) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick} // <-- 1. NAVIGATION LOGIC ATTACHED
    >
      {/* --- Image container --- */}
      <div className="relative aspect-square overflow-hidden bg-muted p-4">
        <motion.img
          src={image1 || '/placeholder.png'}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain"
          initial={{ opacity: 1 }}
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
        />
        <motion.img
          src={image2 || image1 || '/placeholder.png'}
          alt={`${name} alternate view`}
          className="absolute inset-0 w-full h-full object-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
        />

        {/* --- 2. CART LOGIC ATTACHED --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center"
        >
          {currentQuantity === 0 ? (
            <Button
              onClick={handleQuickAdd} // <-- Quick add
              className="bg-background text-primary hover:bg-background/90 shadow-md"
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          ) : (
            <div
              className="flex items-center gap-2 bg-background rounded-full p-1 shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted" onClick={handleDecrease} aria-label="Decrease quantity"> {/* Decrease */}
                <Minus className="h-4 w-4 text-primary" />
              </Button>
              <span className="w-8 text-center font-medium text-primary select-none">
                {currentQuantity}
              </span>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-muted" onClick={handleIncrease} aria-label="Increase quantity"> {/* Increase */}
                <Plus className="h-4 w-4 text-primary" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* --- Text & Price Section --- */}
      <div className="p-2 flex flex-col justify-between flex-1"> {/* 1. Reduced padding */}
        <div className="space-y-0.5">
          <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider capitalize"> {/* 2. Smaller category */}
            {category.replace(/-/g, ' ')}
          </p>
          <h3 className="font-serif text-xs font-medium lg:text-lg lg:font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2"> {/* 3. Smaller name */}
            {name}
          </h3>
        </div>

        <div className="pt-1">
          <div className="flex items-baseline gap-1.5"> {/* 4. Reduced gap */}
            <p className="text-sm lg:text-xl font-semibold text-accent"> {/* 5. Smaller price */}
              ₹{price.toLocaleString('en-IN')}
            </p>
            {originalPrice && originalPrice > price && (
              <p className="text-[10px] lg:text-sm text-muted-foreground line-through"> {/* 6. Smaller original price */}
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
      </div>
    </motion.div>
  );
};

export default ProductCard;