import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, User, Menu, ChevronDown, X, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/http-hooks/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { categories, Category } from "@/data/categories"; // Import Category type
import { useCart } from "@/contexts/CartContext";
import { useGetWishlist } from "@/http-hooks/wishlist"; // Adjust path
import { Link } from "react-router-dom"; // Import Link for mobile menu
import logo from "@/assets/sj.png";

interface AuthUser {
  displayName: string;
  email: string;
  image: string;
  role: string;
}

// --- 1. NEW: Mobile Accordion Item ---
// This sub-component handles the nested accordion logic for the mobile menu.
interface AccordionItemProps {
  category: Category;
  onCloseMenu: () => void; // Function to close the main mobile menu on navigate
}

const MobileCategoryAccordion = ({ category, onCloseMenu }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior if it's just a toggle
    if (hasSubcategories) {
      setIsOpen(!isOpen); // Toggle sub-menu
    } else {
      navigate(`/category/${category.slug}`); // Navigate if no sub-menu
      onCloseMenu();
    }
  };

  const handleSubCategoryClick = (slug: string) => {
    navigate(slug);
    onCloseMenu();
  };

  return (
    <div className="border-b border-border">
      {/* Main Category Button */}
      <a
        href={`/category/${category.slug}`}
        onClick={handleCategoryClick}
        className="flex items-center justify-between w-full py-3 text-base font-medium text-foreground hover:bg-muted"
      >
        <span>{category.name}</span>
        {hasSubcategories && (
          <ChevronDown
            className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </a>
      {/* Subcategory List */}
      <AnimatePresence>
        {isOpen && hasSubcategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-4"
          >
            <div className="pb-3 pt-1 space-y-1">
              <Link
                to={`/category/${category.slug}`}
                onClick={() => handleSubCategoryClick(`/category/${category.slug}`)}
                className="block text-sm font-medium text-muted-foreground hover:text-accent p-2 rounded-md"
              >
                View All {category.name}
              </Link>
              {category.subcategories!.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/category/${category.slug}/${sub.slug}`}
                  onClick={() => handleSubCategoryClick(`/category/${category.slug}/${sub.slug}`)}
                  className="block text-sm text-muted-foreground hover:text-accent p-2 rounded-md"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- 2. Main Navbar Component ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false); // New state for mobile category accordion
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const categoryTimer = useRef<NodeJS.Timeout | null>(null);
  const navbarRef = useRef<HTMLElement>(null); // Ref to get navbar height
  const [navbarHeight, setNavbarHeight] = useState(73); // Default height
  const navigate = useNavigate();
  const location = useLocation();

  const { totalItems, isLoading: isLoadingCart } = useCart();
  const { user, isAuthenticated, isLoading: isLoadingAuth, loginWithGoogle, logout } = useAuth();
  const typedUser = user as AuthUser | null;
  const { data: wishlist, isLoading: isLoadingWishlist } = useGetWishlist();
  const wishlistCount = wishlist?.items?.length || 0;

  const isLoading = isLoadingAuth;

  // Handlers
  const handleCategoryEnter = () => { if (categoryTimer.current) clearTimeout(categoryTimer.current); setCategoryMenuOpen(true); };
  const handleCategoryLeave = () => { categoryTimer.current = setTimeout(() => { setCategoryMenuOpen(false); }, 150); };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); // <-- This is the key
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Combined function to close search and clear query
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }

  // --- Effects ---
  useEffect(() => {
    if (isAuthenticated && authModalOpen) setAuthModalOpen(false);
  }, [isAuthenticated, authModalOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get navbar height for positioning mobile search
  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [scrolled]); // Recalculate if height changes on scroll (it shouldn't, but safe)

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    closeSearch(); // Use closeSearch to also clear query
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Admin", href: "/admin" },
  ];

  const navLinks1 = navLinks.filter(link => link.name === "Home");

  const navLinks2 = navLinks.filter(link =>
    link.name !== "Home" &&
    (link.name !== "Admin" || (isAuthenticated && typedUser?.role === 'admin'))
  );

  return (
    <>
      <motion.nav
        ref={navbarRef} // Add ref to the nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-soft"
          : "bg-background border-b border-border"
          }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between relative">
            {/* Left Section (Logo & Mobile Menu) */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <img
                  src={logo}
                  alt="SaanJ Logo"
                  className="h-8 w-auto object-contain relative top-[1px]"
                />
                <span className="hidden md:inline font-serif text-2xl md:text-3xl font-bold text-primary leading-none relative top-[-1px]">
                  SaanJ
                </span>
              </div>
            </div>

            {/* Center Section (Desktop Nav Links or Search Bar) */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-auto max-w-lg"> {/* Made wider */}
              <AnimatePresence mode="wait">
                {!isSearchOpen ? (
                 <motion.div
  key="nav-links"
  className="flex items-center gap-8"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
>
  {/* --- GROUP 1: HOME --- */}
  {navLinks1.map((link) => (
    <a
      key={link.name}
      href={link.href}
      onClick={(e) => {
        e.preventDefault();
        navigate(link.href);
      }}
      className={`transition-all text-sm whitespace-nowrap ${
        location.pathname === link.href
          ? "font-bold text-accent"
          : "font-medium text-foreground hover:text-accent"
      }`}
    >
      {link.name}
    </a>
  ))}

  {/* --- CATEGORIES DROPDOWN (Sandwiched in the middle) --- */}
  <div onMouseEnter={handleCategoryEnter} onMouseLeave={handleCategoryLeave}>
    <DropdownMenu open={categoryMenuOpen} onOpenChange={setCategoryMenuOpen}>
      <DropdownMenuTrigger
        onClick={() => navigate("/all-categories")}
        className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent transition-all outline-none"
      >
        Categories <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-background border-border max-h-[500px] overflow-y-auto">
        {categories.map((c) => (
          <DropdownMenuSub key={c.id}>
            <DropdownMenuSubTrigger className="cursor-pointer">
              {c.name}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-background border-border">
              <DropdownMenuItem
                onClick={() => navigate(`/category/${c.slug}`)}
                className="cursor-pointer"
              >
                View All {c.name}
              </DropdownMenuItem>
              {c.subcategories?.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => navigate(`/category/${c.slug}/${s.slug}`)}
                  className="cursor-pointer"
                >
                  {s.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  {/* --- GROUP 2: ABOUT, CONTACT, ADMIN --- */}
  {navLinks2.map((link) => (
    <a
      key={link.name}
      href={link.href}
      onClick={(e) => {
        e.preventDefault();
        navigate(link.href);
      }}
      className={`transition-all text-sm whitespace-nowrap ${
        location.pathname === link.href
          ? "font-bold text-accent"
          : "font-medium text-foreground hover:text-accent"
      }`}
    >
      {link.name}
    </a>
  ))}
</motion.div>
                ) : (
                  <motion.form
                    key="search-bar-desktop"
                    className="flex-1 w-full"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSearchSubmit}
                  >
                    {/* --- 2. "X" INSIDE DESKTOP SEARCH --- */}
                    <div className="relative w-full">
                      <input type="text" placeholder="Search for products..." className="w-full pl-10 pr-10 py-2 rounded-full border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                      <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" onClick={closeSearch} title="Close search">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Right Section: Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* --- 1. Search Icon (Always Search) --- */}
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Toggle search">
                <Search className="h-5 w-5" />
              </Button>

              {/* Auth Button/Avatar */}
              {isLoadingAuth ? (
                <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                      <Avatar className="h-8 w-8"> <AvatarImage src={typedUser?.image} alt={typedUser?.displayName} /> <AvatarFallback>{typedUser?.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback> </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border">
                    <DropdownMenuItem disabled className="font-normal">
                      <div className="flex flex-col">
                        <span className="font-medium">{typedUser?.displayName}</span>
                        <span className="text-xs text-muted-foreground">{typedUser?.email}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer"> My Profile </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile/orders')} className="cursor-pointer"> My Orders </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"> <LogOut className="mr-2 h-4 w-4" /> Log Out </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setAuthModalOpen(true)} aria-label="Login"> <User className="h-5 w-5" /> </Button>
              )}

              {/* Wishlist Button */}
              {isAuthenticated && (
                <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/wishlist")} aria-label={`View Wishlist (${wishlistCount} items)`}>
                  <Heart className="h-5 w-5" />
                  {/* --- 4. Badge Position Fix --- */}
                  {!isLoadingWishlist && wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium pointer-events-none">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              )}

              {/* Cart Button */}
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/cart")} aria-label={`View Cart (${totalItems} items)`}>
                <ShoppingCart className="h-5 w-5" />
                {/* --- 4. Badge Position Fix --- */}
                {!isLoadingCart && totalItems > 0 && (
                  <span className="absolute top-1 right-1 translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium pointer-events-none">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* --- 1. NEW: Mobile Search Panel (Slides from below navbar) --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.form
            key="mobile-search-panel"
            initial={{ y: `-${navbarHeight}px`, opacity: 0 }} // Start hidden *above* its final position
            animate={{ y: `${navbarHeight}px`, opacity: 1 }} // Animate to y=navbarHeight (below nav)
            exit={{ y: `-${navbarHeight}px`, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            // Positioned *below* the navbar
            className="fixed top-0 left-0 right-0 p-4 bg-background border-b border-border shadow-lg z-40 md:hidden" // Only on mobile
            onSubmit={handleSearchSubmit}
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-10 py-3 rounded-full border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-5 w-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              {/* --- 2. "X" to CLOSE mobile search --- */}
              <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full" onClick={closeSearch} title="Close search">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>


      {/* --- 3. NEW: Mobile Menu Overlay (with Accordion) --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed inset-0 z-[60] bg-background p-6 md:hidden overflow-y-auto" // Higher z-index
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="SaanJ Logo"
                  className="h-8 w-auto object-contain relative top-[1px]"
                />
                <h1 className="font-serif text-2xl font-bold text-primary leading-none relative top-[-1px]">
                  SaanJ
                </h1>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col divide-y divide-border">
              {navLinks.filter((link) => link.name !== "Admin" || (isAuthenticated && typedUser?.role === 'admin')).map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)} // Close on navigate
                  className={`text-lg font-medium py-4 ${location.pathname === link.href ? 'text-accent' : 'text-foreground hover:text-accent'}`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Categories Accordion */}
              <div className="pt-4">
                <button
                  onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                  className="flex items-center justify-between w-full py-4 text-lg font-medium text-foreground"
                >
                  <span>Categories</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isMobileCategoryOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isMobileCategoryOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-2 border-l border-border"
                    >
                      {categories.map((category) => (
                        <MobileCategoryAccordion
                          key={category.id}
                          category={category}
                          onCloseMenu={() => setIsMobileMenuOpen(false)} // Pass closer function
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Login/Logout Modal (Unchanged) --- */}
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader> <DialogTitle className="text-2xl font-serif text-center"> {isAuthenticated ? `Welcome, ${typedUser?.displayName}` : "Welcome to Saanj"} </DialogTitle> </DialogHeader>
          {isAuthenticated ? (
            <div className="flex flex-col items-center gap-6 py-6">
              <p className="text-muted-foreground text-center text-sm"> You are currently logged in as {typedUser?.email}. </p>
              <Button variant="destructive" className="w-full py-6" onClick={() => { logout(); setAuthModalOpen(false); }}> <LogOut className="mr-2 h-4 w-4" /> Log Out </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 py-6">
              <p className="text-muted-foreground text-center text-sm"> Sign in to access your account and manage your orders </p>
              <Button variant="outline" className="w-full flex items-center gap-3 py-6 hover:bg-accent/10" onClick={loginWithGoogle}>
                <svg className="w-5 h-5" viewBox="0 0 48 48"> <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path> <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h12.8c-.57 2.73-2.21 4.97-4.54 6.51l7.38 5.71C44.97 35.53 46.98 30.49 46.98 24.55z"></path> <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path> <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.38-5.71c-2.11 1.41-4.8 2.26-7.51 2.26-5.26 0-9.74-3.51-11.33-8.19l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path> <path fill="none" d="M0 0h48v48H0z"></path> </svg>
                <span className="font-medium">Login with Google</span>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;