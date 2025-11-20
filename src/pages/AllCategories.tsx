import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";

const AllCategories = () => {
  return (
    <div className="min-h-screen">
      <main className="pt-3">
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                All Categories
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse our complete collection of premium leather products
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-serif text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm text-white/90">
                        {category.subcategories?.length || 0} subcategories
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AllCategories;
