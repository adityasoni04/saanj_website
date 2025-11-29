import { Facebook, Instagram, Twitter, Linkedin, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Use Link for client-side navigation
import logo from "@/assets/sj-white.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className=" px-4 pt-6 pb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Column 1: Brand & Socials */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src={logo}
                alt="SaanJ Logo"
                className="h-10 w-auto object-contain relative top-[1px]"
              />
              <h3 className="font-serif text-3xl font-bold relative top-[-1px]">
                SaanJ
              </h3>
            </div>
            <p className="text-primary-foreground/80 mb-6">
              Crafting a diverse range of premium lifestyle accessories and corporate gifts with sophisticated design and exceptional quality.            </p>
            <div className="flex gap-3">
              {/* --- 1. MODIFIED BUTTONS --- */}
              <a href="https://instagram.com/saanj1808" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-primary-foreground/10 border-primary-foreground/20 
                             hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
              {/* <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-primary-foreground/10 border-primary-foreground/20 
                             hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-primary-foreground/10 border-primary-foreground/20 
                             hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              </a> */}
              {/* --- END MODIFIED BUTTONS --- */}
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/all-categories" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">All Categories</Link></li>
              <li><Link to="/category/leather-bags" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">Leather Bags</Link></li>
              <li><Link to="/category/bar-hotel-accessories" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">Bar Accessories</Link></li>
              <li><Link to="/category/pure-leather-gifts" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">Gift Sets</Link></li>
              <li><Link to="/category/mens-wallets" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">Men's Wallets</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Company Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li><Link to="/terms-of-service" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="text-primary-foreground/80 hover:text-accent font-medium transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm text-center sm:text-left">
            © 2025 SaanJ Creations, All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/60">Secure Payments</span>
            <CreditCard className="h-5 w-5 text-primary-foreground/60" />
            <ShieldCheck className="h-5 w-5 text-primary-foreground/60" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

//  responsive
// wishlist ,  cart etc.