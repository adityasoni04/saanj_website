import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "CEO, Tech Solutions",
    content: "The craftsmanship is exceptional. My briefcase from Saanj has become my daily companion for over two years now, and it still looks brand new.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Architect",
    content: "I've never owned a bag this elegant. The attention to detail and quality of leather is outstanding. Worth every rupee!",
    rating: 5,
  },
  {
    name: "Vikram Mehta",
    role: "Business Consultant",
    content: "Saanj delivers on their promise of premium quality. The messenger bag I purchased exceeded my expectations in every way.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="pt-6 pb-10 lg:pt-8 lg:pb-16 bg-secondary/30">
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-16"
        >
          <p className="text-accent font-medium mb-3 tracking-wider text-sm">CLIENT STORIES</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 md:p-8 rounded-lg shadow-soft hover:shadow-elegant transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-primary">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
