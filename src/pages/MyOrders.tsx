import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/http-hooks/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, CreditCard, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import { useGetUserOrders } from '@/http-hooks/order'; // Import your orders hook
import { toast as sonnerToast } from 'sonner';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const MyOrders = () => {
    const navigate = useNavigate();
    const { user, isLoading: isAuthLoading, logout } = useAuth();

    // Fetch orders
    const { data: orders = [], isLoading: isOrdersLoading, isError, error } = useGetUserOrders();

    const isLoading = isAuthLoading || isOrdersLoading;

    // Handle fetch error
    useEffect(() => {
        if (isError && error) {
            console.error("Error fetching orders:", error);
            sonnerToast.error(error.message || "Failed to load orders.");
        }
    }, [isError, error]);

    const handleLogout = () => {
        logout();
        navigate('/');
        sonnerToast.success("You have been logged out.");
    };

    const typedUser = user as { displayName: string, email: string, image: string, role: string };

    return (
        <div className="min-h-screen">
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="font-serif text-4xl font-bold text-primary mb-8">
                            My Account
                        </h1>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* --- Sidebar --- */}
                        <aside className="lg:col-span-1">
                            <div className="bg-card border border-border rounded-lg p-4 sticky top-28">
                                {isLoading ? (
                                    <div className="flex items-center gap-4 mb-6">
                                        <Skeleton className="h-16 w-16 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-40" />
                                        </div>
                                    </div>
                                ) : typedUser && (
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
                                        <UserIcon className="h-4 w-4" />
                                        My Profile
                                    </Button>
                                    <Button variant="ghost" className="justify-start gap-2 text-primary bg-accent/20">
                                        <CreditCard className="h-4 w-4" />
                                        My Orders
                                    </Button>
                                    {typedUser?.role === 'admin' && (
                                        <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/admin')}>
                                            <ShieldCheck className="h-4 w-4" />
                                            Admin Panel
                                        </Button>
                                    )}
                                    <Button variant="ghost" className="justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4" />
                                        Log Out
                                    </Button>
                                </nav>
                            </div>
                        </aside>

                        {/* --- Main Content --- */}
                        <main className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-card border border-border rounded-lg p-6 lg:p-8"
                            >
                                <h2 className="font-serif text-2xl font-bold text-primary mb-6">
                                    My Orders
                                </h2>
                                {isOrdersLoading ? (
                                    <div className="space-y-4">
                                        <Skeleton className="h-16 w-full" />
                                        <Skeleton className="h-16 w-full" />
                                        <Skeleton className="h-16 w-full" />
                                    </div>
                                ) : isError ? (
                                    <p className="text-destructive">Failed to load orders. Please try again.</p>
                                ) : orders.length === 0 ? (
                                    <p className="text-muted-foreground">You have not placed any orders yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order: any) => ( // Use 'any' for now, or your BackendOrder type
                                            <div key={order._id} className="border border-border rounded-lg p-4 flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold">
                                                        Order #{order.razorpayOrder?.receipt || order.receiptId || "N/A"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                                                    <p className="text-sm font-medium">Status: {order.orderStatus}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-lg">₹{(order.amount).toLocaleString('en-IN')}</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-1 bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                                                        onClick={() => navigate(`/profile/orders/${order._id}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </main>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyOrders;