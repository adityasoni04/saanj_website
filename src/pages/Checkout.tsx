import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import Navbar from "@/components/Navbar"; // Uncomment if not in App.js
// import Footer from "@/components/Footer"; // Uncomment if not in App.js
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // <-- 1. IMPORTED Tooltip
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/http-hooks/auth";
import { useCreatePaymentOrder, useVerifyPayment } from "@/http-hooks/payment";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { BackendOrder } from "@/services/payment";
// --- Define Types ---
interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface PincodePostOffice {
  Name: string;
  District: string;
  State: string;
}

declare global {
  interface Window {
    Razorpay: any; // You can use 'any' for simplicity
  }
}
// --- Helper Functions ---
const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// --- 2. FIX: Defined missing variable ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Checkout = () => {
  // --- 3. FIX: Destructured isLoading ---
  const { items, totalPrice, clearCart, isLoading } = useCart();
  const navigate = useNavigate();
  // --- 4. FIX: Corrected typo ---
  const { toast } = useToast(); // Shadcn toast
  const { user, isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "", country: "India",
  });

  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreatePaymentOrder();
  const { mutateAsync: verifyOrder, isPending: isVerifyingPayment } = useVerifyPayment();

  // --- Form Validation ---
  const isFormValid = useMemo(() => {
    return (
      address.firstName.trim() !== "" &&
      address.lastName.trim() !== "" &&
      emailRegex.test(address.email) &&
      /^\d{10}$/.test(address.phone) &&
      address.address.trim() !== "" &&
      address.city.trim() !== "" &&
      address.state.trim() !== "" &&
      /^\d{6}$/.test(address.pincode) &&
      !pincodeError &&
      !pincodeLoading &&
      paymentMethod !== ""
    );
  }, [address, pincodeError, pincodeLoading, paymentMethod]);

  const isPlacingOrder = isCreatingOrder || isVerifyingPayment || pincodeLoading;

  // --- Pre-fill user data ---
  useEffect(() => {
    if (isAuthenticated && user) {
      // --- 5. FIX: Add type assertion for user object ---
      const typedUser = user as { email?: string; displayName?: string };

      setAddress((prev) => ({
        ...prev,
        email: typedUser.email || "",
        firstName: typedUser.displayName?.split(' ')[0] || "",
        lastName: typedUser.displayName?.split(' ').slice(1).join(' ') || "",
      }));
    }
  }, [isAuthenticated, user]);

  // --- Load Razorpay Script ---
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js")
      .then(loaded => {
        if (!loaded) sonnerToast.error("Failed to load payment gateway. Please refresh.");
      });
  }, []);

  // --- Pincode API Fetcher ---
  useEffect(() => {
    if (address.pincode.length === 6 && /^\d{6}$/.test(address.pincode)) {
      const fetchPincodeData = async () => {
        setPincodeLoading(true);
        setPincodeError(null);
        setCityOptions([]);

        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${address.pincode}`);
          if (!response.ok) throw new Error("Network response error");

          const data = await response.json();

          if (data && data[0].Status === "Success") {
            const postOffices: PincodePostOffice[] = data[0].PostOffice;
            const state = postOffices[0].State;
            const cities = [...new Set(postOffices.map(po => po.District))];

            setAddress(prev => ({ ...prev, state: state, city: "" }));
            setCityOptions(cities);
            if (cities.length === 1) {
              setAddress(prev => ({ ...prev, state: state, city: cities[0] }));
            }
          } else {
            setPincodeError("Invalid Pincode");
            setAddress(prev => ({ ...prev, state: "", city: "" }));
          }
        } catch (err) {
          setPincodeError("Failed to fetch pincode data.");
          setAddress(prev => ({ ...prev, state: "", city: "" }));
        } finally {
          setPincodeLoading(false);
        }
      };
      fetchPincodeData();
    } else if (address.pincode.length > 0 && address.pincode.length < 6) {
      setPincodeError("Pincode must be 6 digits.");
      setCityOptions([]);
      setAddress(prev => ({ ...prev, state: "", city: "" }));
    } else {
      setPincodeError(null);
      setCityOptions([]);
      setAddress(prev => ({ ...prev, state: "", city: "" }));
    }
  }, [address.pincode]);

  // --- Handlers ---
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'phone') {
      if (value === '' || /^\d{1,10}$/.test(value)) { setAddress({ ...address, [id]: value }); }
    } else if (id === 'pincode') {
      if (value === '' || /^\d{1,6}$/.test(value)) { setAddress({ ...address, [id]: value }); }
    } else {
      setAddress({ ...address, [id]: value });
    }
  };
  const handleCityChange = (value: string) => { setAddress({ ...address, city: value }); };

  // --- Main Payment Handler ---
  // --- Main Payment Handler ---
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Create the base order data
      const orderData = {
        products: items
          .filter(item => item.productId) // Ensures item.productId is not null
          .map(item => ({
            productId: item.productId!, // This is now safe
            quantity: item.quantity,
          })),
        shippingAddress: address,
        paymentMethod: paymentMethod as 'Razorpay' | 'COD', // <-- Pass the selected method
      };

      // Check if any products are left after filtering
      if (orderData.products.length === 0) {
        sonnerToast.error("No valid products in cart to order.");
        return;
      }

      // --- 2. LOGIC BRANCH ---
      if (paymentMethod === 'Razorpay') {
        // --- RAZORPAY FLOW ---
        const backendOrder: BackendOrder = await createOrder(orderData);

        if (!backendOrder.razorpayOrder) {
          sonnerToast.error("Failed to create Razorpay order ID. Please try again.");
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use import.meta.env
          amount: backendOrder.razorpayOrder.amount,
          currency: "INR",
          name: "SaanJ Creations",
          description: "Order Payment",
          image: "/logo.png",
          order_id: backendOrder.razorpayOrder.id,

          handler: async (response: any) => {
            try {
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };
              const verifyResponse = await verifyOrder(verificationData); // Get response
              clearCart();
              navigate("/order-success", {
                replace: true,
                // Pass the human-readable receipt ID to the success page
                state: { orderReceiptId: backendOrder.razorpayOrder.receipt }
              });
            } catch (verifyError: any) {
              sonnerToast.error(verifyError.message || "Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: `${address.firstName} ${address.lastName}`,
            email: address.email,
            contact: `+91${address.phone}`, // Add +91 prefix
          },
          theme: {
            color: "#4A2E22",
          },
        };

        const rzp = new window.Razorpay(options); // This will no longer error
        rzp.open();

        rzp.on('payment.failed', (response: any) => {
          console.error("Razorpay payment failed:", response.error);
          sonnerToast.error("Payment Failed: " + response.error.description);
        });

      } else if (paymentMethod === 'COD') {
        // --- COD FLOW ---
        // Just create the order. The backend will mark it as 'Processing'.
        const backendOrder: BackendOrder = await createOrder(orderData);

        sonnerToast.success("Order placed successfully!");
        clearCart();
        // Pass the receipt ID to the success page
        navigate("/order-success", {
          replace: true,
          state: { orderReceiptId: backendOrder.razorpayOrder?.receipt } // Use ?. for safety
        });
      }
    } catch (orderError: any) {
      sonnerToast.error(orderError.message || "Failed to create order.");
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      sonnerToast.error("Your cart is empty. Redirecting...");
      navigate("/cart");
    }
  }, [isLoading, items, navigate]);

  // Show a loading spinner if cart is still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Navbar /> */}
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <main className="pt-10 pb-16 flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl font-bold text-primary mb-8">Checkout</h1>

          <form onSubmit={handlePayment} className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                  Shipping Information
                </h2>
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={address.firstName} onChange={handleAddressChange} required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={address.lastName} onChange={handleAddressChange} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={address.email} onChange={handleAddressChange} required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone Number * (10 digits)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+91</span>
                      <Input id="phone" type="tel" value={address.phone} onChange={handleAddressChange} required className="pl-10" placeholder="9876543210" maxLength={10} />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" value={address.address} onChange={handleAddressChange} required placeholder="Flat, House no, Building, Street..." />
                  </div>

                  {/* --- Pincode Input with Validation --- */}
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <div className="relative">
                      <Input id="pincode" value={address.pincode} onChange={handleAddressChange} required maxLength={6} />
                      {pincodeLoading && (
                        <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                      {/* --- 7. FIX: Wrap AlertCircle in Tooltip --- */}
                      {!pincodeLoading && pincodeError && (
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-4 w-4 text-destructive absolute right-3 top-1/2 -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{pincodeError}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {!pincodeLoading && !pincodeError && address.pincode.length === 6 && (
                        <Check className="h-4 w-4 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {pincodeError && <p className="text-xs text-destructive mt-1">{pincodeError}</p>}
                  </div>

                  {/* --- State (Auto-filled) --- */}
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" value={address.state} disabled readOnly required className="bg-muted/50" />
                  </div>

                  {/* --- City (Dynamic Dropdown) --- */}
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Select
                      value={address.city}
                      onValueChange={handleCityChange}
                      required
                      disabled={cityOptions.length === 0 || pincodeLoading}
                    >
                      <SelectTrigger className="w-full" id="city">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cityOptions.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" value={address.country} onChange={handleAddressChange} disabled readOnly required className="bg-muted/50" />
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                  Payment Method *
                </h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 mb-4 p-4 border border-border rounded-lg has-[:checked]:border-accent has-[:checked]:ring-2 has-[:checked]:ring-accent">
                    <RadioGroupItem value="Razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="cursor-pointer text-base font-medium">
                      Pay Online (Cards, UPI, Netbanking)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-border rounded-lg has-[:checked]:border-accent has-[:checked]:ring-2 has-[:checked]:ring-accent">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label htmlFor="cod" className="cursor-pointer text-base font-medium">Cash on Delivery (COD)</Label>
                  </div>
                </RadioGroup>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-lg p-6 sticky top-28"
              >
                <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                  {/* --- 8. FIX: Filter out null items before mapping --- */}
                  {items
                    .filter(item => item.productId) // Only include items that have product data
                    .map((item) => (
                      <div key={item.productId as string} className="flex gap-3"> {/* Key is now safe */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                </div>
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-serif text-xl font-bold text-primary">Total</span>
                      <span className="font-serif text-xl font-bold text-primary">
                        ₹{totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full mt-6" disabled={!isFormValid || isPlacingOrder}>
                  {isPlacingOrder ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Place Order"
                  )}
                </Button>
                {!isFormValid && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Please fill in all required fields to place your order.
                  </p>
                )}
              </motion.div>
            </div>
          </form>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Checkout;