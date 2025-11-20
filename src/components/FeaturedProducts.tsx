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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.productId} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
