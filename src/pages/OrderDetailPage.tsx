import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/http-hooks/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Loader2,
    CreditCard,
    User as UserIcon,
    LogOut,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    Truck,
    Clock,
} from 'lucide-react';
import { useGetOrderById, useRequestExchange } from '@/http-hooks/order';
import { BackendOrder, PopulatedOrderProduct } from '@/services/order';
import { toast as sonnerToast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { ExchangeRequestModal } from '@/components/ExchangeRequestModal';

const OrderDetailPage = () => {
    const navigate = useNavigate();
    const { id: orderId } = useParams<{ id: string }>();
    const { user, isLoading: isAuthLoading, logout } = useAuth();
    const { data: order, isLoading: isOrderLoading, isFetching: isOrderFetching, isError, error } = useGetOrderById(orderId);
    const { mutate: doRequestExchange, isPending: isRequestingExchange } = useRequestExchange();
    const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
    // This is for the *initial* page load
    const isPageLoading = isAuthLoading || isOrderLoading;
    // This is for any subsequent background refresh
    const isRefreshing = isOrderFetching || isRequestingExchange; const typedUser = user as { displayName: string; email: string; image: string; role: string };

    useEffect(() => {
        if (isError && error) {
            sonnerToast.error(error.message || 'Failed to load order details.');
            navigate('/profile/orders');
        }
    }, [isError, error, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
        sonnerToast.success('You have been logged out.');
    };

    const handleSubmitExchange = (reason: string) => {
        doRequestExchange({ orderId: order!._id, reason }, {
            onSuccess: () => {
                setIsExchangeModalOpen(false); // Close modal on success
            },
            // onError is handled in the hook
        });
    };

    const getExchangeButton = () => {
        if (!order) return null;

        if (order.orderStatus === 'Delivered' && order.deliveredAt && order.exchangeStatus === 'None') {
            const deliveredAt = new Date(order.deliveredAt);
            const daysSinceDelivery = (new Date().getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24);

            if (daysSinceDelivery <= 7) {
                return (
                    <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => setIsExchangeModalOpen(true)}
                        disabled={isRequestingExchange}
                    >
                        {isRequestingExchange ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Request 7-Day Exchange
                    </Button>
                );
            } else {
                return <p className="text-sm text-muted-foreground mt-4">The 7-day exchange window has closed.</p>;
            }
        }

        if (order.exchangeStatus !== 'None') {
            return <p className="text-sm font-semibold text-accent mt-4">Exchange Status: {order.exchangeStatus}</p>;
        }

        return null;
    };

    // -------------------------
    // Payment Status Component
    // -------------------------
    const PaymentStatus = () => {
        if (!order) return null;

        if (order.isPaid) {
            return (
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-lg text-green-600">Payment Successful</span>
                </div>
            );
        }

        if (order.paymentMethod === 'COD') {
            return (
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold text-lg text-muted-foreground">Pay on Delivery</span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="font-semibold text-lg text-red-600">Payment Pending</span>
            </div>
        );
    };

    // -------------------------
    // Loading State
    // -------------------------
    if (isPageLoading || !order) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow flex items-center justify-center pt-24 pb-16">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </main>
            </div>
        );
    }

    const orderProducts = (order.products || []) as PopulatedOrderProduct[];
    const shipping = order.shippingAddress;

    // -------------------------
    // Page Render
    // -------------------------
    return (
        <div className="min-h-screen">
            <main className="pt-10 pb-16">
                <AnimatePresence>
                    {isRefreshing && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-24 right-4 z-50"
                        >
                            <div className="p-2 bg-card border border-border rounded-full shadow-lg">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-2 mb-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/profile/orders')}
                            aria-label="Back to orders"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Order Details</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* ---------------- Sidebar ---------------- */}
                        <aside className="lg:col-span-1">
                            <div className="bg-card border border-border rounded-lg p-4 sticky top-28">
                                {typedUser && (
                                    <div className="flex items-center gap-4 mb-6">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={typedUser.image} alt={typedUser.displayName} />
                                            <AvatarFallback className="text-2xl">
                                                {typedUser.displayName?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <h3 className="font-semibold text-lg truncate">{typedUser.displayName}</h3>
                                            <p className="text-sm text-muted-foreground truncate">{typedUser.email}</p>
                                        </div>
                                    </div>
                                )}
                                <nav className="flex flex-col space-y-2">
                                    <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/profile')}>
                                        <UserIcon className="h-4 w-4" /> My Profile
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="justify-start gap-2 text-primary bg-accent/20"
                                        onClick={() => navigate('/profile/orders')}
                                    >
                                        <CreditCard className="h-4 w-4" /> My Orders
                                    </Button>
                                    {typedUser?.role === 'admin' && (
                                        <Button
                                            variant="ghost"
                                            className="justify-start gap-2"
                                            onClick={() => navigate('/admin')}
                                        >
                                            <ShieldCheck className="h-4 w-4" /> Admin Panel
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        className="justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" /> Log Out
                                    </Button>
                                </nav>
                            </div>
                        </aside>

                        {/* ---------------- Main Content ---------------- */}
                        <main className="lg:col-span-3 space-y-6">
                            {/* Order Summary */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-card border border-border rounded-lg p-6"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Order ID</Label>
                                        <p className="font-semibold text-sm sm:text-base">{order.razorpayOrder?.receipt || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Date Placed</Label>
                                        <p className="font-semibold text-sm sm:text-base">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                                        <p className="font-semibold text-lg text-accent">
                                            ₹{(order.amount / 100).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Items List */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-card border border-border rounded-lg p-6"
                            >
                                <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                                    Items ({orderProducts.length})
                                </h2>
                                <div className="space-y-4">
                                    {orderProducts.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center">
                                            <img
                                                src={item.productDetails.images?.[0] || '/placeholder.png'}
                                                alt={item.productDetails.productName}
                                                className="w-20 h-20 object-cover rounded-lg bg-muted"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/product/${item.productDetails.productId}`}
                                                    className="font-semibold text-primary hover:text-accent hover:underline truncate"
                                                >
                                                    {item.productDetails.productName}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Price: ₹{(item.price / 100).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-primary text-lg">
                                                    ₹{((item.price / 100) * item.quantity).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Shipping + Payment Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Shipping Address */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-card border border-border rounded-lg p-6"
                                >
                                    <h2 className="font-serif text-2xl font-bold text-primary mb-4">Shipping Address</h2>
                                    <div className="space-y-1 text-muted-foreground">
                                        <p className="font-medium text-foreground">
                                            {shipping.firstName} {shipping.lastName}
                                        </p>
                                        <p>{shipping.address}</p>
                                        <p>
                                            {shipping.city}, {shipping.state} - {shipping.pincode}
                                        </p>
                                        <p>{shipping.country}</p>
                                        <p>Email: {shipping.email}</p>
                                        <p>Phone: {shipping.phone}</p>
                                    </div>
                                </motion.div>

                                {/* Payment & Status */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-card border border-border rounded-lg p-6"
                                >
                                    <h2 className="font-serif text-2xl font-bold text-primary mb-4">Payment & Status</h2>
                                    <div className="space-y-4">
                                        <PaymentStatus />

                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Order Status</Label>
                                            <p className="font-semibold text-primary">{order.orderStatus}</p>
                                        </div>

                                        {/* Tracking (Delhivery) */}
                                        {order.shippingInfo?.trackingId && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Tracking (Delhivery)</Label>
                                                <a
                                                    href={`https://www.delhivery.com/track/package/${order.shippingInfo.trackingId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 font-semibold text-primary hover:text-accent transition-colors"
                                                >
                                                    <span>{order.shippingInfo.trackingId}</span>
                                                    <Truck className="h-4 w-4" />
                                                </a>
                                            </div>
                                        )}

                                        {/* Payment ID */}
                                        {order.paymentInfo?.paymentId && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Payment ID</Label>
                                                <p className="font-mono text-xs text-foreground break-all">
                                                    {order.paymentInfo.paymentId}
                                                </p>
                                            </div>
                                        )}

                                        {/* Razorpay Order ID */}
                                        {order.razorpayOrder?.id && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">Razorpay Order ID</Label>
                                                <p className="font-mono text-xs text-foreground break-all">
                                                    {order.razorpayOrder.id}
                                                </p>
                                            </div>
                                        )}

                                        {/* Exchange Button */}
                                        {getExchangeButton()}
                                    </div>
                                </motion.div>
                            </div>
                        </main>
                    </div>
                </div>
            </main>
            <ExchangeRequestModal
                isOpen={isExchangeModalOpen}
                onClose={() => setIsExchangeModalOpen(false)}
                isSubmitting={isRequestingExchange}
                onSubmit={handleSubmitExchange}
            />
        </div>
    );
};

export default OrderDetailPage;
