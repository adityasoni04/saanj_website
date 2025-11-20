import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useForm, ValidationError } from "@formspree/react"; // Import Formspree hooks

const Contact = () => {
  // Initialize Formspree's useForm hook with your form ID
  // Replace "mvgwnvzb" with your actual Formspree form ID if it's different
  const [state, handleSubmit] = useForm("mvgwnvzb");

  return (
    <div className="min-h-screen">
      <main className="pt-24 pb-16">
        <div className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
          >
            <h1 className="font-serif text-5xl font-bold text-primary mb-4 text-center">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-center mb-12">
              Have questions? We'd love to hear from you.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                {/* Conditional rendering: Show success message or the form */}
                {state.succeeded ? (
                  <div className="flex flex-col items-center justify-center h-full bg-secondary/20 p-8 rounded-lg">
                    <h3 className="font-serif text-2xl font-bold text-primary text-center">
                      Thanks for your query!
                    </h3>
                    <p className="text-muted-foreground text-center mt-2">
                      We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name" // Important: `name` attribute maps to formspree field
                        placeholder="Your name"
                        required
                      />
                      {/* Formspree's ValidationError component for name field */}
                      <ValidationError
                        prefix="Name"
                        field="name"
                        errors={state.errors}
                        className="text-destructive text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        name="email" // Important: `name` attribute maps to formspree field
                        placeholder="your.email@example.com"
                        required
                      />
                      {/* Formspree's ValidationError component for email field */}
                      <ValidationError
                        prefix="Email"
                        field="email"
                        errors={state.errors}
                        className="text-destructive text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone" // Important: `name` attribute maps to formspree field
                        placeholder="+91 98765 43210"
                      />
                      {/* Optional: Add ValidationError for phone if needed */}
                      <ValidationError
                        prefix="Phone"
                        field="phone"
                        errors={state.errors}
                        className="text-destructive text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message" // Important: `name` attribute maps to formspree field
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        required
                      />
                      {/* Formspree's ValidationError component for message field */}
                      <ValidationError
                        prefix="Message"
                        field="message"
                        errors={state.errors}
                        className="text-destructive text-sm mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#c49a6c] to-[#8b5e34] hover:from-[#b07b42] hover:to-[#5a3d1c] text-white transition-all duration-300 shadow-md hover:shadow-lg"
                      size="lg"
                      disabled={state.submitting}
                    >
                      {state.submitting ? "Sending Query..." : "Send Query"}
                    </Button>

                  </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                    Get in Touch
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Our team is here to help you with any questions about our
                    products or services.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">creationssaanj@gmail.com</p>
                    </div>
                  </div>

                  {/* <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        123 Leather Lane
                        <br />
                        Mumbai, Maharashtra 400001
                        <br />
                        India
                      </p>
                    </div>
                  </div> */}
                </div>

                <div className="bg-secondary/20 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <p className="text-muted-foreground text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;