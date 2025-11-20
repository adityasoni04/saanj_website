import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

const AnimatedTick = () => {
  const circleVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const tickVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: 0.5, // Start after the circle is drawn
      },
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="w-24 h-24 mx-auto"
      aria-hidden="true"
    >
      {/* Background circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        className="stroke-green-100 dark:stroke-green-900"
        strokeWidth="4"
      />

      {/* Animated green circle */}
      <motion.circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        className="stroke-green-500"
        strokeWidth="4"
        strokeLinecap="round"
        variants={circleVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Animated tick path */}
      <motion.path
        d="M 30 52 L 45 67 L 70 42"
        fill="none"
        className="stroke-green-500"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={tickVariants}
        initial="hidden"
        animate="visible"
      />
    </motion.svg>
  );
};

/**
 * The main order success page component.
 */
const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl p-8 sm:p-12 w-full max-w-md text-center">
        {/* Animated Tick */}
        <AnimatedTick />

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mt-6 mb-3">
          Thank You!
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          Your order has been placed successfully.
        </p>

        {orderId ? (
          <p className="text-sm text-muted-foreground mb-8">
            Your Order ID is:{" "}
            <span className="font-medium text-primary">{orderId}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-8">
            You will receive an email confirmation shortly.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/all-categories" className="w-full">
            <Button size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/profile/orders" className="w-full"> {/* Adjust this route as needed */}
            <Button size="lg" variant="outline" className="w-full">
              View My Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;