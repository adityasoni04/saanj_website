import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar"; // You may not need this if it's in App.js
import Footer from "@/components/Footer"; // You may not need this if it's in App.js
import ProductCard from "@/components/ProductCard"; // <-- YOUR CARD COMPONENT
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetProducts } from "@/http-hooks/product";
import { toast as sonnerToast } from "sonner";

// Define your product type (you can move this to a types file)
interface BackendProduct {
  _id: string;
  productId: string;
  productName: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock?: number; // Added stock
  // ... any other fields ProductCard needs
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; // Get the 'q' param from URL

  // --- Fetch data using the hook ---
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useGetProducts(undefined, undefined, query); // Pass query to the 3rd argument

  // --- Handle Fetch Error ---
  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching search results:", error);
      sonnerToast.error(error.message || "Failed to load search results.");
    }
  }, [isError, error]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="pt-10 pb-8 flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            Search Results
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            {isLoading ? "Searching..." : `Showing ${products.length} results for "${query}"`}
          </p>

          {/* Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="text-center py-20">
                <p className="text-destructive text-lg mb-6">Could not load results. Please try again.</p>
                <Button onClick={() => window.location.reload()}>Refresh</Button>
              </div>
            ) : products.length > 0 ? (
              // --- HERE YOU RENDER YOUR PRODUCT CARDS ---
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {products.map((product: BackendProduct) => (
                  <ProductCard
                    key={product.productId}
                    name={product.productName}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image1={product.images?.[0]}
                    image2={product.images?.[1] || product.images?.[0]}
                    category={product.category}
                    productId={product.productId}
                  />
                ))}
              </div>
            ) : (
              // --- No Results Found ---
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-6">
                  Sorry, we found no results for "{query}".
                </p>
                <Link to="/all-categories">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;