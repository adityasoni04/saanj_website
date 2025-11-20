import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SearchX } from "lucide-react"; // A nice icon for "not found"
import { Button } from "@/components/ui/button";

// Note: I am assuming Navbar and Footer are in your App.js and not needed here.
// If they are NOT in App.js, you must import and add them here.

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // This console log is helpful for debugging
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> --- Add if not in App.js --- */}

      {/* This main tag will center the content vertically */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-16">
        <div className="container mx-auto px-4 py-20 text-center">

          <SearchX className="h-24 w-24 mx-auto text-muted-foreground mb-6" />

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Oops! Page Not Found
          </h1>

          <p className="text-7xl font-bold text-accent opacity-50 mb-6">404</p>

          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link to="/">
            <Button size="lg">Return to Home</Button>
          </Link>

        </div>
      </main>
    </div>
  );
};

export default NotFound;