import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/categories"; // Keep for UI elements like breadcrumbs
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { useGetProducts } from "@/http-hooks/product"; // Import your flexible data fetching hook
import { toast as sonnerToast } from "sonner";

// Define the type for a product coming from the backend
interface BackendProduct {
  _id: string;
  productId: string;
  productName: string;
  price: number;
  images: string[];
  category: string;
  subcategory?: string;
}

const CategoryPage = () => {
  // 1. Get BOTH slugs from the URL. subcategorySlug will be undefined if not present.
  const { categorySlug, subcategorySlug } = useParams();

  // 2. Pass BOTH slugs to the useGetProducts hook.
  // The hook will call the correct API endpoint based on which slugs are provided.
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useGetProducts(categorySlug, subcategorySlug);

  // 3. Get static data for UI display (breadcrumbs, title, etc.)
  const category = categories.find((cat) => cat.slug === categorySlug);
  const subcategory = category?.subcategories?.find((sub) => sub.slug === subcategorySlug);

  // 4. Handle fetch errors
  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching products:", error);
      sonnerToast.error(error.message || "Failed to load products.");
    }
  }, [isError, error]);

  // 5. "Category Not Found" logic
  if (!isLoading && !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
            <Link to="/"><Button>Back to Home</Button></Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="pt-24 pb-16 flex-grow">
        {/* Breadcrumb - This logic already handles both cases */}
        <div className="container mx-auto px-4 mb-4 md:mb-8">
          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            {category && (
              <>
                <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <Link to={`/category/${category.slug}`} className={`hover:text-accent transition-colors ${!subcategory ? 'text-foreground font-medium' : ''}`}>
                  {category.name}
                </Link>
              </>
            )}
            {subcategory && (
              <>
                <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="text-foreground font-medium">{subcategory.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Category Header - This logic already handles both cases */}
        <div className="container mx-auto px-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              {subcategory?.name || category?.name || "Products"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our premium collection of {subcategory?.name.toLowerCase() || category?.name.toLowerCase() || "products"}
            </p>
          </motion.div>
        </div>

        {/* Subcategories Links - This correctly hides when on a subcategory page */}
        {!subcategorySlug && category?.subcategories && category.subcategories.length > 0 && (
          <div className="container mx-auto px-4 mb-8">
            <h2 className="text-2xl font-serif font-bold mb-3">Shop by Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.subcategories.map((sub) => (
                <Link key={sub.id} to={`/category/${category.slug}/${sub.slug}`} className="p-4 sm:p-6 bg-card border border-border rounded-lg hover:shadow-elegant transition-all hover:border-accent">
                  <h3 className="font-medium text-center text-sm sm:text-base">{sub.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid with Loading/Error States */}
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : isError ? (
            <div className="text-center py-20"><p className="text-destructive text-lg mb-6">Could not load products.</p><Button onClick={() => window.location.reload()}>Refresh Page</Button></div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {products.map((product: BackendProduct) => (
                <ProductCard
                  key={product.productId}
                  name={product.productName}
                  price={product.price}
                  image1={product.images?.[0]}
                  image2={product.images?.[1] || product.images?.[0]}
                  category={product.category}
                  productId={product.productId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-6">No products available in this {subcategory ? 'subcategory' : 'category'} yet.</p>
              <Link to={subcategory ? `/category/${category?.slug}` : "/"}>
                <Button variant="outline">{subcategory ? `Back to ${category?.name}` : "Continue Shopping"}</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;