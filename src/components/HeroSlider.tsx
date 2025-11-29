import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBag1 from "@/assets/hero-bag-1.jpg";
import heroBag2 from "@/assets/hero-bag-2.jpg";
import heroBag3 from "@/assets/hero-bag-3.jpg";
import categoryMensWallets from "@/assets/category-mens-wallets.jpg";
import categoryLadiesWallets from "@/assets/category-ladies-wallets.jpg";
import categoryLeatherGifts from "@/assets/category-leather-gifts.jpg";

const slides = [
  {
    image: heroBag1,
    title: "Executive Briefcase Collection",
    subtitle: "Handcrafted Excellence for the Modern Professional",
    link: "/category/leather-bags",
  },
  {
    image: heroBag2,
    title: "Classic Messenger Bags",
    subtitle: "Timeless Design Meets Contemporary Functionality",
    link: "/category/pu-bags",
  },
  {
    image: heroBag3,
    title: "Premium Business Totes",
    subtitle: "Sophisticated Elegance for Every Journey",
    link: "/category/leather-bags",
  },
  {
    image: categoryMensWallets,
    title: "Luxury Men's Wallets",
    subtitle: "Refined Craftsmanship for the Distinguished Gentleman",
    link: "/category/mens-wallets",
  },
  {
    image: categoryLadiesWallets,
    title: "Elegant Ladies Collection",
    subtitle: "Exquisite Designs for the Modern Woman",
    link: "/category/ladies-wallets",
  },
  {
    image: categoryLeatherGifts,
    title: "Pure Leather Gift Sets",
    subtitle: "Premium Executive Gifts for Every Occasion",
    link: "/category/leather-gifts",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      // Mobile: h-[75svh]
      // Desktop: h-screen
      className="relative h-[75svh] min-h-[550px] md:h-screen w-full overflow-hidden bg-background cursor-pointer group"
      onClick={() => navigate(slides[currentSlide].link)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent md:from-black/70 md:via-black/40 z-10" />
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 container mx-auto px-6 md:px-4 h-full flex items-center">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl w-full md:w-auto"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-accent font-medium mb-3 md:mb-4 tracking-wider text-xs md:text-sm uppercase"
          >
            PREMIUM COLLECTION
          </motion.p>
          
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            {slides[currentSlide].title}
          </h2>
          
          <p className="text-sm sm:text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-xs sm:max-w-lg leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>
          
          <Button
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              navigate(slides[currentSlide].link);
            }}
            className="
              w-full md:w-auto
              bg-gradient-to-r from-[#4A2C1F] to-[#7A583F] 
              text-white 
              shadow-xl 
              transition-all duration-300 ease-in-out 
              hover:bg-gradient-to-l 
              hover:from-[#7A583F] 
              hover:to-[#4A2C1F]
              hover:scale-[1.03] 
              hover:shadow-2xl"
          >
            Explore Collection
          </Button>
        </motion.div>
      </div>

      {/* ==========================================
          DESKTOP BUTTONS (Bottom Right)
          Standard Size + Accent Hover
      ========================================== */}
      <div className="absolute bottom-8 right-8 z-20 md:flex gap-3 hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground rounded-full transition-colors duration-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground rounded-full transition-colors duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* ==========================================
          MOBILE BUTTONS (Vertical Center)
          Smaller Size (h-8 w-8) + Accent Hover
      ========================================== */}
      <Button
        variant="outline"
        size="icon"
        onClick={prevSlide}
        className="md:hidden absolute top-1/2 -translate-y-1/2 left-2 z-20 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground p-0 transition-colors duration-300"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={nextSlide}
        className="md:hidden absolute top-1/2 -translate-y-1/2 right-2 z-20 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground p-0 transition-colors duration-300"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-6 bg-accent"
                : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;