import { motion } from "framer-motion";
import { Award, Truck, Shield, Users } from "lucide-react";

const badges = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Handcrafted with finest materials",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹5,000",
  },
  {
    icon: Shield,
    title: "Corporate Experts",
    description: "Trusted for bulk & custom orders",
  },
  {
    icon: Users,
    title: "Best Sellers",
    description: "Trusted by thousands",
  },
];

const TrustBadges = () => {
  return (
    // Uses smaller padding on mobile (py-10) and larger on desktop (lg:py-14)
    <section className="pt-10 pb-6 lg:pt-14 lg:pb-8 bg-secondary/30">
      <div className="px-4">
        {/*
          This grid will be 2 columns by default (mobile)
          and 4 columns on large screens (lg) and up.
        */}
        {/* Uses a smaller gap on mobile (gap-4) and larger on desktop (lg:gap-8) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // Uses smaller padding on mobile (p-4) and larger on desktop (lg:p-6)
              className="flex flex-col items-center text-center p-4 lg:p-6 rounded-lg bg-card hover:shadow-elegant transition-shadow"
            >
              {/* Responsive icon container */}
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <badge.icon className="h-6 w-6 lg:h-7 lg:w-7 text-accent" />
              </div>
              {/* Responsive title text */}
              <h3 className="font-serif text-md lg:text-xl font-semibold text-primary mb-2">
                {badge.title}
              </h3>
              {/* Cleaner description text size */}
              <p className="text-muted-foreground text-sm">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;