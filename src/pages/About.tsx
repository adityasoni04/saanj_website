import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <main className="pt-24 pb-16">
        <div className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            // className="max-w-4xl mx-auto"
          >
            <h1 className="font-serif text-5xl font-bold text-primary mb-8 text-center">
              About Saanj
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg mb-6">
                Welcome to Saanj - House of Bags, where craftsmanship meets elegance. Since our inception, 
                we have been dedicated to creating premium leather goods that stand the test of time.
              </p>

              <h2 className="font-serif text-3xl font-bold text-primary mt-12 mb-4">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-6">
                Founded with a passion for quality and design, Saanj has grown from a small workshop to 
                a trusted name in premium leather goods. Our journey is built on the principles of excellence, 
                authenticity, and customer satisfaction.
              </p>

              <h2 className="font-serif text-3xl font-bold text-primary mt-12 mb-4">
                Our Commitment
              </h2>
              <p className="text-muted-foreground mb-6">
                Every product at Saanj is crafted with meticulous attention to detail. We source the finest 
                materials and work with skilled artisans to ensure each piece meets our high standards of 
                quality and durability.
              </p>

              <h2 className="font-serif text-3xl font-bold text-primary mt-12 mb-4">
                Quality Assurance
              </h2>
              <p className="text-muted-foreground mb-6">
                We believe in creating products that last. Each item undergoes rigorous quality checks 
                to ensure it meets our standards before reaching you. Our commitment to quality is unwavering, 
                and we stand behind every product we sell.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default About;
