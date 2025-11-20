import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import TrustBadges from "@/components/TrustBadges";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { categories } from "@/data/categories";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <main className="pt-16">
        <HeroSlider />
        <TrustBadges />

        {/* Categories Showcase */}
        <section className="pt-6 pb-6 lg:pt-8 lg:pb-8 bg-secondary/20">
          <div className="px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 lg:mb-16"
            >
              <p className="text-accent font-medium mb-3 tracking-wider text-sm">EXPLORE OUR RANGE</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                Shop by Category
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our extensive collection across multiple categories
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.slice(0, 8).map((category, index) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                      <h3 className="font-serif text-lg md:text-2xl font-bold">
                        {category.name}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/all-categories">
                <Button size="lg" variant="outline">
                  View All Categories
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <FeaturedProducts />
        <Testimonials />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Index;
