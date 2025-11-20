import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import categoryBriefcases from "@/assets/category-briefcases.jpg";
import categoryMessenger from "@/assets/category-messenger.jpg";
import categoryTotes from "@/assets/category-totes.jpg";
import categoryLaptop from "@/assets/category-laptop.jpg";

const categories = [
  {
    name: "Briefcases",
    image: categoryBriefcases,
    description: "Professional elegance",
    slug: "briefcases",
  },
  {
    name: "Messenger Bags",
    image: categoryMessenger,
    description: "Casual sophistication",
    slug: "messenger-bags",
  },
  {
    name: "Tote Bags",
    image: categoryTotes,
    description: "Versatile style",
    slug: "tote-bags",
  },
  {
    name: "Laptop Bags",
    image: categoryLaptop,
    description: "Modern protection",
    slug: "laptop-bags",
  },
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent font-medium mb-3 tracking-wider text-sm">EXPLORE BY STYLE</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Shop by Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/category/leather-bags/${category.slug}`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="text-sm text-white/90 mb-2 font-medium tracking-wide">{category.description}</p>
                  <h3 className="font-serif text-3xl font-bold mb-4">{category.name}</h3>
                  <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-4 transition-all">
                    Shop Now
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
