import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import productBriefcase1 from "@/assets/product-briefcase-1.jpg";
import productBriefcase2 from "@/assets/product-briefcase-2.jpg";
import productMessenger1 from "@/assets/product-messenger-1.jpg";
import productMessenger2 from "@/assets/product-messenger-2.jpg";
import productTote1 from "@/assets/product-tote-1.jpg";
import productTote2 from "@/assets/product-tote-2.jpg";
import productLaptop1 from "@/assets/product-laptop-1.jpg";
import productLaptop2 from "@/assets/product-laptop-2.jpg";
import { useGetFeaturedProducts } from "@/http-hooks/product";

const featuredProducts = [
  {
    productId: "executive-briefcase",
    name: "Executive Leather Briefcase",
    price: 24999,
    image1: productBriefcase1,
    image2: productBriefcase2,
    category: "Briefcases",
  },
  {
    productId: "classic-messenger-bag",
    name: "Classic Messenger Bag",
    price: 18999,
    image1: productMessenger1,
    image2: productMessenger2,
    category: "Messenger Bags",
  },
  {
    productId: "business-tote-bag",
    name: "Premium Business Tote",
    price: 21999,
    image1: productTote1,
    image2: productTote2,
    category: "Tote Bags",
  },
  {
    productId: "leather-laptop-bag",
    name: "Sleek Laptop Bag",
    price: 16999,
    image1: productLaptop1,
    image2: productLaptop2,
    category: "Laptop Bags",
  },
];

const FeaturedProducts = () => {
  // 2. Fetch data from backend
  const { data: products, isLoading, isError, error } = useGetFeaturedProducts();

  const renderSkeletons = () => {
    return [...Array(4)].map((_, index) => (
      <div key={index} className="flex flex-col gap-4 w-full">
        <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    ));
  };

  if (isError) {
    return (
      <section className="pt-6 pb-6 bg-background text-center text-red-500">
        <p>Unable to load collection. {error instanceof Error ? error.message : "Unknown error"}</p>
      </section>
    );
  }
  return (
    <section className="pt-6 pb-6 lg:pt-8 lg:pb-8 bg-background">
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium mb-3 tracking-wider text-sm">CURATED COLLECTION</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium leather bags, each crafted with meticulous attention to detail and timeless design.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {/* 5. Conditional Rendering: Skeleton OR Real Data */}
          {isLoading ? (
            renderSkeletons()
          ) : (
            products?.map((product) => (
              <ProductCard
                key={product._id}
                // --- FIX 1: Map Name ---
                // Backend has 'productName', Component wants 'name'
                name={product.productName}

                // --- FIX 2: Map Images ---
                // Backend likely has an array called 'images'. 
                // We take the first item for image1, and second for image2.
                image1={product.images?.[0] || ""}
                image2={product.images?.[1] || product.images?.[0] || ""}

                // --- Pass remaining matching props ---
                price={product.price}
                category={product.category}
                productId={product.productId}
              />
            ))
          )}

        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
